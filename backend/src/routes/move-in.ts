import express, { Response } from "express";
import { MoveInStatus, ChecklistType, ExtensionStatus, Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  type AuthedRequest,
  requireAuth,
  requireTenant,
  requireAgentOrAdmin,
  requireAdmin,
} from "../lib/session";

const router = express.Router();

/**
 * POST /api/move-in
 * Create a new move-in record (Admin)
 */
router.post("/", requireAgentOrAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const { tenantId, listingId, moveInDate } = req.body;

    if (!tenantId || !listingId || !moveInDate) {
      return res.status(400).json({ message: "tenantId, listingId, and moveInDate are required" });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Agents can only create move-ins for their own listings
    if (req.user?.role === Role.SITE_AGENT && listing.createdById !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const moveIn = await prisma.moveIn.create({
      data: {
        tenantId,
        listingId,
        moveInDate: new Date(moveInDate),
        status: MoveInStatus.IN_PROGRESS,
        checklist: {
          create: [
            { type: ChecklistType.DOCUMENT_UPLOAD, label: "Identity Proof (Aadhar/Passport)" },
            { type: ChecklistType.AGREEMENT_CONFIRMATION, label: "Sign Rental Agreement" },
            { type: ChecklistType.PAYMENT, label: "Security Deposit Payment" },
            { type: ChecklistType.INVENTORY_REVIEW, label: "Review Property Inventory" },
          ],
        },
      },
      include: {
        checklist: true,
      },
    });

    res.status(201).json(moveIn);
  } catch (error) {
    console.error("Create move-in error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET /api/move-in/admin
 * Get all move-ins (Admin/Agent)
 */
router.get("/admin", requireAgentOrAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const where = {
      ...(req.user?.role === Role.SITE_AGENT 
        ? { listing: { createdById: req.user.id } } 
        : {}),
    };

    const moveIns = await prisma.moveIn.findMany({
      where,
      include: {
        tenant: { select: { name: true, email: true } },
        listing: { select: { title: true, address: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(moveIns);
  } catch (error) {
    console.error("Fetch admin move-ins error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET /api/move-in/me
 * Get active move-in for current tenant
 */
router.get("/me", requireTenant, async (req: AuthedRequest, res: Response) => {
  try {
    const moveIn = await prisma.moveIn.findFirst({
      where: { 
        tenantId: req.user!.id,
        status: MoveInStatus.IN_PROGRESS,
      },
      include: {
        listing: {
          select: { title: true, address: true, city: true, images: { take: 1 } },
        },
        checklist: true,
        inventory: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!moveIn) {
      return res.status(404).json({ message: "No active move-in found" });
    }

    res.status(200).json(moveIn);
  } catch (error) {
    console.error("Fetch my move-in error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/move-in/:id/checklist/:itemId
 * Update checklist item (Tenant)
 */
router.patch("/:id/checklist/:itemId", requireTenant, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const itemId = req.params.itemId as string;
    const { completed, fileUrl } = req.body;

    const moveIn = await prisma.moveIn.findUnique({
      where: { id },
    });

    if (!moveIn || moveIn.tenantId !== req.user!.id) {
      return res.status(404).json({ message: "Move-in record not found" });
    }

    const updated = await prisma.moveInChecklistItem.update({
      where: { id: itemId, moveInId: id },
      data: {
        completed: !!completed,
        fileUrl: fileUrl || null,
        completedAt: completed ? new Date() : null,
      },
    });

    // Check if all items are completed to auto-complete the move-in
    const allItems = await prisma.moveInChecklistItem.findMany({
      where: { moveInId: id },
    });

    if (allItems.every(item => item.completed)) {
      await prisma.moveIn.update({
        where: { id },
        data: { status: MoveInStatus.COMPLETED },
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update checklist item error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET /api/move-in/:id/inventory
 * Get inventory items
 */
router.get("/:id/inventory", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const moveIn = await prisma.moveIn.findUnique({
      where: { id },
      include: {
        listing: {
          select: { createdById: true },
        },
      },
    });

    if (!moveIn) {
      return res.status(404).json({ message: "Move-in not found" });
    }

    const isTenant = moveIn.tenantId === req.user!.id;
    const isAdmin = req.user?.role === Role.ADMIN;
    const isAgentForListing =
      req.user?.role === Role.SITE_AGENT &&
      moveIn.listing.createdById === req.user.id;

    if (!isTenant && !isAdmin && !isAgentForListing) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const inventory = await prisma.inventoryItem.findMany({
      where: { moveInId: id },
    });
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Fetch inventory error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * POST /api/move-in/:id/inventory
 * Add inventory item (Admin/Agent)
 */
router.post("/:id/inventory", requireAgentOrAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, condition, quantity, notes } = req.body;

    if (!name) return res.status(400).json({ message: "Item name is required" });

    const moveIn = await prisma.moveIn.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!moveIn) return res.status(404).json({ message: "Move-in not found" });
    // Check permissions for agents
    if (req.user?.role === Role.SITE_AGENT && (moveIn as any).listing.createdById !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        moveInId: id,
        name,
        condition: condition || "Good",
        quantity: quantity || 1,
        notes: notes || null,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add inventory item error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * POST /api/move-in/:id/extension
 * Request stay extension (Tenant)
 */
router.post("/:id/extension", requireTenant, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { requestedTill, reason } = req.body;

    if (!requestedTill || !reason) {
      return res.status(400).json({ message: "requestedTill and reason are required" });
    }

    const moveIn = await prisma.moveIn.findUnique({ where: { id } });
    if (!moveIn || moveIn.tenantId !== req.user!.id) {
      return res.status(404).json({ message: "Move-in record not found" });
    }

    const extension = await prisma.extensionRequest.create({
      data: {
        moveInId: id,
        tenantId: req.user!.id,
        requestedTill: new Date(requestedTill),
        reason,
        status: ExtensionStatus.PENDING,
      },
    });

    res.status(201).json(extension);
  } catch (error) {
    console.error("Create extension request error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * PATCH /api/admin/extension/:id
 * Approve or reject extension (Admin)
 */
router.patch("/admin/extension/:id", requireAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (![ExtensionStatus.APPROVED, ExtensionStatus.REJECTED].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const extension = await prisma.extensionRequest.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(extension);
  } catch (error) {
    console.error("Update extension status error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
