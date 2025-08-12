"use client";

import Sidebar from "@/app/components/Sidebar";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

export default function Home() {
  const [promptText, setPromptText] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsSidebarOpen(mq.matches);
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string}[]>([]);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  const handleButtonLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  }

  const handleButtonSend = async () => {
    if (!promptText.trim()) return;

    setLoading(true);
    setHasMessages(true);

    const userPrompt = promptText;
    setMessages(prev => [...prev, {role: 'user', content: userPrompt}]);
    setPromptText('');

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await res.json();
      const aiMessage: string = data.choices[0]?.message?.content ?? "";

      const newPair = [
        { role: 'user' as const, content: userPrompt },
        { role: 'assistant' as const, content: aiMessage }
      ];

      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);

      const saveRes = await fetch('/api/chats/save', {
        method: 'POST',
        headers: {'Content-Type': "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          chatId: activeChatId,
          messages: newPair, 
        }),
      });

      const saved = await saveRes.json();
      if (!activeChatId && saved?.id) {
        setActiveChatId(saved.id);
      }
      window.dispatchEvent(new Event("chats:changed"));
    } catch (error) {
      console.log("API Error:", error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: "Sorry, I couldn't get a response. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleButtonSend();
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        setMessages={setMessages} 
        setHasMessages={setHasMessages}
        setActiveChatId={setActiveChatId}
        activeChatId={activeChatId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}/>
      
      <div className="w-full flex flex-col relative">
        <header className="w-full flex justify-between items-center pt-4 p-7 shadow-md">
          <button className="p-2 hidden cursor-pointer rounded-lg hover:bg-gray-200 md:hidden" onClick={() => setIsSidebarOpen(prev => !prev)}> 
            <img src="/icons/menuIcon.svg" alt="show hide menu"  className="w-[20px] h-[20px]"/>
          </button>
          <div className="text-2xl font-main text-pistachio-500 cursor-pointer">
            Pistach <span className="text-white bg-pistachio-500 rounded-xl pl-2 pr-2">io</span>
          </div>
          <div>
            <button className="text-l font-main text-white bg-pistachio-500 max-[560px]:bg-transparent p-1 px-4 max-[560px]:p-0 rounded-full hover:opacity-85 cursor-pointer"
              onClick={handleButtonLogout}>
              <span className="max-[560px]:hidden">Log Out</span>
              <img className="min-[560px]:hidden" src="/icons/exitIcon.svg" alt="exit" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={messagesScrollRef}
          className={`w-full flex justify-center transition-all px-4 duration-500 ease-in-out overflow-y-auto scrollbar-none ${hasMessages ? 'h-4/6' : 'h-1/3'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="max-w-[700px] w-full z-10 flex flex-col justify-end-safe pt-5">
            {messages.map((mess, index) => (
              <div key={index} className={`py-2 px-4 text-white w-fit max-w-[80%] rounded-2xl mb-2.5 break-words 
                ${mess.role === 'user' ? 'bg-pistachio-500 ml-auto' : 'bg-text-300 mr-auto'}`}>
                {mess.content}
              </div>
            ))}
          </div>
        </div>    

        {/* MAIN CONTENT */}
        <div className={`flex flex-col items-center justify-center w-full p-4`}>
          <div className={`w-full max-w-[700px] flex flex-col items-center gap-10`}>
            <h3 className={`font-main text-text-300 text-center text-4xl transition-all duration-500 ease-in-out overflow-hidden
              ${hasMessages ? 'opacity-0 pointer-events-none max-h-0' : 'opacity-100 max-h-20'}`}>
              How can I help you?
            </h3>
            <div className="bg-gray-50 w-full shadow-lg rounded-3xl flex items-end p-2">
              <textarea
                ref={textareaRef}
                maxLength={1000}
                rows={1}
                onInput={handleInput}
                value={promptText}
                onKeyDown={handleKeyDown}
                onChange={e => setPromptText(e.target.value)}
                className="w-full outline-none p-2 resize-none bg-transparent placeholder:text-text-300 text-text-300 focus:placeholder-transparent"
                placeholder="Ask anything"
                style={{maxHeight: '200px'}}
              />
              <button
                className="bg-pistachio-500 p-2 rounded-full hover:opacity-85 cursor-pointer disabled:opacity-50 shrink-0"
                onClick={handleButtonSend}
                disabled={loading || !promptText.trim()}>
                <img className={`w-5 h-5 ${loading && 'animate-spin'}`} src={loading ? '/icons/loading.svg' : '/icons/sendIcon.svg'} alt="send button icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}