"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Proposal {
    id: string;
    slug: string;
    creatorName: string;
    partnerName: string;
    message: string | null;
}

// Falling hearts component
function FallingHearts() {
    const hearts = ["💕", "❤️", "💗", "💖", "💓", "💝", "🩷", "💘"];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 20 }).map((_, i) => {
                const heart = hearts[Math.floor(Math.random() * hearts.length)];
                const left = Math.random() * 100;
                const delay = Math.random() * 5;
                const duration = 8 + Math.random() * 7;
                const size = 16 + Math.random() * 24;

                return (
                    <motion.div
                        key={i}
                        className="absolute"
                        initial={{
                            top: -50,
                            left: `${left}%`,
                            opacity: 0.7,
                            rotate: 0
                        }}
                        animate={{
                            top: "110%",
                            rotate: [0, 15, -15, 10, -10, 0],
                            x: [0, 30, -30, 20, -20, 0]
                        }}
                        transition={{
                            duration: duration,
                            delay: delay,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ fontSize: size }}
                    >
                        {heart}
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function ProposalPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Analytics tracking
    const startTimeRef = useRef<number>(Date.now());
    const [noAttempts, setNoAttempts] = useState(0);

    // NO button position - moves within a bounded area
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const buttonContainerRef = useRef<HTMLDivElement>(null);

    // Session storage key
    const getSessionKey = () => `valentine_session_${slug}`;

    // Load session from localStorage
    useEffect(() => {
        if (slug) {
            fetchProposal();

            // Try to restore session
            try {
                const saved = localStorage.getItem(getSessionKey());
                if (saved) {
                    const session = JSON.parse(saved);
                    // Restore start time (use saved if exists, otherwise now)
                    startTimeRef.current = session.startTime || Date.now();
                    // Restore NO attempts
                    if (session.noAttempts) {
                        setNoAttempts(session.noAttempts);
                    }
                } else {
                    // New session - save initial state
                    startTimeRef.current = Date.now();
                    saveSession(0);
                }
            } catch {
                startTimeRef.current = Date.now();
            }
        }
    }, [slug]);

    // Save session to localStorage
    const saveSession = useCallback((attempts: number) => {
        try {
            const session = {
                startTime: startTimeRef.current,
                noAttempts: attempts,
                lastVisit: Date.now(),
                slug: slug,
            };
            localStorage.setItem(getSessionKey(), JSON.stringify(session));
        } catch {
            // localStorage might be full or unavailable
        }
    }, [slug]);

    // Save session before page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveSession(noAttempts);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [noAttempts, saveSession]);

    // Save session whenever attempts change
    useEffect(() => {
        if (slug && noAttempts > 0) {
            saveSession(noAttempts);
        }
    }, [noAttempts, slug, saveSession]);

    const fetchProposal = async () => {
        try {
            const res = await fetch(`/api/proposals/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setProposal(data);
            } else {
                setError("This proposal link is not valid 😢");
            }
        } catch (err) {
            setError("Something went wrong");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const moveNoButton = useCallback(() => {
        // Generate random position within visible area
        // Keep button within approximately -150 to 150 pixels from center
        const positions = [
            { x: 150, y: 0 },      // Right
            { x: -150, y: 0 },     // Left
            { x: 0, y: 80 },       // Below
            { x: 120, y: 60 },     // Bottom right
            { x: -120, y: 60 },    // Bottom left
            { x: 100, y: -50 },    // Top right
            { x: -100, y: -50 },   // Top left
            { x: 80, y: 100 },     // Far bottom right
            { x: -80, y: 100 },    // Far bottom left
        ];

        // Pick a random position different from current
        let newPos;
        do {
            newPos = positions[Math.floor(Math.random() * positions.length)];
        } while (newPos.x === noPosition.x && newPos.y === noPosition.y);

        setNoPosition(newPos);
        setNoAttempts((prev) => prev + 1);
    }, [noPosition]);

    const handleYesClick = async () => {
        const timeToYes = Date.now() - startTimeRef.current;

        // Record analytics
        if (proposal) {
            try {
                const res = await fetch("/api/responses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        proposalId: proposal.id,
                        timeToYes,
                        noAttempts,
                    }),
                });

                const data = await res.json();

                // Clear session after successful submission
                localStorage.removeItem(getSessionKey());

                // Navigate to success page with query params including response ID
                router.push(`/v/${slug}/success?time=${timeToYes}&attempts=${noAttempts}&responseId=${data.id}`);
                return;
            } catch (err) {
                console.error("Failed to record response:", err);
            }
        }

        // Navigate to success page with query params (fallback without responseId)
        router.push(`/v/${slug}/success?time=${timeToYes}&attempts=${noAttempts}`);
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center relative z-10">
                <FallingHearts />
                <div className="spinner" />
            </main>
        );
    }

    if (error || !proposal) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <FallingHearts />
                <div className="glass-card p-6 sm:p-8 text-center max-w-md w-full">
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">💔</div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Oops!</h1>
                    <p className="text-gray-400 text-sm sm:text-base">{error || "Proposal not found"}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Falling Hearts Background */}
            <FallingHearts />

            <div className="text-center max-w-2xl mx-auto relative z-10 w-full">
                {/* Heart animation */}
                <motion.div
                    className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    💕
                </motion.div>

                {/* Greeting */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
                    Hey <span className="gradient-text">{proposal.partnerName}</span>! 👋
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-2 px-2">
                    <span className="text-white font-semibold">{proposal.creatorName}</span> has something special to ask you...
                </p>

                {proposal.message && (
                    <p className="text-gray-400 italic mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
                        &ldquo;{proposal.message}&rdquo;
                    </p>
                )}

                {/* The big question */}
                <div className="glass-card p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text animate-pulse-slow">
                        Will you be my Valentine?
                    </h2>
                </div>

                {/* Buttons container - [YES] [NO] side by side */}
                <div
                    ref={buttonContainerRef}
                    className="relative h-[180px] sm:h-[200px] w-full max-w-lg mx-auto flex items-start justify-center pt-2 sm:pt-4 overflow-hidden"
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* YES button - stays in place */}
                        <motion.button
                            onClick={handleYesClick}
                            className="btn-yes"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            YES 💕
                        </motion.button>

                        {/* NO button - moves but stays visible */}
                        <motion.button
                            animate={{
                                x: noPosition.x * 0.7,
                                y: noPosition.y * 0.7
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                mass: 0.8
                            }}
                            onMouseEnter={moveNoButton}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                moveNoButton();
                            }}
                            className="btn-no"
                        >
                            NO 😢
                        </motion.button>
                    </div>
                </div>

                {/* Attempt counter */}
                <AnimatePresence>
                    {noAttempts > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center mt-2 sm:mt-4"
                        >
                            <p className="text-pink-400 text-sm sm:text-base md:text-lg font-medium">
                                {noAttempts === 1 && "Nice try! 😏"}
                                {noAttempts === 2 && "Still trying? 😂"}
                                {noAttempts === 3 && "You can't escape love! 💕"}
                                {noAttempts === 4 && "It's destiny! 💘"}
                                {noAttempts === 5 && "Just give in! 🥰"}
                                {noAttempts >= 6 && noAttempts < 10 && `${noAttempts} attempts... Just say YES! 😄`}
                                {noAttempts >= 10 && `${noAttempts} attempts?! You really don't want to say yes? 🥺`}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
