/**
 * Capacitor Environment Configuration
 * This file contains environment-specific settings for Capacitor apps
 */

export const capacitorConfig = {
  // API Configuration
  api: {
    // Update based on your backend URL
    baseUrl: 'https://api.hostelenase.com',
    // For development with hot reload
    developmentUrl: 'http://192.168.x.x:3000',
    // Timeout for API calls (ms)
    timeout: 30000
  },

  // Feature Flags
  features: {
    enableOfflineMode: true,
    enablePushNotifications: false, // Configure Firebase first
    enableAnalytics: false,
    enableCrashReporting: false
  },

  // Plugin Configuration
  plugins: {
    camera: {
      quality: 90,
      width: 1280,
      height: 1280,
      preserveAspectRatio: true
    },
    geolocation: {
      timeout: 10000,
      enableHighAccuracy: true
    },
    network: {
      reconnectInterval: 5000
    },
    notifications: {
      smallIcon: 'ic_launcher'
    }
  },

  // Security
  security: {
    // Enable certificate pinning (optional)
    certificatePinning: false,
    // Store JWT tokens securely
    useSecureStorage: true,
    // CORS configuration
    corsHeaders: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
    }
  },

  // Logging
  logging: {
    enableDebug: true,
    logApiCalls: true,
    logErrors: true
  }
};

/**
 * Get environment-specific config
 */
export function getEnvironmentConfig() {
  const isDevelopment = !capacitorConfig.api.baseUrl.includes('hostelenase.com');

  return {
    ...capacitorConfig,
    isDevelopment,
    apiUrl: isDevelopment
      ? capacitorConfig.api.developmentUrl
      : capacitorConfig.api.baseUrl
  };
}
