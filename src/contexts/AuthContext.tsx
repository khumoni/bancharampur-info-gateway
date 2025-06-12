
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  role?: 'admin' | 'user';
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
  uploadProfilePicture: (file: File) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const isAdmin = userData.isAdmin || firebaseUser.email === 'admin@banchorampur.com';
            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              phone: userData.phone || '',
              profilePicture: userData.profilePicture || firebaseUser.photoURL || '',
              isVerified: userData.isVerified || false,
              isAdmin,
              role: isAdmin ? 'admin' as const : 'user' as const,
              createdAt: userData.createdAt || firebaseUser.metadata.creationTime
            });
          } else {
            // Create user document if it doesn't exist
            const isAdmin = firebaseUser.email === 'admin@banchorampur.com';
            const newUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              isVerified: false,
              isAdmin,
              role: isAdmin ? 'admin' as const : 'user' as const,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user.email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const isAdmin = email === 'admin@banchorampur.com';
      const userData = {
        name,
        email,
        phone: phone || '',
        profilePicture: '',
        isVerified: false,
        isAdmin,
        role: isAdmin ? 'admin' as const : 'user' as const,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log('User registered:', userCredential.user.email);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    console.log('User logged out');
  };

  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    try {
      setIsLoading(true);
      // For now, just return success - actual upload would require Firebase Storage
      console.log('Profile picture upload:', file.name);
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isLoading,
      uploadProfilePicture
    }}>
      {children}
    </AuthContext.Provider>
  );
};
