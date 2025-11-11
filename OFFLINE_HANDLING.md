# Offline Handling & Connection Requirements

This document describes how the app handles offline scenarios and enforces internet connectivity requirements.

## Overview

**This app requires an active internet connection to function.** When the internet connection is lost, the app will display a blocking screen that prevents usage until the connection is restored. The app automatically detects when the connection returns and redirects users to the dashboard.

## Key Features

### 1. **Offline Detection & Blocking Screen**

The app monitors the network status in real-time using the `OfflineDetector` component.

**Location:** `src/components/offline-detector.tsx`

**Features:**
- Displays a **full-screen blocking overlay** when the connection is lost
- Prevents all app usage until connection is restored
- Shows animated "Reconnecting..." state when connection returns
- Automatically redirects to dashboard when connection is restored
- Provides "Retry Connection" button for manual reconnection attempts

**Behavior:**
```
Internet goes down → Shows full-screen "No Internet Connection" blocking screen
Internet comes back → Shows "Reconnecting..." animation → Redirects to dashboard (after 1s)
```

### 2. **Offline Fallback Page**

When users try to navigate to a page while offline and it's not in the cache, they see the offline fallback page.

**Location:** `public/offline.html`

**Features:**
- Clean, modern UI explaining that internet is required
- Clear messaging that the app requires connectivity
- "Retry Connection" button to manually check connection
- Auto-detects when connection is restored
- Automatically redirects to dashboard when back online
- Periodic connection checks every 5 seconds

### 3. **Service Worker Caching**

The PWA uses intelligent caching strategies for different types of content.

**Location:** `next.config.ts`

**Caching Strategies:**

| Content Type | Strategy | Cache Duration |
|--------------|----------|----------------|
| Static Assets (images, fonts) | StaleWhileRevalidate | 24 hours |
| JavaScript & CSS | StaleWhileRevalidate | 24 hours |
| API Calls (GET) | NetworkFirst (10s timeout) | 24 hours |
| Key Pages (dashboard, log-workout, log-activity) | NetworkFirst (5s timeout) | 24 hours |
| Google Fonts | CacheFirst | 365 days |

**NetworkFirst Strategy:**
1. Try to fetch from network
2. If network fails or times out, serve from cache
3. Update cache with fresh data when available

### 4. **Network Status Hook**

A custom React hook for checking network status in client components.

**Location:** `src/hooks/useNetworkStatus.ts`

**Usage:**
```typescript
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

function MyComponent() {
  const { isOnline, isReconnecting, checkConnection } = useNetworkStatus()
  
  if (!isOnline) {
    return <div>You're offline</div>
  }
  
  // Component logic...
}
```

**Utility Functions:**
- `isNetworkError(error)` - Detects if an error is network-related
- `getErrorMessage(error)` - Returns user-friendly error messages

### 5. **Health Check Endpoint**

A simple API endpoint for verifying server connectivity.

**Location:** `src/app/api/health/route.ts`

**Endpoints:**
- `GET /api/health` - Returns JSON with status and timestamp
- `HEAD /api/health` - Returns 200 OK (used for quick connectivity checks)

### 6. **Error Boundary Component**

A React error boundary for catching and handling errors gracefully.

**Location:** `src/components/error-boundary.tsx`

**Features:**
- Catches React errors and displays user-friendly error UI
- Detects network errors vs. other errors
- Provides "Try Again" and "Go Home" actions
- Shows detailed error information (collapsed by default)

**Usage:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## User Experience Flow

### When Internet Goes Down

1. **Immediate Blocking**
   - Full-screen overlay covers the entire app
   - Large animated WiFi-off icon with red pulsing glow
   - Clear message: "No Internet Connection"
   - Explanation: "This app requires an active internet connection to work"

2. **Complete Usage Block**
   - User cannot interact with any part of the app
   - All background content is blurred and inaccessible
   - "Retry Connection" button available for manual checks

3. **Status Indicator**
   - Red pulsing dot showing "Offline" status
   - Note that app will automatically reconnect

### When Internet Comes Back

1. **Automatic Detection**
   - App instantly detects connection restoration
   - Blocking overlay changes to "Reconnecting..." state
   - Icon changes to spinning refresh icon (green)

2. **Automatic Recovery**
   - Redirects to dashboard after 1 second
   - Page refreshes to load fresh data
   - All functionality restored

3. **Seamless Transition**
   - No user action required
   - Green pulsing dot shows "Reconnecting" status
   - Smooth transition back to normal operation

## Implementation Details

### Auto-Redirect Logic

```typescript
// From offline-detector.tsx
const handleOnline = () => {
  setIsOnline(true)
  setIsReconnecting(true)
  
  // Wait 1 second to ensure stable connection, then redirect to dashboard
  setTimeout(() => {
    router.push('/dashboard')
    router.refresh()
    setIsReconnecting(false)
  }, 1000)
}
```

### Cache Configuration

The service worker is configured to:
- Cache all static assets
- Cache API responses with network-first strategy
- Use fallback for offline navigation
- Skip waiting for immediate activation

### Online-Only Application

This app requires internet connectivity:
- ❌ No offline access to features
- ❌ App is completely blocked when offline
- ✅ Full functionality when online
- ✅ Automatic reconnection when internet returns
- ✅ Service worker caching for faster loading (not offline access)

## Testing Offline Functionality

### In Chrome DevTools

1. Open DevTools (F12)
2. Go to "Network" tab
3. Change throttling to "Offline"
4. **Observe the full-screen blocking overlay**
5. Try interacting with the app (should be completely blocked)
6. Click "Retry Connection" button (won't work until actually online)
7. Change back to "Online"
8. **Watch the automatic reconnection and redirect to dashboard**

### In Browser

1. Disconnect from internet (WiFi/Ethernet)
2. Open or refresh the app
3. **See the full-screen blocking screen**
4. Verify you cannot access any features
5. Reconnect to internet
6. **Watch automatic "Reconnecting..." state and redirect**

### Expected Behavior

- ✅ Full-screen overlay appears immediately when offline
- ✅ All app content is blocked and blurred
- ✅ "Retry Connection" button is visible
- ✅ Status shows red "Offline" indicator
- ✅ When online: Shows green "Reconnecting" state
- ✅ Automatically redirects to dashboard after 1 second
- ✅ Fresh data loads on dashboard

## Best Practices

### For Developers

1. **Always handle errors in data fetching**
   ```typescript
   try {
     const data = await fetchData()
   } catch (error) {
     console.error('Error:', error)
     // Show fallback UI
   }
   ```

2. **Use the network status hook for real-time status**
   ```typescript
   const { isOnline } = useNetworkStatus()
   ```

3. **Wrap critical components in ErrorBoundary**
   ```tsx
   <ErrorBoundary>
     <CriticalFeature />
   </ErrorBoundary>
   ```

4. **Test offline scenarios regularly**
   - Use DevTools offline mode
   - Test slow 3G connections
   - Verify cache strategies work

### For Users

1. **Maintain stable internet connection** - The app requires connectivity to work
2. **Install the PWA** for the best experience and faster loading
3. **Watch for the blocking screen** if connection is lost
4. **Wait for automatic reconnection** - No action needed when internet returns
5. **Use "Retry Connection" button** if automatic reconnection doesn't work

## Configuration

### Modify Timeout Settings

In `next.config.ts`:

```typescript
networkTimeoutSeconds: 10  // Adjust timeout before using cache
```

### Change Reconnection Delay

In `src/components/offline-detector.tsx`:

```typescript
setTimeout(() => {
  router.push('/dashboard')
  router.refresh()
  setIsReconnecting(false)
}, 1000)  // Adjust delay (in milliseconds) - default is 1 second
```

### Customize Offline Page

Edit `public/offline.html` to customize the offline experience.

## Troubleshooting

### Offline Detection Not Working

1. Check if service worker is registered
2. Verify browser supports `navigator.onLine`
3. Check console for errors

### Pages Not Available Offline

1. Visit pages while online to cache them
2. Check service worker caching strategy
3. Verify cache is not full (check size limits)

### Auto-Redirect Not Working

1. Check console for errors
2. Verify offline-detector is mounted in layout
3. Test the online/offline events manually

## Future Enhancements

Potential improvements:

- [ ] Queue failed API requests for retry when back online
- [ ] Show sync status indicator
- [ ] Add background sync for data updates
- [ ] Implement optimistic UI updates
- [ ] Add offline data editing with conflict resolution
- [ ] Periodic background sync for fresh data

## Related Files

- `src/app/layout.tsx` - Mounts OfflineDetector
- `next.config.ts` - PWA and caching configuration
- `public/manifest.json` - PWA manifest
- `public/offline.html` - Offline fallback page
- `src/components/offline-detector.tsx` - Connection monitor
- `src/hooks/useNetworkStatus.ts` - Network status utilities
- `src/components/error-boundary.tsx` - Error handling
- `src/app/api/health/route.ts` - Health check endpoint

