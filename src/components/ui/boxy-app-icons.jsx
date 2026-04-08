import React from 'react';
import { Camera, MessageCircle, Code, Users, Play, PenTool } from 'lucide-react';
import { cn } from '../../lib/utils';

const socialIcons = [
  { id: 'instagram_alt', icon: Camera, color: 'group-hover:text-pink-500', bg: 'group-hover:bg-pink-500/10', border: 'group-hover:border-pink-500/30' },
  { id: 'twitter_alt', icon: MessageCircle, color: 'group-hover:text-blue-400', bg: 'group-hover:bg-blue-400/10', border: 'group-hover:border-blue-400/30' },
  { id: 'github_alt', icon: Code, color: 'group-hover:text-white', bg: 'group-hover:bg-white/10', border: 'group-hover:border-white/30' },
  { id: 'linkedin_alt', icon: Users, color: 'group-hover:text-blue-600', bg: 'group-hover:bg-blue-600/10', border: 'group-hover:border-blue-600/30' },
  { id: 'youtube_alt', icon: Play, color: 'group-hover:text-red-500', bg: 'group-hover:bg-red-500/10', border: 'group-hover:border-red-500/30' },
  { id: 'figma_alt', icon: PenTool, color: 'group-hover:text-purple-400', bg: 'group-hover:bg-purple-400/10', border: 'group-hover:border-purple-400/30' },
];

const AppIcons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-12 max-w-4xl mx-auto py-12">
      {socialIcons.map((platform) => {
        const Icon = platform.icon;
        return (
          <div key={platform.id} className="relative group w-24 h-24 hover:cursor-pointer perspective-1000">
            {/* Box Shadow / Base Layer */}
            <div className="absolute inset-0 bg-[#0A0A0F] border border-border/40 rounded-2xl md:rounded-3xl translate-y-3 translate-x-2 transition-all duration-300" />
            
            {/* Top Interactive Face */}
            <div className={cn(
              "absolute inset-0 bg-surface backdrop-blur-md border border-border/80 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-300 ease-out",
              "group-hover:-translate-y-2 group-hover:-translate-x-1 shadow-lg group-hover:shadow-2xl",
              platform.bg,
              platform.border
            )}>
              <Icon strokeWidth={1.5} className={cn("w-10 h-10 text-text-secondary transition-colors duration-300", platform.color)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppIcons;
