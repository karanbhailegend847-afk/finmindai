import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const location = useLocation();

  return (
    <ul
      className="relative mx-auto flex items-center w-fit rounded-full border border-border/50 bg-background/50 backdrop-blur-xl p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
    >
      <Tab setPosition={setPosition} path="/platform">Platform</Tab>
      <Tab setPosition={setPosition} path="/features">Features</Tab>
      <Tab setPosition={setPosition} path="/vision">Vision</Tab>
      <Tab setPosition={setPosition} path="/pricing">Pricing</Tab>

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({ children, setPosition, path }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
  
  // Set position if active
  useEffect(() => {
    if (isActive && ref.current) {
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
    }
  }, [isActive, location.pathname, setPosition]);

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
      onClick={() => navigate(path)}
      className={`relative z-10 flex items-center cursor-pointer px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-widest font-black transition-colors duration-300 md:px-5 md:py-2 ${isActive ? 'text-black' : 'text-text-secondary hover:text-white'}`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      className="absolute top-1/2 -translate-y-1/2 z-0 h-[28px] md:h-[36px] rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] pointer-events-none"
    />
  );
};

export default NavHeader;
