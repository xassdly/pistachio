'use client';

import { useEffect, useState } from "react";
import type { ChatResponse } from "../api/chats/route";

type Message = { role: 'user' | 'assistant'; content: string };

type SidebarProps = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setHasMessages: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar ({ setMessages, setHasMessages }: SidebarProps) {
    const [chats, setChats] = useState<ChatResponse[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    const refetch = () => 
        fetch("/api/chats", { credentials: "include"})
            .then((res) => res.json())
            .then((data: ChatResponse[]) => setChats(data))
            .catch(() => setChats([]));
    
    useEffect(() => {
        refetch();
        const onChanged = () => refetch();
        window.addEventListener("chats:changed", onChanged);
        return () => window.removeEventListener("chats:changed", onChanged);
    }, []);

    const handleChangeChat = async (chatId: number) => {
        try {
        const res = await fetch(`/api/chats/${chatId}`, { credentials: "include" });
        const msgs: Message[] = await res.json();
        setMessages(msgs);
        setHasMessages(true);
        setActiveChatId(chatId);
        } catch {
        setMessages([]);
        setActiveChatId(null);
        }
    };

    return (
        <div className="w-80 h-full bg-gray-50 p-4">
            <header className="flex justify-between">
                <img src="/icons/logoIcon.svg" alt="logo icon" className="w-[27px] h-[27px]" />
                <button className="cursor-pointer p-2 rounded-full hover:bg-gray-200"> 
                    <img src="/icons/menuIcon.svg" alt="show hide menu"  className="w-[20px] h-[20px]"/>
                </button>
            </header>
            <div className="mt-9 mb-11 h-11 flex items-center border-2 border-pistachio-500 rounded-full">
                <p className="ml-auto text-text-300">Chats</p>
                <button className="bg-pistachio-500 ml-auto p-5 rounded-r-full text-white h-full flex items-center gap-3 cursor-pointer hover:opacity-85">New Chat <img className="w-4 h-4" src="/icons/chatIcon.svg" alt="new chat icon" /></button>
            </div>
            <div className="">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <div onClick={() => handleChangeChat(chat.id)} className={`text-text-300 cursor-pointer hover:bg-gray-200 rounded-full p-2 pl-3 ${activeChatId === chat.id && 'font-bold'}`} key={chat.id}>Chat #{chat.id}</div>
                    ))
                ) : (
                    <p className="flex justify-center text-text-300">Create your first chat</p>
                )}
            </div>
        </div>
    )
}