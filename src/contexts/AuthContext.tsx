import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  PhoneAuthCredential,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  loading: boolean; // For initial auth state check
  isLoading: boolean; // For login, register, upload operations
  uploadProfilePicture: (file: File) => Promise<boolean>;
  updateUserProfile: (data: Partial<Pick<User, 'name' | 'phone'>>) => Promise<boolean>;
  googleSignIn: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  verifyPhoneNumber: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult | null>;
  confirmOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<boolean>;
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
  const [loading, setLoading] = useState(true); // For initial auth state check
  const [isLoadingLocally, setIsLoadingLocally] = useState(false); // For operations like login, register, upload

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Sync verification status from Firebase Auth to Firestore if different
            if (userData.isVerified !== firebaseUser.emailVerified) {
              await updateDoc(userDocRef, { isVerified: firebaseUser.emailVerified });
            }

            const isAdmin = userData.isAdmin || firebaseUser.email === 'mohammdaytullah@gmail.com';
            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              phone: userData.phone || '',
              profilePicture: userData.profilePicture || firebaseUser.photoURL || '',
              isVerified: firebaseUser.emailVerified, // Use source of truth from Firebase
              isAdmin,
              role: isAdmin ? 'admin' : 'user',
              createdAt: userData.createdAt || firebaseUser.metadata.creationTime
            });
          } else {
            // Create user document if it doesn't exist
            const isAdmin = firebaseUser.email === 'mohammdaytullah@gmail.com';
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              isVerified: firebaseUser.emailVerified, // Use firebase auth status
              isAdmin,
              role: isAdmin ? 'admin' : 'user', // Ensure role is correctly typed
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newUser);
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
      setIsLoadingLocally(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth); // Sign out user if email is not verified
        throw new Error("EMAIL_NOT_VERIFIED");
      }

      console.log('User logged in:', userCredential.user.email);
      return true;
    } catch (error: any) {
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        throw error; // Re-throw to be handled by UI
      }
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    try {
      setIsLoadingLocally(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(userCredential.user);

      const isAdmin = email === 'mohammdaytullah@gmail.com';
      const userData: Omit<User, 'id'> = { 
        name,
        email,
        phone: phone || '',
        profilePicture: '',
        isVerified: false, // Initially false, user needs to verify
        isAdmin,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      await signOut(auth); // Sign out user after registration to force verification
      console.log('User registered, verification email sent:', userCredential.user.email);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null); // Also clear local user state on logout
    console.log('User logged out');
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setIsLoadingLocally(true);
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  const googleSignIn = async (): Promise<boolean> => {
    try {
      setIsLoadingLocally(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const isAdmin = user.email === 'mohammdaytullah@gmail.com';
        const newUser: Omit<User, 'id'> = {
          name: user.displayName || 'Anonymous',
          email: user.email || '',
          profilePicture: user.photoURL || '',
          isVerified: true, // Google accounts are considered verified
          isAdmin,
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUser);
      }
      
      console.log('User signed in with Google:', user.email);
      return true;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  const updateUserProfile = async (data: Partial<Pick<User, 'name' | 'phone'>>): Promise<boolean> => {
    if (!user) return false;
    try {
      setIsLoadingLocally(true);
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, data);
      
      const updatedUser = { ...user, ...data } as User;
      setUser(updatedUser);

      console.log('User profile updated:', data);
      return true;
    } catch (error) {
      console.error('User profile update error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    if (!user) return false;
    try {
      setIsLoadingLocally(true);
      
      const filePath = `profile-pictures/${user.id}/${file.name}`;
      const fileRef = storageRef(storage, filePath);

      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);

      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { profilePicture: photoURL });

      setUser(prevUser => prevUser ? { ...prevUser, profilePicture: photoURL } : null);

      console.log('Profile picture uploaded successfully');
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  const verifyPhoneNumber = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult | null> => {
    try {
      setIsLoadingLocally(true);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Phone verification sending error:', error);
      return null;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  const confirmOtp = async (confirmationResult: ConfirmationResult, otp: string): Promise<boolean> => {
    try {
      setIsLoadingLocally(true);
      // This will sign the user in with phone, we can grab the credential, but we don't need it.
      // We just need to know it was successful.
      await confirmationResult.confirm(otp);
      // The user is now signed in with their phone. We sign them out immediately
      // so the registration flow can proceed to create a new account with email/password.
      await signOut(auth);
      console.log('Phone number verified successfully.');
      return true;
    } catch (error) {
      console.error('OTP confirmation error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading, // For initial auth state (app load)
      isLoading: isLoadingLocally, // For user-initiated actions like login, register, upload
      uploadProfilePicture,
      updateUserProfile,
      googleSignIn,
      sendPasswordReset,
      verifyPhoneNumber,
      confirmOtp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
