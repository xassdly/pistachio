'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [emailText, setEmailText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleResetRequest = async () => {
        if (!emailText.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText)) {
            setError('Please enter a valid email.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailText }),
            });
            
            // Ми завжди показуємо успішне повідомлення, навіть якщо юзера немає
            setIsSubmitted(true);

        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col">
            <header className="w-full flex pt-4 p-7 shadow-md">
                <div onClick={() => router.push('/welcome')} className="text-2xl font-main text-pistachio-500 cursor-pointer">
                    Pistach <span className="text-white bg-pistachio-500 rounded-xl pl-2 pr-2">io</span>
                </div>
            </header>
            <div className="w-full flex-1 pb-5 pt-16 px-2">
                <div className="max-w-md w-full mt-0 m-auto h-full flex flex-col gap-1">
                    {isSubmitted ? (
                        <div className="text-center">
                            <h3 className="text-3xl text-text-300 font-main mb-6">Check your inbox</h3>
                            <p className="text-text-300 mb-6">
                                If an account with <strong>{emailText}</strong> exists, we've sent a password reset link. Please follow the instructions in the email.
                            </p>
                            <button className="text-pistachio-500 font-semibold hover:underline" onClick={() => router.push('/login')}>
                                Back to Log In
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-center text-3xl text-text-300 font-main mb-6">Forgot Password?</h3>
                            <p className="text-center text-text-300 mb-6">
                                Enter your email address below and we'll send you a link to reset your password.
                            </p>
                            <input
                                className={`bg-bglite-100 p-3.5 rounded-2xl outline-0 focus:placeholder-transparent mb-1`} 
                                type="email"
                                placeholder="Email"
                                value={emailText}
                                onChange={e => setEmailText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleResetRequest()}
                            />
                            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                            <button
                                className="bg-pistachio-500 text-white rounded-2xl h-13 hover:opacity-90 cursor-pointer my-4 flex items-center justify-center min-w-[100px]"
                                onClick={handleResetRequest}
                                disabled={loading}>
                                {loading ? <img className="w-5 h-5 animate-spin" src="/icons/loading.svg" alt="loading icon" /> : 'Send Reset Link'}
                            </button>
                            <div className="flex justify-center text-[#9F9FF8] text-sm gap-6 mb-4">
                                <button className="cursor-pointer hover:text-[#4E4ED8]" onClick={() => router.push('/login')}>Back to Log In</button>
                            </div>
                        </>
                    )}
                    <div className="text-sm text-center text-[#999999] mt-auto">© 2025 Pistachio</div>
                </div>
            </div>
        </div>
    );
}