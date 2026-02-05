"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Proposal {
    id: string;
    creatorName: string;
    partnerName: string;
    image: string | null;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const slug = params.slug as string;
    const time = searchParams.get("time");
    const attempts = searchParams.get("attempts");
    const responseId = searchParams.get("responseId");

    const [showConfetti, setShowConfetti] = useState(true);
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Fetch proposal data to get the creator's image
    useEffect(() => {
        if (slug) {
            fetch(`/api/proposals/${slug}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && !data.error) {
                        setProposal(data);
                    }
                })
                .catch(console.error);
        }
    }, [slug]);

    // Fetch existing image if responseId exists
    useEffect(() => {
        if (responseId) {
            fetch(`/api/responses?id=${responseId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.image) {
                        setImage(data.image);
                    }
                })
                .catch(console.error);
        }
    }, [responseId]);

    const formatTime = (ms: string | null) => {
        if (!ms) return "0s";
        const totalSeconds = Math.floor(parseInt(ms) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes === 0) return `${seconds}s`;
        return `${minutes}m ${seconds}s`;
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !responseId) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image too large! Maximum size is 5MB.");
            return;
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        setUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                
                // Upload to API
                const res = await fetch("/api/responses", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: responseId,
                        image: base64,
                    }),
                });

                if (res.ok) {
                    setImage(base64);
                    setUploadSuccess(true);
                    setTimeout(() => setUploadSuccess(false), 3000);
                } else {
                    const error = await res.json();
                    alert(error.error || "Failed to upload image");
                }
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploading(false);
            alert("Failed to upload image");
        }
    };

    // Generate confetti pieces
    const confettiColors = ["#ff2d55", "#ff6b8a", "#ff85a2", "#ff1744", "#e91e63", "#f50057"];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 8 + Math.random() * 12,
    }));

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden">
            {/* Confetti */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {confettiPieces.map((piece) => (
                        <motion.div
                            key={piece.id}
                            initial={{
                                y: -20,
                                x: `${piece.x}vw`,
                                rotate: 0,
                                opacity: 1,
                            }}
                            animate={{
                                y: "110vh",
                                rotate: 720,
                                opacity: 0,
                            }}
                            transition={{
                                duration: piece.duration,
                                delay: piece.delay,
                                ease: "linear",
                            }}
                            style={{
                                position: "absolute",
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                                borderRadius: piece.id % 3 === 0 ? "50%" : "0",
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="text-center max-w-2xl mx-auto">
                {/* Round Profile Image at Top */}
                {proposal?.image && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="mb-6"
                    >
                        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 p-1 animate-pulse">
                                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                    <Image
                                        src={proposal.image}
                                        alt="Love"
                                        fill
                                        className="object-cover rounded-full"
                                    />
                                </div>
                            </div>
                            {/* Heart decoration */}
                            <motion.div
                                className="absolute -bottom-2 -right-2 text-3xl"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                💕
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Celebration */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: proposal?.image ? 0.2 : 0 }}
                    className="text-8xl md:text-9xl mb-6"
                >
                    🎉💕🎉
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: proposal?.image ? 0.5 : 0.3 }}
                    className="text-4xl md:text-6xl font-bold gradient-text mb-4"
                >
                    YES! You said YES!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: proposal?.image ? 0.7 : 0.5 }}
                    className="text-xl text-gray-300 mb-8"
                >
                    This is going to be the most amazing Valentine&apos;s Day ever! 💕
                </motion.p>

                {/* Stats card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-6 mb-8"
                >
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">💘 Your Love Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-3xl font-bold text-green-400">{formatTime(time)}</div>
                            <div className="text-sm text-gray-400">Time to say YES</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-3xl font-bold text-pink-400">{attempts || 0}</div>
                            <div className="text-sm text-gray-400">NO button escapes</div>
                        </div>
                    </div>
                </motion.div>

                {/* Photo Upload Section */}
                {responseId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="glass-card p-6 mb-8"
                    >
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">📸 Share Your Moment</h3>
                        
                        {image ? (
                            <div className="relative">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5">
                                    <Image
                                        src={image}
                                        alt="Your Valentine moment"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-4 text-sm text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                    📷 Change Photo
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/20 rounded-lg p-8 cursor-pointer hover:border-pink-500/50 transition-colors"
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="spinner" />
                                        <p className="text-gray-400">Uploading...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-5xl">📷</div>
                                        <p className="text-gray-300 font-medium">Upload a Photo</p>
                                        <p className="text-sm text-gray-500">Capture this special moment together!</p>
                                        <p className="text-xs text-gray-600">Max 5MB • JPG, PNG, GIF</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        <AnimatePresence>
                            {uploadSuccess && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-green-400 text-sm mt-3"
                                >
                                    ✓ Photo uploaded successfully!
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="glass-card p-6 mb-8"
                >
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">💡 Valentine&apos;s Day Ideas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                            <span className="text-2xl">🍽️</span>
                            <div>
                                <div className="font-medium">Romantic Dinner</div>
                                <div className="text-sm text-gray-400">Cook together or go out</div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                            <span className="text-2xl">🎬</span>
                            <div>
                                <div className="font-medium">Movie Night</div>
                                <div className="text-sm text-gray-400">Watch your favorite films</div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                            <span className="text-2xl">🌹</span>
                            <div>
                                <div className="font-medium">Flowers & Chocolates</div>
                                <div className="text-sm text-gray-400">A classic combo</div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                            <span className="text-2xl">✨</span>
                            <div>
                                <div className="font-medium">Stargazing</div>
                                <div className="text-sm text-gray-400">A magical evening under the stars</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Share message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-gray-500 text-sm"
                >
                    Take a screenshot and share this special moment! 📸💕
                </motion.p>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center relative z-10">
                <div className="spinner" />
            </main>
        }>
            <SuccessContent />
        </Suspense>
    );
}
