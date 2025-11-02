# API Usage Guide - Bhada24 Frontend

This guide explains how to make API calls in the Bhada24 frontend with automatic token management, refresh, and error handling.

## 🎯 Overview

All API calls in this project use a centralized API client (`src/apiconfig/api.ts`) that:
- ✅ Automatically attaches authentication tokens
- ✅ Automatically refreshes expired tokens
- ✅ Retries failed requests after token refresh
- ✅ Redirects to login when authentication fails
- ✅ Tracks token expiry (24 hours by default)
- ✅ Proactively refreshes tokens 5 minutes before expiry

---

## 📋 Table of Contents

1. [Basic API Calls](#basic-api-calls)
2. [Using the useApiCall Hook](#using-the-useapicall-hook)
3. [Token Management](#token-management)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)
6. [Migration Guide](#migration-guide)

---

## 🔧 Basic API Calls

### Method 1: Direct API Functions (Recommended for simple calls)

```typescript
import { getAllOffers, getUserByMobile, updateUser } from '@/apiconfig/api';

// Get all offers
const offers = await getAllOffers();

// Get user by mobile
const user = await getUserByMobile('9876543210');

// Update user
await updateUser({ userId: '123', name: 'John Doe' });
```

### Method 2: Using the Request Function (For custom endpoints)

```typescript
import { request } from '@/apiconfig/api';

// GET request
const data = await request('/api/custom/endpoint', 'GET');

// POST request with body
const result = await request(
  '/api/custom/endpoint',
  'POST',
  { key: 'value' }
);

// With query parameters
const filtered = await request(
  '/api/items',
  'GET',
  undefined,
  { page: 1, limit: 10 }
);
```

---

## 🎣 Using the useApiCall Hook

The `useApiCall` hook provides automatic token management, loading states, and error handling.

### Basic Usage

```typescript
import { useApiCall } from '@/hooks/useApiCall';
import { getAllOffers } from '@/apiconfig/api';

function MyComponent() {
  const [offers, setOffers] = useState([]);
  const { execute, loading, error } = useApiCall();

  const fetchOffers = async () => {
    await execute(async () => {
      const response = await getAllOffers();
      setOffers(response);
      return response;
    });
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render offers */}</div>;
}
```

### Advanced Usage with Options

```typescript
const { execute } = useApiCall({
  onSuccess: (data) => {
    console.log('Success:', data);
    toast.success('Data loaded successfully!');
  },
  onError: (error) => {
    console.error('Error:', error);
  },
  redirectOnAuthError: true,  // Redirect to login on 401 (default)
  showErrorToast: true,        // Show error toasts (default)
});

await execute(
  async () => {
    return await getAllOffers();
  },
  {
    // Override options for this specific call
    showErrorToast: false,
  }
);
```

### Real-World Example (Cart Page)

```typescript
import { useState, useEffect } from 'react';
import { useApiCall } from '@/hooks/useApiCall';
import { getAllOffers } from '@/apiconfig/api';

const Cart = () => {
  const [offers, setOffers] = useState([]);
  const { execute: fetchOffersApi, loading } = useApiCall();

  const fetchOffers = async () => {
    await fetchOffersApi(
      async () => {
        const response = await getAllOffers();
        const activeOffers = response.filter(
          (offer) => offer.status === 'ACTIVE'
        );
        setOffers(activeOffers);
        return activeOffers;
      },
      {
        showErrorToast: true,
        redirectOnAuthError: true,
      }
    );
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return <div>{loading ? 'Loading...' : 'Content'}</div>;
};
```

---

## 🔐 Token Management

### How It Works

1. **Token Storage**: Tokens are stored in both `sessionStorage` (primary) and `localStorage` (backup)
2. **Expiry Tracking**: Token expiry time is stored alongside the token (default: 24 hours)
3. **Proactive Refresh**: Tokens are automatically refreshed 5 minutes before expiry
4. **Auto-Retry**: Failed requests due to 401 errors automatically retry after token refresh

### Manual Token Operations

```typescript
import {
  getToken,
  setToken,
  clearToken,
  isTokenValid,
  isTokenExpired,
  refreshToken,
  ensureValidToken,
} from '@/services/authService';

// Get current token
const token = getToken();

// Set a new token (with custom expiry in hours)
setToken('your-jwt-token', 24); // 24 hours

// Check if token is valid (not expiring in next 5 minutes)
if (!isTokenValid()) {
  await refreshToken();
}

// Check if token is expired
if (isTokenExpired()) {
  clearToken();
  navigate('/login');
}

// Ensure valid token (auto-refresh if needed)
const validToken = await ensureValidToken();
if (!validToken) {
  // User needs to login
  navigate('/login');
}
```

### Token Lifecycle

```
User Login
    ↓
Set Token + Expiry (24h)
    ↓
[23h 55m] Proactive Refresh
    ↓
New Token + Expiry (24h)
    ↓
[If API returns 401]
    ↓
Auto Refresh Token
    ↓
Retry Failed Request
    ↓
[If Refresh Fails]
    ↓
Clear Token → Redirect to Login
```

---

## ⚠️ Error Handling

### Automatic Error Handling

The `request()` function and `useApiCall` hook automatically handle:

- **401 Unauthorized**: Auto-refresh token and retry
- **Token Expired**: Refresh and retry, or redirect to login
- **Network Errors**: Display error message
- **Other Errors**: Display generic error message

### Custom Error Handling

```typescript
import { request } from '@/apiconfig/api';

try {
  const data = await request('/api/endpoint', 'GET');
} catch (error) {
  if (error.message.includes('401')) {
    // Authentication error (already handled automatically)
  } else if (error.message.includes('404')) {
    // Not found
  } else {
    // Generic error
  }
}
```

### Error Handling with useApiCall

```typescript
const { execute, error } = useApiCall({
  onError: (error) => {
    // Custom error handling
    if (error.message.includes('404')) {
      toast.error('Item not found');
    }
  },
  showErrorToast: false, // Disable automatic toasts
});
```

---

## ✅ Best Practices

### 1. Always Use the Centralized API Client

❌ **Don't do this:**
```typescript
const response = await fetch('https://bhada24-core.onrender.com/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

✅ **Do this:**
```typescript
import { request } from '@/apiconfig/api';
const users = await request('/api/users', 'GET');
```

### 2. Use useApiCall for Component-Level API Calls

❌ **Don't do this:**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await getAllOffers();
    // ...
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

✅ **Do this:**
```typescript
const { execute, loading, error } = useApiCall();

const fetchData = async () => {
  await execute(async () => {
    return await getAllOffers();
  });
};
```

### 3. Don't Manually Manage Tokens in API Calls

❌ **Don't do this:**
```typescript
const token = await generateToken({ key: 'BHADA24', password: 'P@55word' });
const data = await request('/api/endpoint', 'GET', undefined, undefined, token);
```

✅ **Do this:**
```typescript
// Token is automatically managed
const data = await request('/api/endpoint', 'GET');
```

### 4. Handle Token Expiry Gracefully

✅ **Do this:**
```typescript
import { ensureValidToken } from '@/services/authService';

const MyComponent = () => {
  useEffect(() => {
    const init = async () => {
      const token = await ensureValidToken();
      if (!token) {
        // Redirect to login is handled automatically
        return;
      }
      // Proceed with data fetching
    };
    init();
  }, []);
};
```

### 5. Use TypeScript Types

✅ **Do this:**
```typescript
interface User {
  userId: string;
  name: string;
  phone: string;
}

const user = await request<User>('/api/users/123', 'GET');
// user is typed as User
```

---

## 🔄 Migration Guide

### Migrating Old Code to New Token Management

#### Before:
```typescript
const fetchOffers = async () => {
  try {
    const tokenData = await generateToken({ 
      key: 'BHADA24', 
      password: 'P@55word' 
    });
    const token = tokenData.token;
    localStorage.setItem('bhada24_token', token);
    
    const response = await request(
      '/api/common/offer/all',
      'GET',
      undefined,
      undefined,
      token
    );
    
    if (response.responseCode === 200) {
      setOffers(response.responseData);
    }
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    toast.error('Failed to load offers');
  }
};
```

#### After:
```typescript
import { getAllOffers } from '@/apiconfig/api';
import { useApiCall } from '@/hooks/useApiCall';

const { execute } = useApiCall();

const fetchOffers = async () => {
  await execute(async () => {
    const response = await getAllOffers();
    setOffers(response);
    return response;
  });
};
```

---

## 📚 Available API Functions

All these functions are available in `@/apiconfig/api`:

```typescript
// Authentication
generateToken(payload)

// Users
registerUser(payload)
getUserByMobile(mobile)
getAllUsers()
updateUser(payload)

// Offers
getAllOffers()
getAllValidOffers()
createOffer(payload, token?)

// Images
uploadBase64Image(payload)

// Notifications
registerFCMToken(payload, token?)
updateFCMToken(payload, token?)
sendNotificationToUser(payload, token?)

// Generic request
request<T>(path, method, body?, params?, token?)
```

---

## 🐛 Troubleshooting

### Issue: "Invalid or expired JWT token"

**Solution**: This is automatically handled. The system will:
1. Attempt to refresh the token
2. Retry the failed request
3. If refresh fails, redirect to login

### Issue: Multiple token refresh attempts

**Solution**: The system prevents multiple retries (max 1 retry per request)

### Issue: Token not persisting across sessions

**Solution**: Check that localStorage and sessionStorage are enabled in the browser

### Issue: Infinite redirect to login

**Solution**: Ensure you're not on the login page when redirect happens (automatic check)

---

## 📞 Support

For issues or questions about API usage:
1. Check this guide
2. Review `src/apiconfig/api.ts`
3. Review `src/services/authService.ts`
4. Review `src/hooks/useApiCall.ts`

---

## 🎉 Summary

- ✅ Use `useApiCall` hook for component-level API calls
- ✅ Use direct API functions (`getAllOffers`, etc.) for simple calls
- ✅ Never manually manage tokens
- ✅ Token refresh is automatic
- ✅ Error handling is automatic
- ✅ Authentication redirects are automatic

**The token management system works seamlessly in the background!** 🚀
