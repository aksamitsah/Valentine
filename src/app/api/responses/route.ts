import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get response by ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Response ID is required" }, { status: 400 });
        }

        const response = await prisma.response.findUnique({
            where: { id },
            include: {
                proposal: {
                    select: {
                        creatorName: true,
                        partnerName: true,
                    },
                },
            },
        });

        if (!response) {
            return NextResponse.json({ error: "Response not found" }, { status: 404 });
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching response:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Record response analytics
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { proposalId, timeToYes, noAttempts } = body;

        if (!proposalId) {
            return NextResponse.json(
                { error: "Proposal ID is required" },
                { status: 400 }
            );
        }

        // Verify proposal exists
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
        });

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        // Create response record
        const response = await prisma.response.create({
            data: {
                proposalId,
                answered: true,
                timeToYes: timeToYes || 0,
                noAttempts: noAttempts || 0,
                respondedAt: new Date(),
            },
        });

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error recording response:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update response with image
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, image } = body;

        if (!id) {
            return NextResponse.json({ error: "Response ID is required" }, { status: 400 });
        }

        // Verify response exists
        const existing = await prisma.response.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Response not found" }, { status: 404 });
        }

        // Check image size (limit to ~5MB base64)
        if (image && image.length > 7000000) {
            return NextResponse.json({ error: "Image too large. Maximum size is 5MB." }, { status: 400 });
        }

        // Update response with image
        const response = await prisma.response.update({
            where: { id },
            data: { image },
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating response:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
