import React, { forwardRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

export const ProductHighlightCard = forwardRef(
  ({ className, categoryIcon, category, title, description, imageSrc, imageAlt, ...props }, ref) => {
    
    // --- Animation Logic for 3D Tilt Effect ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      mouseX.set(x);
      mouseY.set(y);
    };

    // Transform mouse position into a rotation value
    const rotateX = useTransform(mouseY, [0, 350], [8, -8]);
    const rotateY = useTransform(mouseX, [0, 350], [-8, 8]);
    
    // Apply spring physics for a smoother animation
    const springConfig = { stiffness: 300, damping: 20 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);
    
    // --- Animation Logic for Glow Effect ---
    const glowX = useTransform(mouseX, [0, 350], [0, 100]);
    const glowY = useTransform(mouseY, [0, 350], [0, 100]);
    const glowOpacity = useTransform(mouseX, [0, 350], [0, 0.4]);

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-[350px] w-[350px] max-w-[90vw] rounded-3xl bg-surface/30 backdrop-blur-xl border border-border transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(123,92,240,0.15)]",
          className
        )}
        {...props}
      >
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="absolute inset-5 rounded-2xl bg-white/5 border border-white/10 shadow-inner overflow-hidden">
          
          {/* Diagonal line texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]"></div>

          {/* Glow effect that follows the mouse */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300"
            style={{
              opacity: glowOpacity,
              background: `radial-gradient(150px at ${glowX}% ${glowY}%, rgba(123,92,240,0.4), transparent 50%)`,
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-center space-x-2 text-white/90">
              {categoryIcon}
              <span className="text-xs font-display font-bold tracking-widest uppercase text-text-secondary">{category}</span>
            </div>
            
            <div className="text-white z-10 relative">
              <h2 className="text-3xl font-display font-extrabold tracking-tight mb-2 drop-shadow-md">{title}</h2>
              <p className="mt-2 max-w-[70%] text-sm font-body text-text-secondary leading-loose">
                {description}
              </p>
            </div>
          </div>
          
          {/* Product Image */}
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            style={{ transform: "translateZ(70px)" }}
            whileHover={{ scale: 1.05, y: -10, x: 5, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -right-8 -bottom-8 h-44 w-44 object-cover rounded-[1.5rem] shadow-2xl border border-white/10"
          />
        </div>
      </motion.div>
    );
  }
);
ProductHighlightCard.displayName = "ProductHighlightCard";
