import express from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  type AuthedRequest,
  requireAgentOrAdmin,
  requireAuth,
  requireTenant,
  requireAdmin,
} from "../lib/session";

const router = express.Router();

/**
 * GET /api/tickets/agent
 * Fetch tickets. For now, we'll fetch all OPEN/IN_PROGRESS tickets, or those related
 * specifically to properties managed by this agent if the relationship existed.
 * Since SupportTicket doesn't currently strictly tie to a Listing in the schema, 
 * we will fetch all open and in-progress tickets for the agent's dash.
 */
router.get("/agent", requireAgentOrAdmin, async (req: AuthedRequest, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where:
        req.user?.role === Role.ADMIN
          ? undefined
          : {
              listing: {
                createdById: req.user!.id,
              },
            },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        tenant: {
          select: { name: true, email: true, image: true },
        },
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { name: true, role: true, image: true },
            },
          },
        },
      },
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Fetch Tickets Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * POST /api/tickets
 * Create a new support ticket (Tenant initiating contact about a property).
 */
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { subject, message, listingId } = req.body;
    const user = req.user!;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res
        .status(400)
        .json({ message: "Subject and message are required" });
    }

    if (user.role !== Role.TENANT) {
      return res
        .status(403)
        .json({ message: "Only tenants can create listing inquiries" });
    }

    if (typeof listingId !== "string" || !listingId.trim()) {
      return res.status(400).json({ message: "listingId is required" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Listing not found" });
    }

    const newTicket = await prisma.supportTicket.create({
      data: {
        tenantId: user.id,
        listingId,
        subject: subject.trim(),
        messages: {
          create: {
            authorId: user.id,
            content: message.trim(),
          },
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
        messages: true,
      },
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Create Ticket Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET /api/tickets/me
 * Fetch all tickets for the current tenant.
 */
router.get("/me", requireTenant, async (req: AuthedRequest, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { tenantId: req.user!.id },
      include: {
        listing: {
          select: { id: true, title: true },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { name: true, role: true, image: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Fetch tenant tickets error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/admin/tickets/:id/status
 * Update ticket status (Admin/Agent)
 */
router.patch("/:id/status", requireAgentOrAdmin, async (req: AuthedRequest, res) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update ticket status error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * POST /api/tickets/:ticketId/reply
 * Reply to a specific ticket.
 */
router.post("/:ticketId/reply", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const ticketId = req.params.ticketId as string;
    const { content, fileUrl } = req.body;
    const user = req.user!;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        listing: { select: { createdById: true } },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check permissions: Admin, Agent (if listing belongs to them), or the Tenant who created the ticket
    const isTenant = ticket.tenantId === user.id;
    const isAdmin = user.role === Role.ADMIN;
    const isAgent = user.role === Role.SITE_AGENT && ticket.listing?.createdById === user.id;

    if (!isTenant && !isAdmin && !isAgent) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId,
        authorId: user.id,
        content,
        fileUrl: fileUrl || null,
      },
      include: {
        author: {
          select: { name: true, role: true, image: true },
        },
      },
    });

    // If tenant replies, status becomes OPEN (needs attention)
    // If agent/admin replies, status becomes IN_PROGRESS
    const nextStatus = isTenant ? "OPEN" : "IN_PROGRESS";
    if (ticket.status !== nextStatus && ticket.status !== "RESOLVED" && ticket.status !== "CLOSED") {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: nextStatus },
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Reply to Ticket Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
