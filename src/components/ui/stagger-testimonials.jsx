"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  { tempId: 0, testimonial: "My favorite solution in the market. We work 5x faster with FinMind.", by: "Alex, CEO at TechCorp", imgSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" },
  { tempId: 1, testimonial: "I'm confident my data is safe with FinMind. I can't say that about other providers.", by: "Dan, CTO at SecureNet", imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" },
  { tempId: 2, testimonial: "I know it's cliche, but we were lost before we found FinMind. Can't thank you guys enough!", by: "Stephanie, COO at InnovateCo", imgSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" },
  { tempId: 3, testimonial: "FinMind's products make planning for the future seamless. Can't recommend them enough!", by: "Marie, CFO at FuturePlanning", imgSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop" },
  { tempId: 4, testimonial: "If I could give 11 stars, I'd give 12. Complete financial redesign.", by: "Andre, Head of Design", imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
  { tempId: 5, testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.", by: "Jeremy, Product Manager", imgSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop" },
  { tempId: 6, testimonial: "Took some convincing, but now that we're on FinMind, we're never going back.", by: "Pam, Marketing Director", imgSrc: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop" },
  { tempId: 7, testimonial: "I would be lost without FinMind's in-depth analytics. The ROI is EASILY 100X for us.", by: "Daniel, Data Scientist", imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
  { tempId: 8, testimonial: "It's just the best. Period.", by: "Fernando, UX Designer", imgSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop" },
  { tempId: 9, testimonial: "I switched 5 years ago and never looked back.", by: "Andy, DevOps Engineer", imgSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop" }
];

const TestimonialCard = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-primary text-white border-primary" 
          : "z-0 bg-surface text-text-primary border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px var(--color-border)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
      />
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by}
        className="mb-4 h-14 w-14 rounded-full bg-background object-cover object-center ring-2 ring-background border-none"
        style={{
          boxShadow: "0px 0px 0px var(--color-background)"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium font-display leading-relaxed",
        isCenter ? "text-white" : "text-white"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic font-body",
        isCenter ? "text-white/80" : "text-text-secondary"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-transparent"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-colors",
            "bg-surface border border-border hover:bg-primary hover:text-white text-text-secondary"
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-colors",
            "bg-surface border border-border hover:bg-primary hover:text-white text-text-secondary"
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
