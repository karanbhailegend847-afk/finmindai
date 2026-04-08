import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);

  // Effect 1: Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        setUserData(null);
        setUserDataLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync user logic
  const syncUser = useCallback(async () => {
    if (!user) return;
    setUserDataLoading(true);
    setSyncError(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      const today = new Date().toISOString().split('T')[0];

      // 1. Ensure document exists and handle daily credit refills
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.log("No user record found in Firestore. Creating initial data for:", user.email);
        const initialData = {
          credits: 20,
          isPremium: false,
          lastResetDate: today,
          email: user.email || '',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, initialData);
        setUserData(initialData);
      } else {
        const data = userSnap.data();
        if (data.lastResetDate !== today) {
          console.log("New day detected. Resetting/updating user metadata.");
          const updates = { lastResetDate: today };
          if (data.isPremium) {
            updates.credits = 50;
          }
          await updateDoc(userRef, updates);
        }
      }

      // 2. Setup real-time listener for current user document
      const unsubscribe = onSnapshot(userRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data());
          }
          setUserDataLoading(false);
        },
        (error) => {
          console.error("Firestore snapshot error:", error);
          setSyncError(error.message);
          setUserDataLoading(false);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("Detailed error in user data sync:", error);
      setSyncError(error.message);
      setUserDataLoading(false);
    }
  }, [user]);

  // Effect 2: Run sync when user changes
  useEffect(() => {
    let unsubscribe = () => {};
    if (user) {
      syncUser().then(u => {
        if (typeof u === 'function') unsubscribe = u;
      });
    }
    return () => unsubscribe();
  }, [user, syncUser]);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signupWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const deductCredits = async (amount = 3) => {
    if (!user || !userData) return false;
    if (userData.credits < amount) return false;

    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        credits: userData.credits - amount
      });
      return true;
    } catch (error) {
      console.error("Error deducting credits:", error);
      return false;
    }
  };

  const buyPremium = async () => {
    if (!user) return false;
    const userRef = doc(db, 'users', user.uid);
    try {
      const now = new Date();
      const nextBillDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const sinceDate = now.toISOString();

      await updateDoc(userRef, {
        isPremium: true,
        credits: 50, // Give 50 credits immediately on purchase
        premiumUntil: nextBillDate,
        premiumSince: sinceDate
      });
      return true;
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      return false;
    }
  };

  const value = {
    user,
    userData,
    loading,
    userDataLoading,
    syncError,
    refreshUserData: syncUser,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    deductCredits,
    buyPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
