# HostelEase Mobile App - Capacitor Setup Guide

## Overview
This guide covers building and deploying HostelEase as a native mobile app for iOS and Android using Capacitor.

## Project Structure
```
Frontend/
├── capacitor.config.ts        # Main Capacitor configuration
├── android/                   # Android native project
├── ios/                       # iOS native project
├── dist/                      # Web build output
└── src/
    └── app/
        └── core/services/
            └── capacitor.service.ts   # Capacitor plugin wrapper
```

## Prerequisites

### For Both Platforms
- Node.js 16+
- npm or yarn
- Capacitor CLI: `npm install -g @capacitor/cli`

### For Android Development
- Android Studio
- Android SDK (API 24+)
- Java Development Kit (JDK 11+)
- ANDROID_SDK_ROOT environment variable set

### For iOS Development
- macOS
- Xcode 13+
- CocoaPods
- iOS deployment target: 12.0+

## Installation & Setup

### 1. Build the Angular App
```bash
cd Frontend
npm install
npm run build
```

### 2. Sync with Platforms
```bash
npx cap sync
```

This command:
- Copies web assets to native projects
- Updates native plugin registrations
- Creates platform-specific configurations

## Development Workflows

### Web Development
```bash
# Watch mode for development
npm start
```

### Testing on Android Emulator/Device
```bash
# 1. Build and sync
npm run build:mobile

# 2. Open Android project in Android Studio
npm run open:android

# 3. Run from Android Studio or:
npx cap run android
```

### Testing on iOS Simulator/Device
```bash
# 1. Build and sync
npm run build:mobile

# 2. Open iOS project in Xcode
npm run open:ios

# 3. Run from Xcode or:
npx cap run ios
```

## Available Commands

### Build & Sync
```bash
npm run build:mobile      # Build Angular + sync platforms
npm run sync:android      # Sync Android only
npm run sync:ios          # Sync iOS only
```

### Open IDEs
```bash
npm run open:android      # Open Android Studio
npm run open:ios          # Open Xcode
```

### Development
```bash
npm start                 # Serve Angular for web
npm run dev:mobile        # Serve on all network interfaces (0.0.0.0)
```

## Using Capacitor Plugins

### Camera Plugin
```typescript
import { CapacitorService } from '@app/core/services/capacitor.service';

constructor(private capacitorService: CapacitorService) {}

async capturePhoto() {
  const photo = await this.capacitorService.takePhoto();
  if (photo) {
    // Use photo data
  }
}
```

### Geolocation Plugin
```typescript
async getLocation() {
  const location = await this.capacitorService.getLocation();
  if (location) {
    console.log(`Lat: ${location.latitude}, Lng: ${location.longitude}`);
  }
}
```

### Local Notifications
```typescript
async notifyUser() {
  await this.capacitorService.sendNotification(
    'Complaint Update',
    'Your complaint has been resolved'
  );
}
```

### Network Status
```typescript
async checkConnection() {
  const status = await this.capacitorService.getNetworkStatus();
  console.log(`Connected: ${status.connected}, Type: ${status.type}`);
}

// Monitor network changes
this.capacitorService.watchNetworkStatus((connected) => {
  console.log(`Network ${connected ? 'connected' : 'disconnected'}`);
});
```

### Device Information
```typescript
async getDeviceDetails() {
  const info = await this.capacitorService.getDeviceInfo();
  const id = await this.capacitorService.getDeviceId();
}
```

## Configuration

### capacitor.config.ts Options

```typescript
// App ID (Bundle ID for iOS, Package ID for Android)
appId: 'com.hostelenase.app'

// Display name in app stores
appName: 'HostelEase'

// Web assets directory
webDir: 'dist/hostelenase-frontend'

// Server configuration
server: {
  androidScheme: 'https',  // Use HTTPS for Android
  allowMixedContent: true  // Allow HTTP content (development)
}

// iOS specific settings
ios: {
  limitsNavigationsToAppBoundDomains: true  // Security setting
}

// Android specific settings
android: {
  allowMixedContent: true  // Allow mixed HTTP/HTTPS
}
```

## Platform-Specific Setup

### Android Requirements
1. **Android SDK Installation:**
   - Min SDK: 24 (Android 7.0)
   - Target SDK: 34 (Android 14)

2. **Gradle Build:**
   ```bash
   cd android
   ./gradlew assembleDebug    # Debug build
   ./gradlew assembleRelease  # Release build
   ```

3. **Signing for Play Store:**
   - Generate keystore: `keytool -genkey -v -keystore app.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias app`
   - Configure signing in `android/app/build.gradle`

### iOS Requirements
1. **Cocoapods Setup:**
   ```bash
   cd ios/App
   pod install
   ```

2. **Xcode Signing:**
   - Open `ios/App/App.xcworkspace`
   - Select Team ID
   - Configure Signing Certificates

3. **Build for App Store:**
   ```bash
   xcodebuild -workspace ios/App/App.xcworkspace \
     -scheme App \
     -configuration Release \
     -derivedDataPath build
   ```

## Debugging

### Android Debugging
```bash
# View device logs
adb logcat | grep "capacitor"

# Debug app directly
adb shell am start -D com.hostelenase.app
```

### iOS Debugging
```bash
# View simulator logs
xcrun simctl launch booted com.hostelenase.app

# Use Xcode console for debugging
# (Xcode menu → Window → Console)
```

### Web Debugging
- Chrome DevTools: `chrome://inspect`
- Remote debugging for connected devices
- USB debugging must be enabled on devices

## Common Issues & Solutions

### Issue: "dist folder not found"
```bash
# Solution: Rebuild Angular
npm run build
npx cap sync
```

### Issue: "Pod install fails on iOS"
```bash
# Solution: Update CocoaPods
cd ios/App
pod deintegrate
pod install
```

### Issue: "Android Gradle build fails"
```bash
# Solution: Clear Gradle cache
cd android
./gradlew clean
./gradlew assembleDebug
```

### Issue: "Network calls fail in app"
```bash
# Solution: Check CORS headers
# Configure backend CORS for mobile app domain
// Backend (server.js)
app.use(cors({
  origin: ['http://localhost:3000', 'capacitor://localhost']
}));
```

## Production Deployment

### Building for Release

**Android:**
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

**iOS:**
```bash
npm run build
npx cap sync ios
# Open ios/App/App.xcworkspace in Xcode
# Select "Generic iOS Device"
# Product → Archive
```

### App Store Submission

**Android Play Store:**
1. Build signed APK/AAB
2. Create app listing on Google Play Console
3. Upload build, screenshots, and description
4. Submit for review

**iOS App Store:**
1. Create App ID in Apple Developer
2. Build archive in Xcode
3. Upload using Transporter
4. Submit for review via App Store Connect

## Performance Optimization

### Bundle Size Optimization
```typescript
// In angular.json
"optimization": true,
"sourceMap": false,
"namedChunks": false,
"aot": true,
"buildOptimizer": true
```

### Runtime Performance
- Use ChangeDetectionStrategy.OnPush
- Lazy load modules
- Optimize image sizes for mobile
- Minimize plugin usage

## Next Steps

1. **Add Authentication:** Implement JWT token handling for API calls
2. **Offline Support:** Add Service Workers for offline capability
3. **Push Notifications:** Integrate Firebase Cloud Messaging
4. **Analytics:** Add Capacitor Analytics or Firebase Analytics
5. **App Updates:** Implement Capacitor App Update plugin

## Useful Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Development](https://developer.android.com/)
- [iOS Development](https://developer.apple.com/)
- [Angular Mobile Guide](https://angular.io/guide/service-worker-intro)

## Support

For issues or questions:
1. Check Capacitor documentation
2. Review platform-specific error logs
3. Consult Android/iOS developer documentation
4. Open issue in HostelEase repository
