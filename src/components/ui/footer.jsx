import React from 'react';
import {
    Globe, 
    Share2, 
    MessageCircle, 
    Link as LinkIcon, 
    Send, 
    Feather, 
} from 'lucide-react';

const links = [
    { title: 'Platform', href: '/platform' },
    { title: 'Features', href: '/features' },
    { title: 'Vision', href: '/vision' },
    { title: 'Pricing', href: '/pricing' },
];

export default function FooterSection() {
    return (
        <footer className="py-20 md:py-28 bg-[#050507] relative overflow-hidden border-t border-white/5">
            {/* Top Gradient Glow for seamless transition */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-primary/[0.03] blur-[100px] pointer-events-none" />
            
            <div className="mx-auto max-w-5xl px-6 relative z-10">
                <a
                    href="/"
                    aria-label="go home"
                    className="mx-auto w-fit flex items-center justify-center font-display font-bold text-2xl gap-2.5"
                >
                    <img src="/logo.png" alt="FinMind Logo" className="w-8 h-8 object-contain rounded-lg" />
                    <span>FinMind<span className="text-primary text-3xl">.</span></span>
                </a>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="text-text-secondary hover:text-primary block duration-150 font-medium tracking-wide">
                            <span>{link.title}</span>
                        </a>
                    ))}
                </div>
                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-primary block transition-colors">
                        <Share2 className="w-5 h-5" />
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-primary block transition-colors">
                        <MessageCircle className="w-5 h-5" />
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-primary block transition-colors">
                        <LinkIcon className="w-5 h-5" />
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-primary block transition-colors">
                        <Globe className="w-5 h-5" />
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary hover:text-primary block transition-colors">
                        <Send className="w-5 h-5" />
                    </a>
                </div>
                <span className="text-text-secondary block text-center text-xs uppercase tracking-widest font-semibold mt-16">
                    © {new Date().getFullYear()} FinMind AI, All rights reserved.
                </span>
            </div>
        </footer>
    );
}
