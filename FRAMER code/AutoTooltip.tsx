import React, { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  showDelay?: number;
  autoHideDuration?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  width?: number;
  height?: number;
}

export default function AutoTooltip(props: TooltipProps) {
  const {
    showDelay = 5000,
    autoHideDuration = 8000,
    backgroundColor = "#1F2937",
    textColor = "#FFFFFF",
    fontSize = 14,
    borderRadius = 8,
    width = 300,
    height = 60,
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 1024;
      setIsMobile(isTouchDevice && isSmallScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Show tooltip after delay
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(showTimer);
  }, [showDelay]);

  // Auto hide tooltip
  useEffect(() => {
    if (isVisible) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDuration);

      return () => clearTimeout(hideTimer);
    }
  }, [isVisible, autoHideDuration]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const getTooltipText = () => {
    if (isMobile) {
      return "Use ← → arrow keys or swipe to navigate";
    }
    return "Use ← → arrow keys to navigate";
  };

  return (
    <div
      style={{
        width: width,
        height: height,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: 25, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            style={{
              backgroundColor,
              color: textColor,
              padding: "12px 16px",
              borderRadius,
              fontSize,
              fontFamily: "system-ui, -apple-system, sans-serif",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              maxWidth: 280,
              transformOrigin: "top right",
              whiteSpace: "nowrap",
            }}
          >
            <span>{getTooltipText()}</span>

            <motion.button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                color: textColor,
                cursor: "pointer",
                padding: 4,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 4,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

addPropertyControls(AutoTooltip, {
  width: {
    type: ControlType.Number,
    title: "Width",
    min: 200,
    max: 500,
    step: 10,
    defaultValue: 300,
  },
  height: {
    type: ControlType.Number,
    title: "Height",
    min: 40,
    max: 100,
    step: 10,
    defaultValue: 60,
  },
  showDelay: {
    type: ControlType.Number,
    title: "Show Delay (ms)",
    min: 1000,
    max: 10000,
    step: 500,
    defaultValue: 5000,
  },
  autoHideDuration: {
    type: ControlType.Number,
    title: "Auto Hide (ms)",
    min: 3000,
    max: 15000,
    step: 1000,
    defaultValue: 8000,
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#1F2937",
  },
  textColor: {
    type: ControlType.Color,
    title: "Text Color",
    defaultValue: "#FFFFFF",
  },
  fontSize: {
    type: ControlType.Number,
    title: "Font Size",
    min: 12,
    max: 18,
    step: 1,
    defaultValue: 14,
  },
  borderRadius: {
    type: ControlType.Number,
    title: "Border Radius",
    min: 0,
    max: 20,
    step: 2,
    defaultValue: 8,
  },
});
