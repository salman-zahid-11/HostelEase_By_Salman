import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hostelenase.app',
  appName: 'HostelEase',
  webDir: 'dist/hostelenase-frontend',
  server: {
    androidScheme: 'https'
  },
  ios: {
    limitsNavigationsToAppBoundDomains: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
