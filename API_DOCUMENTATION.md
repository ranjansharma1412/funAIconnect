# API Infrastructure Documentation

## Overview

This project includes a comprehensive API handling infrastructure with:
- ✅ Axios-based HTTP client
- ✅ Request/Response interceptors
- ✅ Automatic network connectivity checks
- ✅ Global error handling with user-friendly modals
- ✅ TypeScript support

## File Structure

```
src/
├── services/
│   ├── apiClient.ts          # Axios instance configuration
│   ├── apiInterceptors.ts    # Request/Response interceptors
│   ├── errorHandler.ts       # Error parsing and formatting
│   ├── modalStore.ts         # Global modal state management
│   ├── exampleApi.ts         # Example API service
│   └── index.ts              # Exports
├── components/
│   ├── molecules/
│   │   └── ErrorModal.tsx    # Reusable error modal component
│   └── organisms/
│       └── ErrorModalProvider.tsx  # Global modal provider
├── utils/
│   └── networkUtils.ts       # Network connectivity utilities
└── types/
    └── api.types.ts          # TypeScript type definitions
```

## Configuration

### 1. Update API Base URL

Edit `src/services/apiClient.ts`:

```typescript
const API_CONFIG = {
  BASE_URL: 'https://your-api-url.com', // Update this
  TIMEOUT: 30000,
  // ...
};
```

### 2. Add Authentication (Optional)

Uncomment and modify the auth section in `src/services/apiInterceptors.ts`:

```typescript
// Add authentication token if available
const token = await AsyncStorage.getItem('authToken');
if (token && config.headers) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## Usage

### Making API Calls

Create API service files following the pattern in `exampleApi.ts`:

```typescript
import apiClient from './services/apiInterceptors';

export const fetchUserProfile = async (userId: string) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const updateProfile = async (userId: string, data: any) => {
  const response = await apiClient.put(`/users/${userId}`, data);
  return response.data;
};
```

### Using in Components

```typescript
import { fetchUserProfile } from '../services/exampleApi';

const MyComponent = () => {
  const loadProfile = async () => {
    try {
      const profile = await fetchUserProfile('123');
      console.log(profile);
    } catch (error) {
      // Error modal will automatically show
      console.error('Failed to load profile:', error);
    }
  };

  return (
    <Button onPress={loadProfile} title="Load Profile" />
  );
};
```

## Features

### 1. Automatic Network Check

Before every API request, the system checks internet connectivity:
- ✅ If offline → Shows "No Internet Connection" modal
- ✅ Request is cancelled to save resources

### 2. Error Handling

All API errors are automatically caught and displayed in a user-friendly modal:

| Error Type | Icon | Title | Example Message |
|------------|------|-------|-----------------|
| Network Error | wifi-off | No Internet Connection | Please check your internet connection |
| Timeout | clock-alert-outline | Request Timeout | Request timeout. Please try again. |
| Server Error (5xx) | server-network-off | Server Error | Server error. Please try again later. |
| Client Error (4xx) | alert-circle-outline | Error | Resource not found / Unauthorized |
| Validation Error | alert-outline | Validation Error | Invalid request data |

### 3. Error Modal Customization

You can manually show error modals from anywhere:

```typescript
import modalStore from '../services/modalStore';

// Show custom error
modalStore.showError({
  title: 'Custom Error',
  message: 'Something went wrong!',
  icon: 'alert',
  iconColor: '#FF6B6B',
  buttonText: 'Try Again',
  onButtonPress: () => {
    // Custom action
    modalStore.hideError();
  },
});

// Hide modal
modalStore.hideError();
```

### 4. Network Utilities

Check connectivity manually:

```typescript
import { checkInternetConnection, getNetworkState } from '../utils/networkUtils';

// Check if connected
const isConnected = await checkInternetConnection();

// Get detailed network state
const networkState = await getNetworkState();
console.log(networkState.type); // 'wifi', 'cellular', etc.
```

## Error Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | boolean | false | Show/hide modal |
| `title` | string | - | Modal title |
| `message` | string | - | Error message |
| `icon` | string | 'alert-circle-outline' | Icon name (MaterialCommunityIcons) |
| `iconColor` | string | '#FF6B6B' | Icon color |
| `showCloseButton` | boolean | true | Show close (X) button |
| `buttonText` | string | 'Okay' | Action button text |
| `onClose` | function | - | Close button callback |
| `onButtonPress` | function | - | Action button callback |

## Troubleshooting

### TypeScript Errors

If you see module resolution errors, try:
```bash
# Clean and rebuild
npm run android:clean
npm run android
```

### Network Detection Not Working

Ensure `@react-native-community/netinfo` is properly linked:
```bash
cd ios && pod install && cd ..
```

### Modal Not Showing

1. Verify `ErrorModalProvider` is in `App.tsx`
2. Check that interceptors are imported: `import './src/services/apiInterceptors'`

## Examples

See `src/services/exampleApi.ts` for complete CRUD examples.

## Next Steps

1. Update `API_CONFIG.BASE_URL` in `apiClient.ts`
2. Add your API endpoints in new service files
3. Customize error messages in `errorHandler.ts`
4. Style the error modal to match your design system
