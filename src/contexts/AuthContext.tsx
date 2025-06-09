
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'admin' | 'user';
  profilePicture?: string;
  phone?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, username: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  uploadProfilePicture: (file: File) => Promise<boolean>;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log('User authenticated:', firebaseUser.email);
        // Get user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: userData.name,
            username: userData.username,
            role: userData.role || 'user',
            profilePicture: userData.profilePicture,
            phone: userData.phone,
            emailVerified: firebaseUser.emailVerified
          });
        }
      } else {
        console.log('User not authenticated');
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, username: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting registration for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Save user data to Firestore
      const isAdmin = email === 'mdaytullaalkhumoni@gmail.com';
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        username,
        email,
        phone,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date(),
        emailVerified: false
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, data);
      
      setUser(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const storageRef = ref(storage, `profile-pictures/${user.id}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      await updateProfile({ profilePicture: downloadURL });
      return true;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, uploadProfilePicture, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
