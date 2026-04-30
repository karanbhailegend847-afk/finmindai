"use client";
import React from "react";
import { motion } from "framer-motion";

export const TimelineContent = ({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  as = "div",
}) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={animationNum}
      className={className}
    >
      {children}
    </Component>
  );
};
