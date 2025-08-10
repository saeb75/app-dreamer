# AuthGuard System Documentation

## Overview

The AuthGuard system provides a comprehensive authentication and authorization solution for the React Native app. It handles user authentication state, loading states, error handling, and automatic redirects.

## Components

### 1. AuthGuard Component

**Location**: `app/components/AuthGuard/index.tsx`

**Purpose**: Main authentication guard that protects routes and handles auth state.

**Props**:

- `children`: React nodes to render when authenticated
- `fallback`: Optional loading component (defaults to ActivityIndicator)
- `requireAuth`: Boolean to determine if authentication is required (default: true)
- `redirectTo`: Path to redirect when not authenticated (default: '/login')

**Features**:

- Automatic authentication checking
- Loading state management
- Error handling with retry functionality
- Flexible redirect configuration
- Support for both protected and public routes

**Usage**:

```tsx
// Protected route (requires authentication)
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>

// Protected route with custom loading
<AuthGuard fallback={<CustomLoading />}>
  <ProtectedComponent />
</AuthGuard>

// Public route (no authentication required)
<AuthGuard requireAuth={false}>
  <PublicComponent />
</AuthGuard>
```

### 2. PublicRoute Component

**Location**: `app/components/PublicRoute/index.tsx`

**Purpose**: Wrapper for pages that should be accessible without authentication.

**Props**:

- `children`: React nodes to render
- `fallback`: Optional loading component

**Usage**:

```tsx
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

### 3. LoadingScreen Component

**Location**: `app/components/LoadingScreen/index.tsx`

**Purpose**: Customizable loading screen with spinner and message.

**Props**:

- `message`: Loading message text (default: 'Loading...')
- `color`: Spinner color (default: '#0000ff')

**Usage**:

```tsx
<LoadingScreen message="Checking authentication..." color="#007AFF" />
```

## Implementation in Root Layout

The AuthGuard is implemented in `app/_layout.tsx` to protect all routes by default:

```tsx
<AuthGuard fallback={<LoadingScreen message="Checking authentication..." />}>
  <Stack>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="modal" />
    <Stack.Screen name="login" />
  </Stack>
</AuthGuard>
```

## Authentication Flow

1. **App Initialization**: AuthGuard checks for existing token
2. **Token Validation**: Calls `getUser()` to validate token with server
3. **State Management**: Updates user state based on response
4. **Loading States**: Shows loading while checking authentication
5. **Error Handling**: Displays error with retry option if auth check fails
6. **Redirect Logic**: Redirects to login if not authenticated

## Error Handling

The AuthGuard includes comprehensive error handling:

- **Network Errors**: Displays error message with retry button
- **Token Expiry**: Automatically redirects to login
- **Server Errors**: Shows user-friendly error messages
- **Retry Mechanism**: Allows users to retry failed auth checks

## Usage Examples

### Protecting a Tab Screen

```tsx
// app/(tabs)/create.tsx
export default function CreateScreen() {
  return (
    <AuthGuard>
      <CreateContent />
    </AuthGuard>
  );
}
```

### Public Login Page

```tsx
// app/login.tsx
export default function Login() {
  return (
    <PublicRoute>
      <LoginContent />
    </PublicRoute>
  );
}
```

### Custom Loading Screen

```tsx
<AuthGuard fallback={<LoadingScreen message="Verifying your account..." />}>
  <Dashboard />
</AuthGuard>
```

## Integration with Zustand Store

The AuthGuard integrates with the `useAuthStore`:

- **State**: `user`, `token`, `isLoading`
- **Actions**: `getUser()`, `loginGoogle()`, `loginApple()`, `logout()`
- **Persistence**: AsyncStorage for token management

## Security Features

1. **Token Validation**: Server-side token verification
2. **Automatic Logout**: Token expiry handling
3. **Secure Storage**: AsyncStorage for token persistence
4. **Route Protection**: Prevents unauthorized access
5. **Session Management**: Proper cleanup on logout

## Best Practices

1. **Always wrap protected routes** with AuthGuard
2. **Use PublicRoute** for login/register pages
3. **Provide meaningful loading messages** for better UX
4. **Handle errors gracefully** with retry options
5. **Test authentication flows** thoroughly

## Troubleshooting

### Common Issues

1. **Infinite Loading**: Check if `getUser()` is resolving properly
2. **Redirect Loops**: Ensure login page uses `PublicRoute`
3. **Token Issues**: Verify AsyncStorage implementation
4. **Network Errors**: Check API endpoints and connectivity

### Debug Tips

- Check console logs for auth errors
- Verify token storage in AsyncStorage
- Test with different network conditions
- Monitor auth state changes in Zustand store
