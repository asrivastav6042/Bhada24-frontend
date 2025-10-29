export interface User {
  userId?: string;
  name: string;
  email?: string;
  address?: string;
  phone: string;
  role?: string;
  verified?: boolean;
  imageUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  createdAt?: string;
  updatedAt?: string;
  userStatus?: string;
}

export interface ApiResponse<T = any> {
  responseMessage?: string;
  responseData?: T | T[];
  responseCode?: number;
}
