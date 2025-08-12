import Link from "next/link";

const FeatureIcon = ({ src, alt }: { src: string, alt: string }) => (
    <div className="bg-pistachio-500/20 p-3 rounded-full mb-4 inline-block">
        <img src={src} alt={alt} className="w-8 h-8" />
    </div>
);


export default function WelcomePage() {

    const features = [
        {
            icon: "/icons/brainIcon.svg",
            title: "Intelligent Chat",
            description: "Engage in seamless, intelligent conversations with our AI powered by cutting-edge models to assist you with any task."
        },
        {
            icon: "/icons/historyIcon.svg",
            title: "Chat History",
            description: "Never lose a conversation. All your chats are saved securely, allowing you to revisit them anytime."
        },
        {
            icon: "/icons/controlIcon.svg",
            title: "Full Control",
            description: "Easily manage your conversations. Create new chats or delete old ones with a single click to keep your workspace organized."
        },
        {
            icon: "/icons/googleIcon.svg",
            title: "Secure Authentication",
            description: "Your privacy is our priority. We ensure your data is safe with our robust and secure authentication system."
        }
    ];

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50">

            <header className="w-full flex justify-between items-center pt-4 p-7 shadow-md bg-white sticky top-0 z-10">
                <Link href="/welcome" className="text-2xl font-main text-pistachio-500 cursor-pointer">
                    Pistach <span className="text-white bg-pistachio-500 rounded-xl pl-2 pr-2">io</span>
                </Link>
                <div>
                    <Link href="/login" className="text-text-300 font-semibold py-2 px-5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                        Log In
                    </Link>
                    <Link href="/signup" className="bg-pistachio-500 text-white font-semibold py-2 px-5 ml-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
                        Sign Up
                    </Link>
                </div>
            </header>

            <main className="w-full flex-1 flex flex-col items-center justify-center text-center p-8 pt-16 pb-16">
                <div className="max-w-3xl w-full">
                    <h1 className="text-5xl md:text-6xl font-main text-pistachio-500 mb-4 animate-fade-in-down">
                        Welcome to Pistachio!
                    </h1>
                    <p className="text-text-300 text-lg md:text-xl mb-10 animate-fade-in-up">
                        Your personal AI assistant for communication, learning, and creativity. <br/>Start a conversation and discover new possibilities.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/signup" className="bg-pistachio-500 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity duration-300 text-lg cursor-pointer">
                            Get Started
                        </Link>
                    </div>
                </div>
            </main>

            <section className="w-full bg-white py-20">
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-4xl font-main text-center text-text-300 mb-12">Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow">
                                <FeatureIcon src={feature.icon} alt={`${feature.title} icon`} />
                                <h3 className="text-xl font-semibold text-text-300 mb-2">{feature.title}</h3>
                                <p className="text-[#666]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="w-full p-6 bg-gray-100">
                <div className="text-sm text-center text-[#999999]">
                    © 2025 Pistachio
                </div>
            </footer>
        </div>
    );
}