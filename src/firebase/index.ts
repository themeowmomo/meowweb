'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  // Check if API Key is a placeholder or missing to avoid crashing Auth initialization
  const isKeyValid = 
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== 'your_actual_api_key_here' && 
    firebaseConfig.apiKey.length > 10;

  try {
    return {
      firebaseApp,
      auth: isKeyValid ? getAuth(firebaseApp) : null as any,
      firestore: isKeyValid ? getFirestore(firebaseApp) : null as any,
      storage: isKeyValid ? getStorage(firebaseApp) : null as any
    };
  } catch (error) {
    console.error("Firebase SDK initialization error:", error);
    // Return nullified services so components can handle the "unavailable" state gracefully
    return {
      firebaseApp,
      auth: null as any,
      firestore: null as any,
      storage: null as any
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
