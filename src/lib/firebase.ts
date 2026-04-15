import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Suporta AI Studio (firebase-applet-config.json) e Vite local (.env)
async function getFirebaseConfig() {
  // Tenta carregar do JSON (AI Studio / Firebase Studio)
  try {
    const cfg = await import('../../firebase-applet-config.json');
    if (cfg.default?.projectId) return cfg.default;
  } catch { /* ignora se nao existir */ }

  // Fallback para variáveis de ambiente Vite (local)
  return {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

// Config direta (síncrona) — funciona nos dois ambientes
const firebaseConfig = {
  apiKey:            "AIzaSyCeyaFRDmk2XDX0Vj19plwZk7dxZnQSnc4",
  authDomain:        "sgoa-malha.firebaseapp.com",
  projectId:         "sgoa-malha",
  storageBucket:     "sgoa-malha.firebasestorage.app",
  messagingSenderId: "257027363404",
  appId:             "1:257027363404:web:cce8b7176376e2314d9ae9",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db   = getFirestore(app);
export const auth = getAuth(app);
export default app;
