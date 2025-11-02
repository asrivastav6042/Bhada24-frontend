# Token Management Quick Reference

## ⚡ Quick Start

### Making API Calls (Simplest Way)

```typescript
import { getAllOffers } from '@/apiconfig/api';

// That's it! Token management is automatic
const offers = await getAllOffers();
```

### Using useApiCall Hook (With Loading States)

```typescript
import { useApiCall } from '@/hooks/useApiCall';
import { getAllOffers } from '@/apiconfig/api';

function MyComponent() {
  const { execute, loading } = useApiCall();
  
  const fetchData = async () => {
    await execute(() => getAllOffers());
  };
  
  return loading ? <Spinner /> : <Content />;
}
```

## 🔑 Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| Auto Token Attach | ✅ | Tokens automatically added to all requests |
| Auto Refresh | ✅ | Tokens refresh 5min before expiry |
| Auto Retry | ✅ | Failed requests retry after token refresh |
| Error Handling | ✅ | Automatic error toasts and redirects |
| Token Expiry | ✅ | 24 hours (tracked automatically) |
| Login Redirect | ✅ | Auto redirect when auth fails |

## 📋 Common Patterns

### Pattern 1: Fetch Data on Component Mount

```typescript
const { execute } = useApiCall();

useEffect(() => {
  execute(() => getAllOffers().then(setOffers));
}, []);
```

### Pattern 2: Submit Form Data

```typescript
const { execute, loading } = useApiCall({
  onSuccess: () => toast.success('Saved!'),
});

const handleSubmit = async (data) => {
  await execute(() => updateUser(data));
};
```

### Pattern 3: Check Token Before Action

```typescript
import { ensureValidToken } from '@/services/authService';

const handleAction = async () => {
  const token = await ensureValidToken();
  if (!token) return; // Auto-redirects to login
  
  // Proceed with action
};
```

## 🚫 What NOT to Do

❌ Don't manually generate tokens
❌ Don't call `fetch()` directly for API calls
❌ Don't manually store tokens
❌ Don't manually handle 401 errors

## ✅ What to Do

✅ Use centralized API functions
✅ Use `useApiCall` hook for components
✅ Let the system handle tokens automatically
✅ Trust the auto-refresh mechanism

## 📞 Need Help?

See `API_USAGE_GUIDE.md` for complete documentation.

---

**Remember**: Token management is now fully automatic! Just import and use the API functions. 🎉
