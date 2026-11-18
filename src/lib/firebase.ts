import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export let analytics: Analytics | null = null;

if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics unsupported in this browser/iframe context
    });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let inMemoryIdToken: string | null = null;

export function getInMemoryIdToken(): string | null {
  return inMemoryIdToken;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firebase Firestore connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

function sanitizeDocId(id: string | number): string {
  const raw = String(id || `doc_${Date.now()}`).trim();
  const clean = raw.replace(/[^a-zA-Z0-9_-]/g, '_');
  return clean.slice(0, 128) || `doc_${Date.now()}`;
}

function sanitizePayload(data: any): Record<string, any> {
  const clean: Record<string, any> = {};
  if (!data || typeof data !== 'object') return clean;
  for (const [key, value] of Object.entries(data)) {
    if (key === '_docId') continue;
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  clean.updatedAt = new Date().toISOString();
  return clean;
}

export async function saveDocumentToFirestore(
  collectionName: string,
  docId: string | number,
  data: any
): Promise<any> {
  const safeId = sanitizeDocId(docId);
  const path = `${collectionName}/${safeId}`;
  try {
    const cleanData = sanitizePayload(data);
    await setDoc(doc(db, collectionName, safeId), cleanData);
    return { ...cleanData, id: cleanData.id ?? safeId, _docId: safeId };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDocumentFromFirestore(
  collectionName: string,
  docId: string | number
): Promise<boolean> {
  const rawId = String(docId || '').trim();
  const safeId = sanitizeDocId(docId);
  const path = `${collectionName}/${safeId}`;
  try {
    await deleteDoc(doc(db, collectionName, safeId));
    if (rawId && rawId !== safeId) {
      await deleteDoc(doc(db, collectionName, rawId)).catch(() => {});
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchCollectionFromFirestore(collectionName: string): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => {
      const data = d.data() || {};
      return { ...data, id: data.id !== undefined ? data.id : d.id, _docId: d.id };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

export function listenCollectionFromFirestore(
  collectionName: string,
  callback: (items: any[]) => void,
  filter?: { field: string; value: string }
): Unsubscribe {
  const ref = filter
    ? query(collection(db, collectionName), where(filter.field, '==', filter.value))
    : collection(db, collectionName);

  return onSnapshot(
    ref,
    (snapshot) => {
      const items = snapshot.docs.map((d) => {
        const data = d.data() || {};
        return { ...data, id: data.id !== undefined ? data.id : d.id, _docId: d.id };
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionName);
    }
  );
}

export async function fetchDocumentFromFirestore(
  collectionName: string,
  docId: string | number
): Promise<any | null> {
  const safeId = sanitizeDocId(docId);
  const path = `${collectionName}/${safeId}`;
  try {
    const snap = await getDoc(doc(db, collectionName, safeId));
    if (!snap.exists()) return null;
    const data = snap.data() || {};
    return { ...data, id: data.id !== undefined ? data.id : snap.id, _docId: snap.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function listenDocumentFromFirestore(
  collectionName: string,
  docId: string | number,
  callback: (item: any | null) => void
): Unsubscribe {
  const safeId = sanitizeDocId(docId);
  const path = `${collectionName}/${safeId}`;
  return onSnapshot(
    doc(db, collectionName, safeId),
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      const data = snap.data() || {};
      callback({ ...data, id: data.id !== undefined ? data.id : snap.id, _docId: snap.id });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function syncUserProfileToFirestore(user: User, resolvedRole: string = 'Cashier'): Promise<any> {
  if (!user || !user.uid) return null;
  const userRef = doc(db, 'users', user.uid);
  const isBootstrappedAdmin =
    user.email?.toLowerCase() === 'ayaanleabdikaadir@gmail.com' && user.emailVerified;

  try {
    const existingSnap = await getDoc(userRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data();
      if (isBootstrappedAdmin && existingData.role !== 'Admin') {
        const upgraded = {
          ...existingData,
          role: 'Admin',
          status: 'Active',
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, upgraded, { merge: true });
        return { id: existingSnap.id, ...upgraded };
      }
      return { id: existingSnap.id, ...existingData };
    }
    const profile = {
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || user.email || 'Staff User',
      role: isBootstrappedAdmin ? 'Admin' : resolvedRole,
      status: 'Active',
      updatedAt: new Date().toISOString()
    };
    await setDoc(userRef, profile, { merge: true });
    return profile;
  } catch (error) {
    console.warn('User profile sync notice:', error);
    return {
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || user.email || 'Staff User',
      role: isBootstrappedAdmin ? 'Admin' : resolvedRole,
      status: 'Active'
    };
  }
}

export async function signInWithGoogle(): Promise<{
  user: User;
  idToken: string;
  profile: any;
}> {
  const result = await signInWithPopup(auth, googleAuthProvider);
  const idToken = await result.user.getIdToken();
  inMemoryIdToken = idToken;
  const profile = await syncUserProfileToFirestore(result.user);
  return { user: result.user, idToken, profile };
}

export async function signOutFirebase(): Promise<void> {
  inMemoryIdToken = null;
  await signOut(auth);
}

export async function sendFirebasePasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        inMemoryIdToken = await user.getIdToken();
      } catch {
        inMemoryIdToken = null;
      }
    } else {
      inMemoryIdToken = null;
    }
    callback(user);
  });
}
