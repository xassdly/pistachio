"use client";

import Sidebar from "@/components/Sidebar";
import { useRef, useState } from "react";

export default function Home() {
  const [promptText, setPromptText] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  const [hasMessages, setHasMessages] = useState(false);

  const handleButtonSend = () => {
    if (!promptText.trim()) return;

    setPromptText('');
    setHasMessages(true);
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full flex-1 flex items-center relative overflow-hidden">
        <div
          className={`transition-transform duration-500 ease-in-out transform flex flex-col gap-10 items-center w-full
          ${hasMessages ? 'translate-y-[400px]' : 'translate-y-0'}`}>
            
          <h3 className={`font-main text-text-300 text-4xl ${hasMessages ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>How can I help you</h3>
          
          <div className="bg-gray-50 max-w-[700px] w-full min-h-24 shadow-lg rounded-3xl flex items-start">
            <textarea
              ref={textareaRef}
              maxLength={500}
              rows={1}
              onInput={handleInput}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              className="w-11/12 outline-none p-4 pl-5 resize-none placeholder:text-text-300 text-text-300 focus:placeholder-transparent"
              placeholder="Ask anything"
            />
            <button
              className="bg-pistachio-500 p-2 rounded-full hover:opacity-85 cursor-pointer mt-5"
              onClick={handleButtonSend}
            >
              <img className="w-5 h-5" src="/icons/sendIcon.svg" alt="send button icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
