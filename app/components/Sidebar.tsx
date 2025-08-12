'use client';

import { useEffect, useState } from "react";
import type { ChatResponse } from "../api/chats/route";

type Message = { role: 'user' | 'assistant'; content: string };

type SidebarProps = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setHasMessages: (value: boolean) => void;
  setActiveChatId: (value: number | null) => void;
  activeChatId: number | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar ({ setMessages, setHasMessages, setActiveChatId, activeChatId, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
    const [chats, setChats] = useState<ChatResponse[]>([]);
    

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

    const handleNewChatButton = () => {
        setActiveChatId(null);
        setMessages([]);
        setHasMessages(false);
    }

    const handleRemoveChat = async (chatId: number) => {
        setChats(prev => prev.filter(c => c.id !== chatId));
        handleNewChatButton();

        try {
            const res = await fetch(`/api/chats/remove/${chatId}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) {
                await refetch();
                return;
            }
            await refetch();

        } catch {
            await refetch();
        }
    }

    return (
        <div className={`h-full bg-gray-50 transition-all z-50 max-md:fixed ${isSidebarOpen ? 'w-80 p-4 max-md:block max-md:w-64' : 'max-md:hidden w-16 pt-4 flex flex-col items-center'}`}>

            {/* Header */}
            <header className={`flex ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                {isSidebarOpen && <img src="/icons/logoIcon.svg" alt="logo icon" className="w-[27px] h-[27px]" />}
                <button className={`cursor-pointer rounded-lg hover:bg-gray-200 ${isSidebarOpen ? 'p-2' : 'p-2'}`} onClick={() => setIsSidebarOpen(prev => !prev)}> 
                    <img src="/icons/menuIcon.svg" alt="show hide menu"  className="w-[20px] h-[20px]"/>
                </button>
            </header>

            {/* Button block */}
            <div className={`mt-9 mb-11 h-11 flex items-center rounded-full ${isSidebarOpen ? 'border-2 border-pistachio-500' : ''}`}>
                {isSidebarOpen && <p className="ml-auto text-text-300">Chats</p>}
                <button className={`bg-pistachio-500 ml-auto text-white flex items-center gap-3 cursor-pointer hover:opacity-85
                    ${isSidebarOpen ? 'rounded-r-full p-5 h-full' : 'rounded-lg w-8 h-8 justify-center'}`}
                    onClick={handleNewChatButton}>{isSidebarOpen ? 'New Chat' : ''}<img className="w-4 h-4" src="/icons/chatIcon.svg" alt="new chat icon" /></button>
            </div>

            {/* Chats */}
            <div className={isSidebarOpen ? 'opacity-100' : 'opacity-0'}>
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <div onClick={() => handleChangeChat(chat.id)} 
                            className={`group relative text-text-300 cursor-pointer hover:bg-gray-200 rounded-full p-2 pl-3 flex justify-between items-center
                            ${activeChatId === chat.id ? 'font-bold' : ''}`} key={chat.id}>
                                <span>Chat #{chat.id}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveChat(chat.id) }} 
                                    className="opacity-0 pointer-events-none cursor-pointer p-1.5 rounded-full group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-gray-300">
                                        <img className="w-4" src="/icons/removeChat.svg" alt="remove chat icon" />
                                </button>
                        </div>
                    ))
                ) : (
                    <p className="flex justify-center text-text-300">Create your first chat</p>
                )}
            </div>
        </div>
    )
}