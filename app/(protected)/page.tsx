"use client";

import Sidebar from "@/app/components/Sidebar";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [promptText, setPromptText] = useState('');
  const [hasMessages, setHasMessages] = useState(false);

  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  const handleButtonLogout = async () => {
    await fetch('/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    router.replace('/login');
  }

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string}[]>([]);

  const handleButtonSend = async () => {
    if (!promptText.trim()) return;

    setLoading(true);
    setHasMessages(true);

    const updatedMessageUser: { role: 'user' | 'assistant'; content: string}[] = [...messages, { role: 'user' as const, content: promptText }];

    setMessages(prev => [...prev, {role: 'user', content: promptText}]);
    setPromptText('');

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'HTTP-Referer': 'http://localhost:3000'
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      const aiMessage: string = data.choices[0]?.message?.content ?? "";

      const updatedMessages: { role: 'user' | 'assistant'; content: string}[] = [...updatedMessageUser, { role: 'assistant' as const, content: aiMessage}];
      
      setMessages(updatedMessages);
      setLoading(false);

      await fetch('/api/chats/save', {
        method: 'POST',
        headers: {'Content-Type': "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: updatedMessages }),
      })
      window.dispatchEvent(new Event("chats:changed"));

      console.log("ai response:", aiMessage);
    } catch (error) {
      console.log("API Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleButtonSend();
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar setMessages={setMessages} setHasMessages={setHasMessages}/>
      <div className="w-full flex flex-col relative">
        
        {/*  HEADER  */}
        <header className="w-full flex justify-between pt-4 p-7 shadow-md">
          <div className="text-2xl font-main text-pistachio-500 cursor-pointer">
            Pistach <span className="text-white bg-pistachio-500 rounded-xl pl-2 pr-2">io</span>
          </div>
          <div>
            <button className="text-l font-main text-white bg-pistachio-500 p-1 px-4 rounded-full hover:opacity-85 cursor-pointer"
              onClick={handleButtonLogout}>
              Log Out
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className={`w-full  flex justify-center transition-all duration-500 ease-in-out ${hasMessages ? 'h-4/6' : 'h-1/3'}`}>
          <div ref={messagesEndRef} className="max-w-[700px] w-full z-30 flex justify-end-safe flex-col overflow-auto bottom-50" 
            style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',}}>

            {messages.map((mess, index) => (
              <p key={index} className={`p-2 pl-4 pr-4 text-white w-fit max-w-3/5 rounded-2xl mb-2 
                ${mess.role === 'user' ? 'bg-pistachio-500 ml-auto' : 'bg-text-300 mr-auto'}`}>{mess.content}</p>
              ))}
          </div>
        </div>    
              

        {/*  MAIN CONTENT  */}
          <div
            className={`transition-transform duration-500 ease-in-out transform flex flex-col gap-10 items-center w-full
            `}> 

            {/* Title */}
            <h3 className={`font-main text-text-300 text-4xl transition-all duration-500 ease-in-out overflow-hidden 
              ${hasMessages ? 'opacity-0 pointer-events-none max-h-0' : 'opacity-100 max-h-20'}`}>
              How can I help you?
            </h3>

            {/* Textarea */}
            <div className="bg-gray-50 max-w-[700px] w-full min-h-24 shadow-lg rounded-3xl flex items-start">
              <textarea
                ref={textareaRef}
                maxLength={500}
                rows={1}
                onInput={handleInput}
                value={promptText}
                onKeyDown={handleKeyDown}
                onChange={e => setPromptText(e.target.value)}
                className="w-11/12 outline-none p-4 pl-5 resize-none placeholder:text-text-300 text-text-300 focus:placeholder-transparent"
                placeholder="Ask anything"
              />
              <button
                className="bg-pistachio-500 p-2 rounded-full hover:opacity-85 cursor-pointer mt-5"
                onClick={handleButtonSend}
                disabled={loading}
              >
                <img className={`w-5 h-5 ${loading && 'animate-spin'}`} src={loading ? '/icons/loading.svg' : '/icons/sendIcon.svg'} alt="send button icon" />
              </button>
            </div>
          </div>

          <button className="absolute right-12 bottom-12 border border-textlite-100 text-text-300 rounded-full w-10 h-10 hover:bg-gray-100 cursor-pointer">
            ?
          </button>
        </div>     
      </div>
  );
}
