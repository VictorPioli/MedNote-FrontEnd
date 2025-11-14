// Configuração do Firebase para MedNote.IA
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  // ✅ OBRIGATÓRIAS para Firestore Database:
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-key",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mednote-demo",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:demo",
  
  // ⚠️ OPCIONAIS (podem ser vazias para Firestore):
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mednote-demo.firebaseapp.com",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mednote-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (único serviço necessário)
export const db = getFirestore(app);

// Se estiver em desenvolvimento e não tiver configurações reais, use o emulador
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_FIREBASE_PROJECT_ID) {
  console.warn('⚠️ Usando Firebase em modo demo. Configure as variáveis de ambiente para produção.');
  
  // Conectar ao emulador Firestore (opcional para desenvolvimento)
  try {
    // Uncomment this line if you want to use Firestore emulator
    // connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.warn('Emulador Firestore não disponível:', error);
  }
}

export default app;