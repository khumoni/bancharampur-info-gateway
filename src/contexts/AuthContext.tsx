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
  setPersistence,
  browserLocalPersistence,
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
  role?: 'admin' | 'localAdmin' | 'user';
  assignedLocations?: Array<{ district: string; upazila: string }>; // NEW: Optional!
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string, role?: 'admin' | 'localAdmin' | 'user', assignedLocations?: Array<{ district: string; upazila: string }>) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
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
  const [loading, setLoading] = useState(true);
  const [isLoadingLocally, setIsLoadingLocally] = useState(false);

  useEffect(() => {
    // Improved local persistence
    import('firebase/auth').then(({ browserLocalPersistence, setPersistence }) => {
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          // Auth state subscribed only after persistence is ensured
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            try {
              console.log('[Auth] onAuthStateChanged fired.', { firebaseUser });
              if (firebaseUser) {
                console.log('[Auth] User detected:', firebaseUser.email, '| Verified:', firebaseUser.emailVerified);
                // Fetch userDoc, role detection, user object
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  if (userData.isVerified !== firebaseUser.emailVerified) {
                    await updateDoc(userDocRef, { isVerified: firebaseUser.emailVerified });
                  }

                  // Role detection (now supports localAdmin)
                  let role: 'admin' | 'localAdmin' | 'user' = 'user';
                  let isAdmin = false;
                  if (userData.isAdmin || firebaseUser.email === 'mohammdaytullah@gmail.com') {
                    isAdmin = true;
                    role = 'admin';
                  } else if (userData.role === 'localAdmin') {
                    role = 'localAdmin';
                  }

                  setUser({
                    id: firebaseUser.uid,
                    name: userData.name || firebaseUser.displayName || 'Anonymous',
                    email: firebaseUser.email || '',
                    phone: userData.phone || '',
                    profilePicture: userData.profilePicture || firebaseUser.photoURL || '',
                    isVerified: firebaseUser.emailVerified,
                    isAdmin,
                    role,
                    assignedLocations: userData.assignedLocations || [], // support for assignedLocations
                    createdAt: userData.createdAt || firebaseUser.metadata.creationTime
                  });
                } else {
                  // Role detection (now supports localAdmin)
                  let role: 'admin' | 'localAdmin' | 'user' = 'user';
                  let isAdmin = false;
                  if (firebaseUser.email === 'mohammdaytullah@gmail.com') {
                    isAdmin = true;
                    role = 'admin';
                  }
                  const newUser: User = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Anonymous',
                    email: firebaseUser.email || '',
                    isVerified: firebaseUser.emailVerified,
                    isAdmin,
                    role,
                    assignedLocations: [], // Start with blank for all users (future assignment)
                    createdAt: new Date().toISOString()
                  };
                  await setDoc(userDocRef, newUser);
                  setUser(newUser);
                }
                // Add some logs on success
                console.log('[Auth] User session loaded and set:', firebaseUser.email);
              } else {
                setUser(null);
                console.log('[Auth] No Firebase user session. Possible auto-logout due to:');
                console.log('- Manual logout');
                console.log('- Browser closed/session cleared');
                console.log('- Cookie or localStorage blocked/cleared');
                console.log('- Email not verified at Login');
                console.log('- Internet/network error');
              }
            } catch (error) {
              console.error('Error fetching user data (AuthContext):', error);
            }
            setLoading(false);
          });
          // Return unsubscribe on unmount
          return () => unsubscribe();
        })
        .catch(err => {
          // fallback if persistence fails
          setLoading(false);
        });
    });
    // fallback in case of module import error
  }, []);

  // Login with persistence
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoadingLocally(true);
      // Log attempted persistence setting
      console.log('[Auth] Setting Firebase persistence to browserLocalPersistence...');
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Email verified check
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        console.log('[Auth] Login failed - Email not verified.');
        throw new Error("EMAIL_NOT_VERIFIED");
      }
      console.log('[Auth] User logged in and persistence set:', userCredential.user.email);
      return true;
    } catch (error: any) {
      if (error.message === "EMAIL_NOT_VERIFIED") throw error;
      console.error('[Auth] Login error:', error);
      return false;
    } finally {
      setIsLoadingLocally(false);
    }
  };

  // UPDATED register logic so later, if you want to register localAdmin, just provide a role & locations
  const register = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    role: 'admin' | 'localAdmin' | 'user' = 'user', // NEW
    assignedLocations?: Array<{ district: string; upazila: string }> // NEW
  ): Promise<boolean> => {
    try {
      setIsLoadingLocally(true);
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(userCredential.user);

      const isAdmin = role === 'admin' || email === 'mohammdaytullah@gmail.com';
      const userData: Omit<User, 'id'> = {
        name,
        email,
        phone: phone || '',
        profilePicture: '',
        isVerified: false,
        isAdmin,
        role,
        assignedLocations: assignedLocations || [],
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      await signOut(auth);
      console.log('User registered & logged out for verification:', userCredential.user.email);
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
    setUser(null);
    console.log('User logged out, session cleared.');
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

  // Google Sign In with persistence
  const googleSignIn = async (): Promise<boolean> => {
    try {
      setIsLoadingLocally(true);
      await setPersistence(auth, browserLocalPersistence);
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
          isVerified: true,
          isAdmin,
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUser);
      }
      console.log('Google sign-in success, persistence kept for:', user.email);
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
      await confirmationResult.confirm(otp);
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
      loading,
      isLoading: isLoadingLocally,
      uploadProfilePicture,
      updateUserProfile,
      googleSignIn,
      sendPasswordReset,
      verifyPhoneNumber,
      confirmOtp,
    }}>
      {loading
        ? (<div className="min-h-[30vh] flex justify-center items-center text-xl text-gray-500">লোড হচ্ছে...</div>)
        : children}
    </AuthContext.Provider>
  );
};

// নোট: এই ফাইলটি অনেক বড় (৩১৭+ লাইন)! এখন role ও assignedLocations যুক্ত করা হয়েছে। পরবর্তী ধাপে UI ও অ্যাডমিন প্যানেল মডিফাই করতে চাইলে বলুন।
