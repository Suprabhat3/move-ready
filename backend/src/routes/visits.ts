import express, { Response } from "express";
import { VisitStatus, VisitDecision, Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  type AuthedRequest,
  requireTenant,
  requireAgentOrAdmin,
} from "../lib/session";

const router = express.Router();

function parseDateInput(value: unknown, fieldName: string) {
  if (!value || typeof value !== "string") {
    throw new Error(`${fieldName} is required`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return parsed;
}

/**
 * POST /api/visits
 * Request a visit for a listing (Tenant)
 */
router.post("/", requireTenant, async (req: AuthedRequest, res: Response) => {
  try {
    const { listingId, proposedAt, notes } = req.body;

    if (!listingId || !proposedAt) {
      return res.status(400).json({ message: "listingId and proposedAt are required" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Listing not found or not available" });
    }

    const proposedAtDate = parseDateInput(proposedAt, "proposedAt");

    const visit = await prisma.visit.create({
      data: {
        listingId,
        tenantId: req.user!.id,
        proposedAt: proposedAtDate,
        notes: notes || null,
        status: VisitStatus.REQUESTED,
      },
      include: {
        listing: {
          select: { title: true, address: true, city: true },
        },
      },
    });

    res.status(201).json(visit);
  } catch (error) {
    console.error("Create visit error:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET /api/visits/me
 * Get all visits for the current tenant
 */
router.get("/me", requireTenant, async (req: AuthedRequest, res: Response) => {
  try {
    const visits = await prisma.visit.findMany({
      where: { tenantId: req.user!.id },
      include: {
        listing: {
          select: { title: true, address: true, city: true, images: { take: 1 } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(visits);
  } catch (error) {
    console.error("Fetch my visits error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/visits/:id/decision
 * Set decision for a visit (Tenant)
 */
router.patch("/:id/decision", requireTenant, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { decision } = req.body;

    if (!Object.values(VisitDecision).includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const visit = await prisma.visit.findUnique({
      where: { id },
    });

    if (!visit || visit.tenantId !== req.user!.id) {
      return res.status(404).json({ message: "Visit not found" });
    }

    const canSetDecision = 
      visit.status === VisitStatus.VISITED || 
      (visit.status === VisitStatus.DECISION && visit.decision === VisitDecision.INTERESTED);

    if (!canSetDecision) {
      return res.status(400).json({ message: "Cannot change decision at this stage" });
    }

    const updated = await prisma.visit.update({
      where: { id },
      data: {
        decision: decision as VisitDecision,
        status: VisitStatus.DECISION,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update visit decision error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/visits/:id/cancel
 * Cancel a visit (Tenant)
 */
router.patch("/:id/cancel", requireTenant, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const visit = await prisma.visit.findUnique({
      where: { id },
    });

    if (!visit || visit.tenantId !== req.user!.id) {
      return res.status(404).json({ message: "Visit not found" });
    }

    if (visit.status === VisitStatus.VISITED || visit.status === VisitStatus.CANCELLED) {
      return res.status(400).json({ message: "Cannot cancel visit in current state" });
    }

    const updated = await prisma.visit.update({
      where: { id },
      data: { status: VisitStatus.CANCELLED },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Cancel visit error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET /api/admin/visits
 * Get all visits (Admin/Agent)
 */
router.get("/admin", requireAgentOrAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const statusQuery = req.query.status;
    const status =
      typeof statusQuery === "string" && statusQuery
        ? (statusQuery as VisitStatus)
        : null;

    if (status && !Object.values(VisitStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const where = {
      ...(status ? { status } : {}),
      ...(req.user?.role === Role.SITE_AGENT 
        ? { listing: { createdById: req.user.id } } 
        : {}),
    };

    const visits = await prisma.visit.findMany({
      where,
      include: {
        tenant: { select: { name: true, email: true } },
        listing: { select: { title: true, city: true } },
      },
      orderBy: { proposedAt: "asc" },
    });

    res.status(200).json(visits);
  } catch (error) {
    console.error("Fetch admin visits error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/admin/visits/:id/schedule
 * Schedule a visit (Admin/Agent)
 */
router.patch("/:id/schedule", requireAgentOrAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { scheduledAt } = req.body;

    if (!scheduledAt) {
      return res.status(400).json({ message: "scheduledAt is required" });
    }

    const scheduledAtDate = parseDateInput(scheduledAt, "scheduledAt");

    const visit = await prisma.visit.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    // Check permissions for agents
    if (req.user?.role === Role.SITE_AGENT && (visit as any).listing.createdById !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.visit.update({
      where: { id },
      data: {
        scheduledAt: scheduledAtDate,
        status: VisitStatus.SCHEDULED,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Schedule visit error:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/admin/visits/:id/confirm
 * Mark visit as completed (Admin/Agent)
 */
router.patch("/:id/confirm", requireAgentOrAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const visit = await prisma.visit.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    // Check permissions for agents
    if (req.user?.role === Role.SITE_AGENT && (visit as any).listing.createdById !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.visit.update({
      where: { id },
      data: {
        visitedAt: new Date(),
        status: VisitStatus.VISITED,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Confirm visit error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
