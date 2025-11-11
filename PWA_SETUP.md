# PWA (Progressive Web App) Setup

Your Tapas app has been fully converted into a Progressive Web App! 🚀

## What's New

### 📱 Mobile-First Experience
- **Bottom Navigation**: Mobile users now have a native app-like bottom navigation bar
- **Mobile Header**: Simplified top header on mobile with logo and user profile access
- **Desktop Compatibility**: Desktop view remains unchanged with full navbar
- **Responsive Design**: Seamless experience across all devices

### 🔌 Offline Support
- **Service Worker**: Automatic caching of app resources
- **Offline Detection**: Real-time notification when internet connection is lost/restored
- **Smart Caching**: Different caching strategies for different content types:
  - Static assets (CSS, JS, images): Cached for 24 hours
  - API calls: Network-first with cache fallback
  - Fonts: Cached for extended periods

### 📲 Installable App
- **Add to Home Screen**: Users can install the app on their devices
- **Install Prompt**: Automatic prompt to install the app
- **Standalone Mode**: Runs in full-screen without browser UI
- **App Shortcuts**: Quick access to Workout and Activity logging from home screen

### 🎨 PWA Features
- **App Icons**: Multiple sizes (72x72 to 512x512) for all devices
- **Splash Screens**: Custom loading screens for iOS and Android
- **Theme Color**: Consistent dark theme (#0a0a0a)
- **Status Bar**: Styled for iOS full-screen mode
- **Safe Area Support**: Proper spacing for notched devices

## Files Added/Modified

### New Components
- `src/components/mobile-bottom-nav.tsx` - Bottom navigation for mobile
- `src/components/offline-detector.tsx` - Offline status indicator
- `src/components/pwa-install-prompt.tsx` - Install app prompt
- `src/components/mobile-header.tsx` - Simplified mobile header

### Configuration Files
- `next.config.ts` - next-pwa configuration with caching strategies
- `public/manifest.json` - PWA manifest with app metadata
- `.gitignore` - Excludes generated service worker files

### Icon Assets
- `public/icon-*.png` - App icons in multiple sizes
- `public/screenshot-*.png` - App screenshots for stores

### Scripts
- `scripts/generate-icons.js` - Generates SVG icons
- `scripts/convert-icons-to-png.js` - Converts SVG to PNG
- `scripts/create-screenshots.js` - Creates placeholder screenshots

### Updated Files
- `src/app/layout.tsx` - Added PWA meta tags and offline/install components
- `src/app/globals.css` - Added mobile app CSS (safe areas, tap highlights)
- `src/components/navbar.tsx` - Made responsive with mobile header
- All main pages - Added mobile bottom navigation and proper padding

## Development

### Running in Development Mode
```bash
npm run dev
```

**Note**: Service worker is disabled in development mode to prevent caching issues during development.

### Building for Production
```bash
npm run build
npm start
```

The service worker will be automatically generated during build.

## Testing PWA Features

### Desktop Testing
1. Open Chrome/Edge and navigate to your app
2. Look for the install icon in the address bar
3. Click to install the app
4. Test offline mode by going offline in DevTools

### Mobile Testing

#### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Open the installed app for full-screen experience

#### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. Accept the install prompt

### Testing Offline Mode
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Verify offline indicator appears
4. Try navigating - cached pages should still work

## Customization

### Update App Icons
Replace the generated icons in `/public/`:
- Use your own logo/brand
- Maintain the specified sizes
- Run `npm run generate-icons` script or manually replace

### Update Screenshots
Replace `/public/screenshot-*.png` with actual app screenshots:
- `screenshot-wide.png`: 1280x720 (desktop/tablet)
- `screenshot-narrow.png`: 750x1334 (mobile)

### Modify Manifest
Edit `/public/manifest.json` to change:
- App name and description
- Theme colors
- App shortcuts
- Categories and orientation

### Customize Caching
Edit `next.config.ts` to adjust:
- Cache durations
- Caching strategies
- URL patterns to cache

## PWA Checklist

✅ Service worker registered and caching assets
✅ Manifest.json with complete metadata
✅ App icons (multiple sizes)
✅ Offline fallback and detection
✅ Install prompt for users
✅ Mobile-optimized navigation
✅ Safe area support for notched devices
✅ Theme color and splash screens
✅ Standalone display mode
✅ App shortcuts configured

## Browser Support

- **Chrome/Edge**: Full support for all PWA features
- **Safari (iOS)**: Supports installation and offline mode
- **Firefox**: Supports most PWA features
- **Samsung Internet**: Full support

## Performance

The PWA configuration includes:
- **Smart caching**: Different strategies for different content
- **Lazy loading**: Service worker only loads when needed
- **Background sync**: (Can be added for offline form submissions)
- **Push notifications**: (Can be added for user engagement)

## Deployment

### Vercel/Netlify
These platforms automatically serve your PWA correctly. Just deploy normally.

### Custom Server
Ensure your server:
1. Serves the app over HTTPS (required for PWA)
2. Serves manifest.json with correct MIME type
3. Allows service worker registration

## Troubleshooting

### Service Worker Not Registering
- Ensure you're on HTTPS (or localhost)
- Clear browser cache and hard reload
- Check browser console for errors

### Icons Not Showing
- Verify icon files exist in `/public/`
- Check manifest.json paths
- Clear cache and reinstall

### Offline Mode Not Working
- Check if service worker is active in DevTools
- Verify caching strategies in next.config.ts
- Test with actual build (not dev mode)

### Install Prompt Not Appearing
- Make sure user hasn't dismissed it recently (7-day cooldown)
- Verify manifest.json is valid
- Check browser compatibility

## Next Steps

Consider adding:
- **Push Notifications**: Engage users with timely updates
- **Background Sync**: Sync data when connection is restored
- **Web Share API**: Let users share their achievements
- **Periodic Background Sync**: Update data in the background

## Resources

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Checklist](https://web.dev/pwa-checklist/)

