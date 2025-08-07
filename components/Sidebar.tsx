import Chat from "./Chat"

export default function Sidebar () {
    
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
                <Chat/>
                <Chat/>
                <Chat/>
            </div>
        </div>
    )
}