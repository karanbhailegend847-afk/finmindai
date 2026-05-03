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
  const [showExpirationModal, setShowExpirationModal] = useState(false);
  const [expiredPlanName, setExpiredPlanName] = useState(null);

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
          plan: 'free',
          lastResetDate: today,
          email: user.email || '',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, initialData);
        setUserData(initialData);
      } else {
        const data = userSnap.data();
        
        // 1. Check for Subscription Expiry
        if (data.plan !== 'free' && data.premiumUntil) {
          const expiryDate = new Date(data.premiumUntil);
          const now = new Date();
          
          if (expiryDate < now) {
            console.log("Plan expired! Reverting to free tier.");
            const updates = { 
              plan: 'free', 
              isPremium: false, 
              credits: 20,
              lastExpiryNotice: now.toISOString() 
            };
            await updateDoc(userRef, updates);
            
            // Set state to show modal in UI
            setExpiredPlanName(data.plan);
            setShowExpirationModal(true);

            // Log notification for email (requires Firebase Trigger Email extension)
            try {
              const notifRef = doc(db, 'mail', `${user.uid}_expiry_${Date.now()}`);
              await setDoc(notifRef, {
                to: user.email,
                message: {
                  subject: 'Your FinMind AI Subscription has Expired',
                  text: `Hi, your ${data.plan} plan has expired. Your account has been reverted to the free tier. Renew now to keep your pro features!`,
                  html: `<h3>Plan Expired</h3><p>Hi, your <b>${data.plan}</b> plan has expired. Your account has been reverted to the free tier with 20 daily credits.</p><a href="https://finmindai.com/pricing">Renew Now</a>`,
                }
              });
            } catch (e) {
              console.warn("Mail trigger failed (is the Trigger Email extension installed?):", e);
            }
          }
        }

        // 2. Handle Daily Reset
        if (data.lastResetDate !== today) {
          console.log("New day detected. Resetting/updating user metadata.");
          const updates = { lastResetDate: today };
          
          // Daily refill based on plan
          if (data.plan === 'advance') {
            updates.credits = 100;
          } else if (data.plan === 'starter') {
            updates.credits = 50;
          } else {
            updates.credits = 20;
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

  const upgradePlan = async (planName) => {
    if (!user) return false;
    const userRef = doc(db, 'users', user.uid);
    try {
      const now = new Date();
      const nextBillDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const sinceDate = now.toISOString();

      let credits = 20;
      if (planName === 'advance') credits = 100;
      else if (planName === 'starter') credits = 50;

      await updateDoc(userRef, {
        plan: planName,
        isPremium: planName !== 'free', // Keep for backward compatibility if needed
        credits: credits, 
        premiumUntil: nextBillDate,
        premiumSince: sinceDate
      });
      return true;
    } catch (error) {
      console.error("Error upgrading plan:", error);
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
    upgradePlan,
    buyPremium: () => upgradePlan('starter'),
    showExpirationModal,
    setShowExpirationModal,
    expiredPlanName
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
