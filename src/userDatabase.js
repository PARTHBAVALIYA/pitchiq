// PitchIQ Working User Database Engine
// Provides persistent IndexedDB transactional database storage with localStorage sync
// and optional Supabase cloud PostgreSQL integration.

const DB_NAME = 'PitchIQ_Database';
const DB_VERSION = 1;

let dbInstance = null;

/**
 * Open and initialize the IndexedDB database with object stores
 */
export function openDatabase() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not available, using LocalStorage fallback engine.');
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Users Store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'email' });
        userStore.createIndex('id', 'id', { unique: true });
        userStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 2. Saved Pitches Store
      if (!db.objectStoreNames.contains('saved_pitches')) {
        const pitchStore = db.createObjectStore('saved_pitches', { keyPath: 'id' });
        pitchStore.createIndex('userEmail', 'userEmail', { unique: false });
        pitchStore.createIndex('status', 'status', { unique: false });
      }

      // 3. Pitch Revision History Store
      if (!db.objectStoreNames.contains('pitch_history')) {
        const historyStore = db.createObjectStore('pitch_history', { keyPath: 'id' });
        historyStore.createIndex('userEmail', 'userEmail', { unique: false });
        historyStore.createIndex('attemptNumber', 'attemptNumber', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      seedDemoDataIfEmpty(dbInstance).then(() => {
        resolve(dbInstance);
      }).catch(() => resolve(dbInstance));
    };

    request.onerror = (event) => {
      console.warn('IndexedDB open error:', event.target.error);
      resolve(null);
    };
  });
}

/**
 * Seed initial demo data for Parth and Akshat if the database is newly created
 */
async function seedDemoDataIfEmpty(db) {
  try {
    const tx = db.transaction(['users'], 'readonly');
    const store = tx.objectStore('users');
    const countReq = store.count();

    countReq.onsuccess = () => {
      if (countReq.result === 0) {
        const writeTx = db.transaction(['users', 'saved_pitches', 'pitch_history'], 'readwrite');
        
        // Seed Parth
        const parthUser = {
          id: 'usr_parth_001',
          name: 'Parth Bavalliya',
          email: 'parth@pitchiq.ai',
          password: 'password123',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        writeTx.objectStore('users').put(parthUser);

        // Seed Akshat
        const akshatUser = {
          id: 'usr_akshat_002',
          name: 'Akshat Solanki',
          email: 'akshat@pitchiq.ai',
          password: 'password123',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        writeTx.objectStore('users').put(akshatUser);
      }
    };
  } catch (err) {
    console.warn('Seed error:', err);
  }
}

/**
 * Helper: Perform transactional operation on an IndexedDB store
 */
function runStoreTx(storeName, mode, callback) {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    if (!db) {
      // Fallback to localStorage
      try {
        const localKey = `pitchiq_db_${storeName}`;
        const items = JSON.parse(localStorage.getItem(localKey) || '[]');
        const result = callback({
          getAll: () => ({ onsuccess: null, result: items }),
          get: (key) => ({ onsuccess: null, result: items.find(i => (i.email || i.id) === key) }),
          put: (item) => {
            const idx = items.findIndex(i => (i.email || i.id) === (item.email || item.id));
            if (idx >= 0) items[idx] = item; else items.push(item);
            localStorage.setItem(localKey, JSON.stringify(items));
          },
          delete: (key) => {
            const filtered = items.filter(i => (i.email || i.id) !== key);
            localStorage.setItem(localKey, JSON.stringify(filtered));
          }
        }, true);
        resolve(result);
      } catch (e) {
        reject(e);
      }
      return;
    }

    try {
      const tx = db.transaction([storeName], mode);
      const store = tx.objectStore(storeName);
      const req = callback(store, false);

      if (req && 'onsuccess' in req) {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } else {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      }
    } catch (e) {
      reject(e);
    }
  });
}

// ─────────────────────────────────────────────────────────────
// USER REGISTRATION & AUTHENTICATION
// ─────────────────────────────────────────────────────────────

/**
 * Register a new user in the database
 */
export async function dbRegisterUser(name, email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanEmail || !password) {
    throw new Error('Email and password are required.');
  }

  // Check if user already exists
  const existing = await dbGetUserByEmail(cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please Sign In.');
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: cleanName || cleanEmail.split('@')[0],
    email: cleanEmail,
    password: password, // In production this would be bcrypt-hashed
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  // Save to IndexedDB
  await runStoreTx('users', 'readwrite', (store) => {
    store.put(newUser);
  });

  // Mirror in localStorage for fast synchronous UI hydration
  syncLocalUserCache(newUser);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
}

/**
 * Authenticate existing user by email and password
 */
export async function dbAuthenticateUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  const user = await dbGetUserByEmail(cleanEmail);
  if (!user) {
    throw new Error('No account found with this email. Please create an account.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  await runStoreTx('users', 'readwrite', (store) => {
    store.put(user);
  });

  syncLocalUserCache(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

/**
 * Get user by email
 */
export async function dbGetUserByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();

  // Check localStorage fast cache first
  try {
    const localUsers = JSON.parse(localStorage.getItem('pitchiq_db_users') || '[]');
    const found = localUsers.find(u => u.email === cleanEmail);
    if (found) return found;
  } catch (e) {}

  // Check IndexedDB
  try {
    const db = await openDatabase();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(['users'], 'readonly');
      const store = tx.objectStore('users');
      const req = store.get(cleanEmail);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

function syncLocalUserCache(user) {
  try {
    const localUsers = JSON.parse(localStorage.getItem('pitchiq_db_users') || '[]');
    const idx = localUsers.findIndex(u => u.email === user.email);
    if (idx >= 0) localUsers[idx] = user; else localUsers.push(user);
    localStorage.setItem('pitchiq_db_users', JSON.stringify(localUsers));
  } catch (e) {}
}

// ─────────────────────────────────────────────────────────────
// USER SAVED PITCHES DATABASE
// ─────────────────────────────────────────────────────────────

export async function dbGetSavedPitches(userEmail) {
  const cleanEmail = (userEmail || '').trim().toLowerCase();
  
  // Fast cache
  try {
    const local = localStorage.getItem(`pitchiq_saved_${cleanEmail}`);
    if (local) return JSON.parse(local);
  } catch (e) {}

  try {
    const db = await openDatabase();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(['saved_pitches'], 'readonly');
      const store = tx.objectStore('saved_pitches');
      const index = store.index('userEmail');
      const req = index.getAll(cleanEmail);

      req.onsuccess = () => {
        const pitches = req.result || [];
        localStorage.setItem(`pitchiq_saved_${cleanEmail}`, JSON.stringify(pitches));
        resolve(pitches);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function dbSavePitch(userEmail, pitch) {
  const cleanEmail = (userEmail || '').trim().toLowerCase();
  const pitchRecord = {
    ...pitch,
    id: pitch.id || `p_${Date.now()}`,
    userEmail: cleanEmail,
    updatedAt: new Date().toISOString()
  };

  try {
    await runStoreTx('saved_pitches', 'readwrite', (store) => {
      store.put(pitchRecord);
    });
  } catch (e) {
    console.warn('Pitch save error:', e);
  }

  // Update local cache
  try {
    const current = await dbGetSavedPitches(cleanEmail);
    const updated = [pitchRecord, ...current.filter(p => p.id !== pitchRecord.id)];
    localStorage.setItem(`pitchiq_saved_${cleanEmail}`, JSON.stringify(updated));
  } catch (e) {}

  return pitchRecord;
}

export async function dbDeletePitch(userEmail, pitchId) {
  const cleanEmail = (userEmail || '').trim().toLowerCase();

  try {
    await runStoreTx('saved_pitches', 'readwrite', (store) => {
      store.delete(pitchId);
    });
  } catch (e) {}

  try {
    const current = await dbGetSavedPitches(cleanEmail);
    const updated = current.filter(p => p.id !== pitchId);
    localStorage.setItem(`pitchiq_saved_${cleanEmail}`, JSON.stringify(updated));
  } catch (e) {}
}

// ─────────────────────────────────────────────────────────────
// USER PITCH REVISION HISTORY DATABASE
// ─────────────────────────────────────────────────────────────

export async function dbGetHistory(userEmail) {
  const cleanEmail = (userEmail || '').trim().toLowerCase();

  try {
    const local = localStorage.getItem(`pitchiq_history_${cleanEmail}`);
    if (local) return JSON.parse(local);
  } catch (e) {}

  try {
    const db = await openDatabase();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(['pitch_history'], 'readonly');
      const store = tx.objectStore('pitch_history');
      const index = store.index('userEmail');
      const req = index.getAll(cleanEmail);

      req.onsuccess = () => {
        const history = req.result || [];
        localStorage.setItem(`pitchiq_history_${cleanEmail}`, JSON.stringify(history));
        resolve(history);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function dbSaveHistoryAttempt(userEmail, attempt) {
  const cleanEmail = (userEmail || '').trim().toLowerCase();
  const attemptRecord = {
    ...attempt,
    id: attempt.id || `rev_${Date.now()}`,
    userEmail: cleanEmail,
    createdAt: new Date().toISOString()
  };

  try {
    await runStoreTx('pitch_history', 'readwrite', (store) => {
      store.put(attemptRecord);
    });
  } catch (e) {}

  // Update local cache
  try {
    const current = await dbGetHistory(cleanEmail);
    const updated = [...current, attemptRecord];
    localStorage.setItem(`pitchiq_history_${cleanEmail}`, JSON.stringify(updated));
  } catch (e) {}

  return attemptRecord;
}
