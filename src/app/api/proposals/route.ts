import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

// Function to generate unique slug
function generateSlug(): string {
    return nanoid(8);
}

// GET - Get all proposals for logged-in user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const proposals = await prisma.proposal.findMany({
            where: { userId: session.user.id },
            include: {
                responses: {
                    where: { answered: true },
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        timeToYes: true,
                        noAttempts: true,
                        image: true,
                        respondedAt: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: { views: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Get unique visitor counts for each proposal
        const proposalsWithViews = await Promise.all(
            proposals.map(async (proposal) => {
                const uniqueVisitors = await prisma.view.groupBy({
                    by: ["ipHash"],
                    where: { proposalId: proposal.id },
                });

                return {
                    ...proposal,
                    totalViews: proposal._count.views,
                    uniqueVisitors: uniqueVisitors.length,
                };
            })
        );

        return NextResponse.json(proposalsWithViews);
    } catch (error) {
        console.error("Error fetching proposals:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Create new proposal
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { creatorName, partnerName, message, image } = body;

        if (!creatorName || !partnerName) {
            return NextResponse.json(
                { error: "Creator name and partner name are required" },
                { status: 400 }
            );
        }

        // Check image size if provided (limit to ~5MB base64)
        if (image && image.length > 7000000) {
            return NextResponse.json({ error: "Image too large. Maximum size is 5MB." }, { status: 400 });
        }

        const slug = generateSlug();

        const proposal = await prisma.proposal.create({
            data: {
                slug,
                creatorName,
                partnerName,
                message: message || null,
                image: image || null,
                userId: session.user.id,
            },
        });

        return NextResponse.json(proposal, { status: 201 });
    } catch (error) {
        console.error("Error creating proposal:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update a proposal
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, creatorName, partnerName, message } = body;

        if (!id) {
            return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 });
        }

        // Verify ownership
        const existing = await prisma.proposal.findUnique({
            where: { id },
        });

        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        const proposal = await prisma.proposal.update({
            where: { id },
            data: {
                creatorName: creatorName || existing.creatorName,
                partnerName: partnerName || existing.partnerName,
                message: message !== undefined ? message : existing.message,
            },
        });

        return NextResponse.json(proposal);
    } catch (error) {
        console.error("Error updating proposal:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Delete a proposal
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 });
        }

        // Verify ownership
        const existing = await prisma.proposal.findUnique({
            where: { id },
        });

        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        // Delete related responses first
        await prisma.response.deleteMany({
            where: { proposalId: id },
        });

        await prisma.proposal.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting proposal:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
