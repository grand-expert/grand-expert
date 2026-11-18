import './index.css';
import {
  db,
  auth,
  testConnection,
  saveDocumentToFirestore,
  deleteDocumentFromFirestore,
  fetchCollectionFromFirestore,
  listenCollectionFromFirestore,
  fetchDocumentFromFirestore,
  listenDocumentFromFirestore,
  signInWithGoogle,
  signOutFirebase,
  sendFirebasePasswordReset,
  subscribeToAuthChanges,
  syncUserProfileToFirestore,
  getInMemoryIdToken
} from './lib/firebase';

// Attach Firebase services and helpers globally to window for index.html integration
(window as any).firebaseDb = db;
(window as any).firebaseAuth = auth;
(window as any).saveDocumentToFirestore = saveDocumentToFirestore;
(window as any).deleteDocumentFromFirestore = deleteDocumentFromFirestore;
(window as any).fetchCollectionFromFirestore = fetchCollectionFromFirestore;
(window as any).listenCollectionFromFirestore = listenCollectionFromFirestore;
(window as any).fetchDocumentFromFirestore = fetchDocumentFromFirestore;
(window as any).listenDocumentFromFirestore = listenDocumentFromFirestore;
(window as any).signInWithGoogle = signInWithGoogle;
(window as any).signOutFirebase = signOutFirebase;
(window as any).sendFirebasePasswordReset = sendFirebasePasswordReset;
(window as any).getFirebaseIdToken = getInMemoryIdToken;

// Validate initial Firestore server connection
testConnection();

// Track auth readiness and notify index.html when Firebase Auth state changes
subscribeToAuthChanges(async (user) => {
  (window as any).currentFirebaseUser = user;
  if (user) {
    const profile = await syncUserProfileToFirestore(user);
    if (typeof (window as any).onFirebaseAuthReady === 'function') {
      (window as any).onFirebaseAuthReady(user, profile);
    }
  } else {
    if (typeof (window as any).onFirebaseAuthSignedOut === 'function') {
      (window as any).onFirebaseAuthSignedOut();
    }
  }
});

console.log('Grand-Expart Real Estate loaded with Firebase Firestore & Google Authentication.');
