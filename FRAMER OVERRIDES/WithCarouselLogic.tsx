import React, { useState, useEffect, ComponentType } from "react";
import { motion } from "framer-motion";

// Override for the main slider component
export function withCarouselLogic(Component: ComponentType): ComponentType {
  return React.forwardRef((props: any, ref) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const totalSlides = 3; // Adjust based on your variants
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Give focus to component on mount for immediate keyboard access
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    }, []);

    // Handle keyboard navigation - MUST include currentSlide dependency for closures to work
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goToPrevious();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          goToNext();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentSlide]); // Keep this dependency - it's needed for the closures to update

    const goToNext = () => {
      if (currentSlide < totalSlides) {
        setDirection(1);
        setCurrentSlide(currentSlide + 1);
      }
    };

    const goToPrevious = () => {
      if (currentSlide > 1) {
        setDirection(-1);
        setCurrentSlide(currentSlide - 1);
      }
    };

    // Store navigation functions globally so arrows can access them
    useEffect(() => {
      (window as any).carouselNavigation = {
        currentSlide,
        goToNext,
        goToPrevious,
        isFirstSlide: currentSlide === 1,
        isLastSlide: currentSlide === totalSlides,
      };
    }, [currentSlide]);

    // Animation variants for sliding effect
    const slideVariants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
      }),
    };

    return (
      <motion.div
        ref={containerRef}
        key={currentSlide}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        tabIndex={0} // Make focuseable for keyboard events
        style={{
          ...props.style,
          position: "relative",
          width: "100%",
          height: "100%",
          outline: "none", // Remove focus outline
        }}
      >
        <Component
          {...props}
          ref={ref}
          // Force the slider to the current variant
          variant={currentSlide.toString()}
        />
      </motion.div>
    );
  });
}

// Override for the right arrow
export function withRightArrow(Component: ComponentType): ComponentType {
  return React.forwardRef((props: any, ref) => {
    const [navState, setNavState] = useState({
      currentSlide: 1,
      isLastSlide: false,
    });

    // Listen for navigation state changes
    useEffect(() => {
      const checkNavState = () => {
        const nav = (window as any).carouselNavigation;
        if (nav) {
          setNavState({
            currentSlide: nav.currentSlide,
            isLastSlide: nav.isLastSlide,
          });
        }
      };

      // Check immediately and set up polling
      checkNavState();
      const interval = setInterval(checkNavState, 50);
      return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
      const nav = (window as any).carouselNavigation;
      if (nav && !nav.isLastSlide) {
        nav.goToNext();
      }
    };

    return (
      <motion.div
        ref={ref}
        onClick={handleClick}
        style={{
          ...props.style,
          cursor: navState.isLastSlide ? "not-allowed" : "pointer",
          opacity: navState.isLastSlide ? 0.5 : 1,
          pointerEvents: navState.isLastSlide ? "none" : "auto",
        }}
        whileHover={!navState.isLastSlide ? { scale: 1.05 } : {}}
        whileTap={!navState.isLastSlide ? { scale: 0.95 } : {}}
        animate={{
          opacity: navState.isLastSlide ? 0.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <Component {...props} />
      </motion.div>
    );
  });
}

// Override for the left arrow
export function withLeftArrow(Component: ComponentType): ComponentType {
  return React.forwardRef((props: any, ref) => {
    const [navState, setNavState] = useState({
      currentSlide: 1,
      isFirstSlide: true,
    });

    // Listen for navigation state changes
    useEffect(() => {
      const checkNavState = () => {
        const nav = (window as any).carouselNavigation;
        if (nav) {
          setNavState({
            currentSlide: nav.currentSlide,
            isFirstSlide: nav.isFirstSlide,
          });
        }
      };

      // Check immediately and set up polling
      checkNavState();
      const interval = setInterval(checkNavState, 50);
      return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
      const nav = (window as any).carouselNavigation;
      if (nav && !nav.isFirstSlide) {
        nav.goToPrevious();
      }
    };

    return (
      <motion.div
        ref={ref}
        onClick={handleClick}
        style={{
          ...props.style,
          cursor: navState.isFirstSlide ? "not-allowed" : "pointer",
          opacity: navState.isFirstSlide ? 0.5 : 1,
          pointerEvents: navState.isFirstSlide ? "none" : "auto",
        }}
        whileHover={!navState.isFirstSlide ? { scale: 1.05 } : {}}
        whileTap={!navState.isFirstSlide ? { scale: 0.95 } : {}}
        animate={{
          opacity: navState.isFirstSlide ? 0.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <Component {...props} />
      </motion.div>
    );
  });
}
