import { useRef, useState, } from 'react';
import type {ReactElement} from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Heart, Stars } from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. PLACEHOLDER IMAGE - REPLACE THIS URL WITH A PHOTO OF HER OR YOU TWO
// const HER_IMAGE_URL = "/image/IMG_2203.jpeg";

// Define stage types for better type safety
type Stage = 0 | 1 | 2 | 3;

const App = (): ReactElement => {
  // State to manage the timeline flow
  // 0: Intro (Black screen + Text)
  // 1: Memory (Image fade in/out)
  // 2: Proposal (The Question)
  // 3: Success (She said yes!)
  const [stage, setStage] = useState<Stage>(0);

  // Refs for animation targeting with proper types
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const proposalRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline();

    if (stage === 0 && textRef.current) {
      // PHASE 1: THE INTRO
      // Split text animation for "Kittu"
      const chars = textRef.current.children;
      
      tl.fromTo(chars, 
        { opacity: 0, y: 50, rotateX: -90 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          stagger: 0.1, 
          duration: 1.2, 
          ease: "back.out(1.7)" as gsap.EaseString,
          delay: 0.5
        }
      )
      .to(chars, {
        color: "#ff4d6d", // Change to pink
        textShadow: "0 0 20px #ff4d6d",
        duration: 1,
        delay: 0.5
      })
      .to(chars, {
        opacity: 0,
        y: -50,
        stagger: 0.05,
        duration: 0.8,
        delay: 1,
        onComplete: () => setStage(1) // Move to next stage
      });
    }

    if (stage === 1 && imageRef.current) {
      // PHASE 2: THE IMAGE MEMORY
      tl.fromTo(imageRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
      )
      .to(imageRef.current, {
        scale: 1.1,
        duration: 3, // How long the image stays visible
        ease: "none"
      })
      .to(imageRef.current, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.5,
        onComplete: () => setStage(2) // Move to proposal
      });
    }

    if (stage === 2 && proposalRef.current) {
      // PHASE 3: THE PROPOSAL
      gsap.fromTo(proposalRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
      );
    }

  }, [stage]);

  // Handler for the "No" button running away
  const moveNoButton = (): void => {
    if (noBtnRef.current) {
      const x = Math.random() * 200 - 100;
      const y = Math.random() * 200 - 100;
      gsap.to(noBtnRef.current, { x, y, duration: 0.2, ease: "power1.out" });
    }
  };

  // Handler for "Yes"
  const handleYes = (): void => {
    setStage(3);
    // Trigger Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = (): void => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d6d', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4d6d', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-body">
      
      {/* Background Ambience (Stars) */}
      <div className="absolute inset-0 z-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* STAGE 0: INTRO TEXT */}
      {stage === 0 && (
        <div ref={textRef} className="flex space-x-2 z-10">
          {/* We split the word "Kittu" into individual spans for GSAP to animate */}
          {"Kittu".split("").map((char, index) => (
            <span key={index} className="text-6xl md:text-9xl font-romantic font-bold text-white inline-block">
              {char}
            </span>
          ))}
        </div>
      )}

      {/* STAGE 1: THE IMAGE */}
      {stage === 1 && (
        <div ref={imageRef} className="z-10 p-4">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,77,109,0.5)] border-4 border-love/30">
             {/*  - Contextual placeholder logic */}
            <img 
              src={"/IMG_2203.jpeg"} 
              alt="Beautiful Memory" 
              className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
              <p className="text-white/90 font-romantic text-2xl">You light up my world...</p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: THE PROPOSAL */}
      {stage === 2 && (
        <div ref={proposalRef} className="z-10 text-center px-4">
          <div className="glass-card p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-lg mx-auto">
            <Heart className="w-16 h-16 text-love fill-love animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-romantic text-white leading-tight">
              Will you be my <span className="text-love">Valentine?</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Walking through life with you is my favorite adventure.
            </p>
            
            <div className="flex items-center gap-4 mt-4 w-full justify-center relative h-20">
              <button 
                onClick={handleYes}
                className="px-8 py-3 bg-love text-white rounded-full text-xl font-semibold shadow-lg hover:bg-red-600 hover:scale-105 transition-all transform"
              >
                Yes! ❤️
              </button>
              
              <button 
                ref={noBtnRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                className="px-8 py-3 bg-gray-700 text-gray-300 rounded-full text-xl font-semibold hover:bg-gray-600 transition-colors absolute"
                style={{ right: '10%' }} // Initial positioning
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: SUCCESS */}
      {stage === 3 && (
        <div className="z-20 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-romantic text-white mb-4">
            Yay! I Love You! ❤️
          </h1>
          <p className="text-2xl text-pink-200">See you on the 14th!</p>
          <div className="mt-8 flex justify-center gap-4">
             <Stars className="w-12 h-12 text-yellow-400 animate-spin-slow" />
             <Heart className="w-12 h-12 text-love fill-love animate-ping" />
             <Stars className="w-12 h-12 text-yellow-400 animate-spin-slow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;