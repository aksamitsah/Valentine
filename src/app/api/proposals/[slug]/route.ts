import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// Helper to hash IP for privacy
function hashIP(ip: string): string {
    return crypto.createHash("sha256").update(ip + "valentine-salt").digest("hex").substring(0, 16);
}

// GET - Get proposal by slug (public, no auth required)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const proposal = await prisma.proposal.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                creatorName: true,
                partnerName: true,
                message: true,
                image: true,
                createdAt: true,
            },
        });

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        // Record the view (async, don't wait for it)
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                   request.headers.get("x-real-ip") || 
                   "unknown";
        const userAgent = request.headers.get("user-agent") || undefined;
        const ipHash = hashIP(ip);

        // Record view in background
        prisma.view.create({
            data: {
                proposalId: proposal.id,
                ipHash,
                userAgent,
            },
        }).catch((err) => {
            console.error("Failed to record view:", err);
        });

        return NextResponse.json(proposal);
    } catch (error) {
        console.error("Error fetching proposal:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
