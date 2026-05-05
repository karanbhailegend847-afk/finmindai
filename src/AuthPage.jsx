import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { SignInCard } from './components/ui/sign-in-card-2';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Restriction: Only @gmail.com allowed
            if (!email.toLowerCase().endsWith('@gmail.com')) {
                setError('Only @gmail.com addresses are permitted for registration.');
                setLoading(false);
                return;
            }

            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await signupWithEmail(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            if (err.code === 'auth/operation-not-allowed') {
                setError('Email/Password sign-in is not enabled in your Firebase Console. Please enable it in the Authentication > Sign-in method tab.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <SignInCard 
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            onGoogleLogin={handleGoogleLogin}
            loading={loading}
            error={error}
        />
    );
};

export default AuthPage;
