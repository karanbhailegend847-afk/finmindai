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
    { title: 'Features', href: '#' },
    { title: 'Solution', href: '#' },
    { title: 'Customers', href: '#' },
    { title: 'Pricing', href: '#' },
    { title: 'Help', href: '#' },
    { title: 'About', href: '#' },
];

export default function FooterSection() {
    return (
        <footer className="py-16 md:py-24 border-t border-border/30 bg-surface/30">
            <div className="mx-auto max-w-5xl px-6">
                <a
                    href="/"
                    aria-label="go home"
                    className="mx-auto w-fit flex items-center justify-center font-display font-bold text-2xl gap-1.5"
                >
                    FinMind<span className="text-primary text-3xl">.</span>
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
