"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex items-center w-fit rounded-full border border-border/50 bg-background/50 backdrop-blur-xl p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      <Tab setPosition={setPosition}>Platform</Tab>
      <Tab setPosition={setPosition}>Features</Tab>
      <Tab setPosition={setPosition}>Vision</Tab>
      <Tab setPosition={setPosition}>Pricing</Tab>

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null);
  
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 flex items-center cursor-pointer px-4 py-1.5 text-xs uppercase tracking-wider font-semibold text-white mix-blend-difference md:px-5 md:py-2 md:text-sm transition-colors"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      className="absolute top-1/2 -translate-y-1/2 z-0 h-[28px] md:h-[36px] rounded-full bg-white shadow-lg pointer-events-none"
    />
  );
};

export default NavHeader;
