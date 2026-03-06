import express from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";
import { Role } from "@prisma/client";

const router = express.Router();

// Middleware to get current user from session
const requireAgentOrAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (session.user.role !== Role.SITE_AGENT && session.user.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Forbidden: Requires Site Agent or Admin role" });
    }

    (req as any).user = session.user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET /api/tickets/agent
 * Fetch tickets. For now, we'll fetch all OPEN/IN_PROGRESS tickets, or those related
 * specifically to properties managed by this agent if the relationship existed.
 * Since SupportTicket doesn't currently strictly tie to a Listing in the schema, 
 * we will fetch all open and in-progress tickets for the agent's dash.
 */
router.get("/agent", requireAgentOrAdmin, async (req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        tenant: {
          select: { name: true, email: true, image: true }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { name: true, role: true, image: true }
            }
          }
        }
      }
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
router.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { subject, message, listingId } = req.body;
    const user = session.user;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    // Create the ticket linking to the listing, and the first message
    const newTicket = await prisma.supportTicket.create({
      data: {
        tenantId: user.id,
        listingId: listingId || null,
        subject,
        messages: {
          create: {
            authorId: user.id,
            content: message
          }
        }
      },
      include: {
        messages: true
      }
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Create Ticket Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * POST /api/tickets
 * Create a new support ticket (Tenant initiating contact about a property).
 */
router.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { subject, message, listingId } = req.body;
    const user = session.user;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    // Create the ticket linking to the listing, and the first message
    const newTicket = await prisma.supportTicket.create({
      data: {
        tenantId: user.id,
        listingId: listingId || null,
        subject,
        messages: {
          create: {
            authorId: user.id,
            content: message
          }
        }
      },
      include: {
        messages: true
      }
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Create Ticket Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * POST /api/tickets
 * Create a new support ticket (Tenant initiating contact about a property).
 */
router.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { subject, message, listingId } = req.body;
    const user = session.user;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    // Create the ticket linking to the listing, and the first message
    const newTicket = await prisma.supportTicket.create({
      data: {
        tenantId: user.id,
        listingId: listingId || null,
        subject,
        messages: {
          create: {
            authorId: user.id,
            content: message
          }
        }
      },
      include: {
        messages: true
      }
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Create Ticket Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * POST /api/tickets/:ticketId/reply
 * Reply to a specific ticket.
 */
router.post("/:ticketId/reply", requireAgentOrAdmin, async (req, res) => {
  try {
    const ticketId = req.params.ticketId as string;
    const { content, fileUrl } = req.body;
    const user = (req as any).user;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId,
        authorId: user.id,
        content,
        fileUrl: fileUrl || null
      },
      include: {
        author: {
          select: { name: true, role: true, image: true }
        }
      }
    });

    // Optionally update the ticket status to IN_PROGRESS if it was OPEN
    if (ticket.status === 'OPEN') {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'IN_PROGRESS' }
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Reply to Ticket Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
