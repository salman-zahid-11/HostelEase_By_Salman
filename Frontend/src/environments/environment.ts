// src/environments/environment.ts
const isAndroid = window.location.hostname === '10.0.2.2';

export const environment = {
  production: false,
  apiBaseUrl: isAndroid 
    ? 'http://10.0.2.2:5000/api'      // Android emulator
    : 'http://localhost:5000/api'      // PC browser
};