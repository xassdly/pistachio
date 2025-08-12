'use client';

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password.');
            }
            
            setSuccess('Your password has been reset successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (err: any) {
            setLoading(false);
            setError(err.message);
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
                    {success ? (
                         <div className="text-center">
                            <h3 className="text-3xl text-text-300 font-main mb-6">Success!</h3>
                            <p className="text-green-600 mb-6">{success}</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-center text-3xl text-text-300 font-main mb-6">Reset Your Password</h3>
                            <p className="text-center text-text-300 mb-6">
                                Please enter your new password below.
                            </p>
                            <input
                                className={`bg-bglite-100 p-3.5 rounded-2xl outline-0 focus:placeholder-transparent mb-1`} 
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                             <input
                                className={`bg-bglite-100 p-3.5 rounded-2xl outline-0 focus:placeholder-transparent mb-2.5`} 
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                            />
                            {error && <p className="text-red-600 text-sm text-center my-2">{error}</p>}
                            <button
                                className="bg-pistachio-500 text-white rounded-2xl h-13 hover:opacity-90 cursor-pointer my-4 flex items-center justify-center min-w-[100px]"
                                onClick={handleResetPassword}
                                disabled={loading}>
                                {loading ? <img className="w-5 h-5 animate-spin" src="/icons/loading.svg" alt="loading icon" /> : 'Reset Password'}
                            </button>
                        </>
                    )}
                     <div className="text-sm text-center text-[#999999] mt-auto">© 2025 Pistachio</div>
                </div>
            </div>
        </div>
    );
}