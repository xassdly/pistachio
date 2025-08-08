'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup () {
    const router = useRouter();
    const [emailText, setEmailText] = useState('');
    const [passwordText, setPasswordText] = useState('');


    const createUserByEmail = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/user/signup', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('❌ API error:', data);
                return false;
            }
            console.log('✅ User created:', data);
            return true;

        } catch (err) {
            console.error('❌ Fetch error:', err);
            return false;
        }
    };


    const handleButtonSignup = async () => {
        if (emailText.trim() === '' || passwordText.trim() === '') return;
        
        const emailIsEmpty = emailText.trim() === '';
        const emailIsInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText);

        const passwordIsEmpty = passwordText.trim() === '';
        const passwordIsTooShort = passwordText.trim().length < 8;

        if (emailIsEmpty || emailIsInvalid || passwordIsEmpty || passwordIsTooShort) {
            setEmailText('');
            setPasswordText('');
            // showError();
            return;
        }
        
        const success = await createUserByEmail(emailText, passwordText);
        if (success) router.push('/');
    }

    return (
        <div>
            <header className="w-full flex justify-between pt-4 p-7 shadow-md">
                <div onClick={() => router.push('/')} className="text-2xl font-main text-pistachio-500 cursor-pointer">
                    Pistach <span className="text-white bg-pistachio-500 rounded-xl pl-2 pr-2">io</span>
                </div>
            </header>

            <div className="w-full flex-1 pb-5 pt-16">
                <div className="max-w-md w-full mt-0 m-auto h-full flex flex-col gap-1">
                    <h3 className="text-center text-3xl text-text-300 font-main mb-6">Sign Up</h3>

                    <input className="bg-bglite-100 p-3.5 rounded-2xl outline-0 focus:placeholder-transparent mb-1" type="email" placeholder="Email"
                        value={emailText} onChange={e => setEmailText(e.target.value)}/>
                    <input className="bg-bglite-100 p-3.5 rounded-2xl outline-0 focus:placeholder-transparent mb-2.5" type="password" placeholder="Password"
                        value={passwordText} onChange={e => setPasswordText(e.target.value)}/>

                    <button className="bg-pistachio-500 text-white rounded-2xl p-3.5 hover:opacity-90 cursor-pointer mb-4"
                        onClick={handleButtonSignup}>Sign Up</button>
                    <div className="flex justify-center text-[#9F9FF8] text-sm gap-6 mb-4">
                        <button className="cursor-pointer hover:text-[#4E4ED8]" onClick={() => router.push('/login')}>Log In</button>
                        <button className="cursor-pointer hover:text-[#4E4ED8]">Contact Us</button>
                    </div>
                    <div className="mb-4 flex justify-center">
                        or
                    </div>

                    <button className="border border-[#ECECEC] p-3.5 rounded-2xl cursor-pointer hover:bg-gray-50 mb-9 flex justify-center items-center gap-2">
                        <img src="/icons/googleIcon.svg" alt="Google icon" className="w-[20px] h-[20px]"/>Sign Up with Google
                    </button>

                    <div className="flex justify-center text-[#999999]">
                        <button className="pr-4 cursor-pointer">Terms of Use</button>
                        <button className="border-l border-[#CCCCCC] pl-4 cursor-pointer">Privacy Policy</button>
                    </div>

                    <div className="text-sm text-[#999999] flex justify-center mt-auto">2025 Pistachio</div>
                </div>
            </div>
        </div>
    )
}