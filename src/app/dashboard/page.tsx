"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Response {
    id: string;
    timeToYes: number | null;
    noAttempts: number;
    image: string | null;
    respondedAt: string | null;
    createdAt: string;
}

interface Proposal {
    id: string;
    slug: string;
    creatorName: string;
    partnerName: string;
    message: string | null;
    createdAt: string;
    responses: Response[];
    totalViews: number;
    uniqueVisitors: number;
}

interface EditModalProps {
    proposal: Proposal;
    onClose: () => void;
    onSave: (id: string, data: { creatorName: string; partnerName: string; message: string }) => void;
}

function EditModal({ proposal, onClose, onSave }: EditModalProps) {
    const [creatorName, setCreatorName] = useState(proposal.creatorName);
    const [partnerName, setPartnerName] = useState(proposal.partnerName);
    const [message, setMessage] = useState(proposal.message || "");

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 gradient-text">Edit Proposal ✏️</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                        <input
                            type="text"
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Partner&apos;s Name</label>
                        <input
                            type="text"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Message (optional)</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-500 focus:outline-none resize-none"
                            rows={3}
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 btn-secondary py-2">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(proposal.id, { creatorName, partnerName, message })}
                        className="flex-1 btn-primary py-2"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<string | null>(null);
    const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [expandedResponses, setExpandedResponses] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchProposals();
        }
    }, [session]);

    const fetchProposals = async () => {
        try {
            const res = await fetch("/api/proposals");
            if (res.ok) {
                const data = await res.json();
                setProposals(data);
            }
        } catch (error) {
            console.error("Error fetching proposals:", error);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = (slug: string) => {
        const link = `${window.location.origin}/v/${slug}`;
        navigator.clipboard.writeText(link);
        setCopied(slug);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleEdit = async (id: string, data: { creatorName: string; partnerName: string; message: string }) => {
        try {
            const res = await fetch("/api/proposals", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...data }),
            });
            if (res.ok) {
                fetchProposals();
                setEditingProposal(null);
            }
        } catch (error) {
            console.error("Error updating proposal:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/proposals?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchProposals();
                setDeletingId(null);
            }
        } catch (error) {
            console.error("Error deleting proposal:", error);
        }
    };

    const formatTime = (ms: number | null) => {
        if (!ms) return "N/A";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes === 0) return `${seconds}s`;
        return `${minutes}m ${seconds}s`;
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `${dateStr} ${timeStr}`;
    };

    if (status === "loading" || loading) {
        return (
            <main className="min-h-screen flex items-center justify-center relative z-10">
                <div className="spinner" />
            </main>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <main className="min-h-screen p-8 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {session.user?.name} 💕</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/create" className="btn-primary">
                            + Create New
                        </Link>
                        <button onClick={() => signOut()} className="btn-secondary text-sm py-2 px-4">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Proposals List */}
                {proposals.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-6xl mb-4">💌</div>
                        <h2 className="text-2xl font-semibold mb-2">No proposals yet</h2>
                        <p className="text-gray-400 mb-6">
                            Create your first Valentine proposal link!
                        </p>
                        <Link href="/dashboard/create" className="btn-primary">
                            Create Your First Proposal
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {proposals.map((proposal) => (
                            <div key={proposal.id} className="glass-card p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">
                                            To: {proposal.partnerName} 💕
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-2">
                                            From: {proposal.creatorName}
                                        </p>
                                        {proposal.message && (
                                            <p className="text-gray-300 text-sm italic mb-3">
                                                &ldquo;{proposal.message}&rdquo;
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm flex-wrap">
                                            <span className="text-gray-500">
                                                Created: {new Date(proposal.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-purple-400">
                                                👁️ {proposal.totalViews} view{proposal.totalViews !== 1 ? 's' : ''} ({proposal.uniqueVisitors} unique)
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className={proposal.responses.length > 0 ? "text-green-400" : "text-yellow-400"}>
                                                {proposal.responses.length > 0
                                                    ? `✓ ${proposal.responses.length} Response${proposal.responses.length > 1 ? 's' : ''}`
                                                    : "⏳ Waiting"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={() => copyLink(proposal.slug)}
                                            className={`text-sm px-4 py-2 rounded-full transition-all ${copied === proposal.slug
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                                }`}
                                        >
                                            {copied === proposal.slug ? "✓ Copied!" : "📋 Copy Link"}
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingProposal(proposal)}
                                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <span className="text-gray-600">|</span>
                                            <button
                                                onClick={() => setDeletingId(proposal.id)}
                                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                🗑️ Delete
                                            </button>
                                            <span className="text-gray-600">|</span>
                                            <Link
                                                href={`/v/${proposal.slug}`}
                                                target="_blank"
                                                className="text-sm text-gray-400 hover:text-white transition-colors"
                                            >
                                                Preview →
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* View Stats - Always show when there are views */}
                                {proposal.totalViews > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-3">
                                            👁️ View Statistics
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-purple-400">
                                                    {proposal.totalViews}
                                                </div>
                                                <div className="text-xs text-gray-400">Total Views</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-cyan-400">
                                                    {proposal.uniqueVisitors}
                                                </div>
                                                <div className="text-xs text-gray-400">Unique Visitors</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Response Analytics */}
                                {proposal.responses.length > 0 && (
                                    <div className={`mt-4 pt-4 border-t border-white/10 ${proposal.totalViews > 0 ? '' : ''}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-gray-400">
                                                💕 Response Analytics ({proposal.responses.length} total)
                                            </h4>
                                            {proposal.responses.length > 1 && (
                                                <button
                                                    onClick={() => setExpandedResponses(
                                                        expandedResponses === proposal.id ? null : proposal.id
                                                    )}
                                                    className="text-xs text-pink-400 hover:text-pink-300"
                                                >
                                                    {expandedResponses === proposal.id ? "Show Less" : "Show All Responses"}
                                                </button>
                                            )}
                                        </div>

                                        {/* Show latest or all responses */}
                                        {(expandedResponses === proposal.id ? proposal.responses : [proposal.responses[0]]).map((response, idx) => (
                                            <div key={response.id} className={`${idx > 0 ? 'mt-3 pt-3 border-t border-white/5' : ''}`}>
                                                {/* Response Image */}
                                                {response.image && (
                                                    <div className="mb-4">
                                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5 max-w-md mx-auto">
                                                            <Image
                                                                src={response.image}
                                                                alt="Valentine moment"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500 text-center mt-2">📸 Shared moment</p>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                                        <div className="text-2xl font-bold text-green-400">
                                                            {formatTime(response.timeToYes)}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Time to YES</div>
                                                    </div>
                                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                                        <div className="text-2xl font-bold text-red-400">
                                                            {response.noAttempts || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-400">NO Attempts</div>
                                                    </div>
                                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                                        <div className="text-lg font-bold text-blue-400">
                                                            {formatDateTime(response.respondedAt)}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Responded On</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingProposal && (
                <EditModal
                    proposal={editingProposal}
                    onClose={() => setEditingProposal(null)}
                    onSave={handleEdit}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 max-w-sm w-full text-center">
                        <div className="text-4xl mb-4">💔</div>
                        <h2 className="text-xl font-bold mb-2">Delete Proposal?</h2>
                        <p className="text-gray-400 mb-6">
                            This will permanently delete this proposal and all its responses.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="flex-1 btn-secondary py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deletingId)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
