# HostelEase Mobile App - Quick Start

## 🚀 Get Started in 5 Minutes

### Step 1: Build the App
```bash
cd Frontend
npm install
npm run build:mobile
```

### Step 2: Choose Your Platform

#### 🤖 Android
```bash
npm run open:android
```
Then in Android Studio: **Run** → **Run 'app'**

#### 🍎 iOS (Mac only)
```bash
npm run open:ios
```
Then in Xcode: **Product** → **Run**

## ✨ Key Features Ready

✅ **Camera** - Capture photos for complaint images
✅ **Geolocation** - Track complaint location
✅ **Notifications** - Get real-time updates
✅ **Offline Support** - Works without internet
✅ **Network Detection** - Knows when connection is lost

## 📱 Testing Commands

```bash
# Quick build & sync
npm run build:mobile

# Just sync changes (after code edit)
npm run sync:android    # or sync:ios

# Serve locally for testing
npm start               # Web: http://localhost:4200
npm run dev:mobile      # Mobile: http://0.0.0.0:4200
```

## 🔧 Use Capacitor Features in Your Code

```typescript
// Inject the service
constructor(private capacitorService: CapacitorService) {}

// Take a photo
const photo = await this.capacitorService.takePhoto();

// Get location
const location = await this.capacitorService.getLocation();

// Send notification
await this.capacitorService.sendNotification('Title', 'Message');

// Check internet
const { connected } = await this.capacitorService.getNetworkStatus();
```

## 📝 Platform Requirements

### Android
- Android Studio installed
- Android SDK API 24+
- JDK 11+

### iOS
- Xcode 13+
- macOS
- CocoaPods

## 🐛 Troubleshooting

**App won't sync?**
```bash
npx cap sync --force
```

**Android build fails?**
```bash
cd android && ./gradlew clean && ./gradlew assembleDebug
```

**iOS pod issues?**
```bash
cd ios/App && pod deintegrate && pod install
```

## 📚 Full Documentation
See `CAPACITOR_SETUP_GUIDE.md` for detailed setup and deployment.

## 🎯 Next: Deploy to Play Store / App Store
- See CAPACITOR_SETUP_GUIDE.md → Production Deployment section
