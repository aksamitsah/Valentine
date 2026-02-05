"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CreateProposal() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        creatorName: "",
        partnerName: "",
        message: "",
        image: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.name) {
            setFormData((prev) => ({ ...prev, creatorName: session.user.name || "" }));
        }
    }, [session]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image too large! Maximum size is 5MB.");
            return;
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setImagePreview(base64);
            setFormData((prev) => ({ ...prev, image: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData((prev) => ({ ...prev, image: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/proposals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setSuccess(data.slug);
            } else {
                const errorData = await res.json();
                setError(errorData.error || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to create proposal");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        if (success) {
            navigator.clipboard.writeText(`${window.location.origin}/v/${success}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (status === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center relative z-10">
                <div className="spinner" />
            </main>
        );
    }

    if (!session) {
        return null;
    }

    // Success state
    if (success) {
        const link = `${typeof window !== "undefined" ? window.location.origin : ""}/v/${success}`;

        return (
            <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <div className="glass-card p-8 max-w-lg w-full text-center">
                    <div className="text-6xl mb-4 heartbeat">🎉</div>
                    <h1 className="text-3xl font-bold gradient-text mb-4">
                        Proposal Created!
                    </h1>
                    <p className="text-gray-400 mb-6">
                        Share this magical link with <span className="text-white font-semibold">{formData.partnerName}</span>
                    </p>

                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-400 mb-2">Your special link:</p>
                        <p className="text-white font-mono text-sm break-all">{link}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={copyLink}
                            className={`w-full py-3 rounded-full font-semibold transition-all ${copied
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            {copied ? "✓ Copied to Clipboard!" : "📋 Copy Link"}
                        </button>
                        <Link
                            href={`/v/${success}`}
                            target="_blank"
                            className="btn-secondary text-center"
                        >
                            Preview Link →
                        </Link>
                        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
            <div className="glass-card p-8 max-w-lg w-full">
                <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold gradient-text mb-2">
                    Create a Proposal 💕
                </h1>
                <p className="text-gray-400 mb-6">
                    Fill in the details and we&apos;ll create a magical link for you
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Photo 📷 (Optional)
                        </label>
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-500">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-20 h-20 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-pink-500/50 transition-colors"
                                >
                                    <span className="text-2xl">📷</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-sm text-pink-400 hover:text-pink-300"
                                >
                                    {imagePreview ? "Change Photo" : "Upload Photo"}
                                </button>
                                <p className="text-xs text-gray-500 mt-1">
                                    This will appear on the proposal page
                                </p>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Your name"
                            value={formData.creatorName}
                            onChange={(e) =>
                                setFormData({ ...formData, creatorName: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Their Name 💗
                        </label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Your special someone's name"
                            value={formData.partnerName}
                            onChange={(e) =>
                                setFormData({ ...formData, partnerName: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Custom Message (Optional)
                        </label>
                        <textarea
                            className="input-field min-h-[100px] resize-none"
                            placeholder="Add a sweet message..."
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="spinner w-5 h-5" />
                                Creating...
                            </>
                        ) : (
                            <>
                                💌 Create Proposal Link
                            </>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
