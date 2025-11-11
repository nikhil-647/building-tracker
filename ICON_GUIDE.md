# App Icon Guide

## Current Issue
The generated fire icons don't match your brand/design.

## Quick Solutions

### Option 1: Use Your Favicon (Recommended)
If your `favicon.svg` looks good, use it for app icons:

```bash
node scripts/use-favicon-for-icons.js
```

This will generate all PWA icon sizes from your existing favicon.

### Option 2: Use a Design Tool
1. Create a **512x512px** square icon in:
   - Figma
   - Canva
   - Photoshop
   - Any design tool

2. Design Tips:
   - Use simple, clear imagery
   - Works well at small sizes
   - Solid background (no transparency for best compatibility)
   - Center your logo/icon
   - Leave some padding around edges

3. Export as PNG and save as `public/icon-512x512.png`

4. Generate other sizes:
```bash
node scripts/generate-all-sizes.js
```

### Option 3: Use Free Icon Generator
Use these online tools (they're really good!):

1. **PWA Asset Generator** (Best option)
   - Visit: https://progressier.com/pwa-icons-and-ios-splash-screen-generator
   - Upload your logo
   - Downloads all sizes + splash screens
   - Just extract to `/public/`

2. **Favicon.io**
   - Visit: https://favicon.io/
   - Generate from text/emoji/image
   - Download and use as base

3. **Real Favicon Generator**
   - Visit: https://realfavicongenerator.net/
   - Upload your logo
   - Generates all formats
   - Download and replace files

### Option 4: Use an Emoji
Quick and simple for testing:

```bash
# Edit scripts/generate-emoji-icon.js with your preferred emoji
node scripts/generate-emoji-icon.js
```

### Option 5: Manual Replacement
Simply replace these files in `/public/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

Make sure they're square and match the size in the filename.

## What Makes a Good PWA Icon?

✅ **Do:**
- Keep it simple and recognizable
- Use high contrast
- Make it work at small sizes (72x72)
- Use solid background color
- Center your logo with padding

❌ **Don't:**
- Use tiny text (unreadable at small sizes)
- Use too many details
- Make background transparent (use solid color)
- Forget to test at small sizes

## Recommended Icon Design

For your "Tapas" workout app, consider:
- 🔥 Flame emoji or icon
- 💪 Dumbbell icon
- 📊 Progress chart icon
- Simple "T" letter with nice styling
- Your existing logo/brand

## Quick Fix Right Now

If you want a better icon immediately:

1. Go to https://progressier.com/pwa-icons-and-ios-splash-screen-generator
2. Upload your logo or create a simple one
3. Download the generated files
4. Replace the icons in `/public/`
5. Done! ✨

## For Developers

After replacing icons, clear browser cache:
1. Open DevTools (F12)
2. Right-click refresh button
3. "Empty Cache and Hard Reload"
4. Reinstall PWA to see new icons

## Current Icons Location
All your PWA icons are in:
```
/public/
  ├── icon-72x72.png
  ├── icon-96x96.png
  ├── icon-128x128.png
  ├── icon-144x144.png
  ├── icon-152x152.png
  ├── icon-192x192.png
  ├── icon-384x384.png
  └── icon-512x512.png
```

Just replace these files with your own and rebuild!

