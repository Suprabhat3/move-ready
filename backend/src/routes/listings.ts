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

    // Attach user to request for downstream handlers
    (req as any).user = session.user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * POST /api/listings
 * Create a new property listing.
 */
router.post("/", requireAgentOrAdmin, async (req, res) => {
  try {
    const { title, description, address, city, state, pincode, rentAmount, deposit, bedrooms, bathrooms, area, furnished, availableFrom, amenities, rules, images } = req.body;
    const user = (req as any).user;

    // Basic validation
    if (!title || !description || !address || !rentAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        address,
        city: city || "",
        state: state || "",
        pincode: pincode || "",
        rentAmount: parseInt(rentAmount, 10),
        deposit: parseInt(deposit, 10) || 0,
        bedrooms: parseInt(bedrooms, 10) || 1,
        bathrooms: parseInt(bathrooms, 10) || 1,
        area: parseFloat(area) || 0,
        furnished: furnished || "UNFURNISHED",
        availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
        amenities: amenities || [],
        rules: rules || [],
        status: "PUBLISHED", // Auto-publish for now, or could be DRAFT
        reviewedById: user.id
      }
    });

    // If images (ImageKit URLs) were provided, map them to ListingImage
    if (images && Array.isArray(images) && images.length > 0) {
      const imagePayloads = images.map((url: string, index: number) => ({
        listingId: newListing.id,
        url,
        order: index
      }));

      await prisma.listingImage.createMany({
        data: imagePayloads
      });
    }

    res.status(201).json({ message: "Listing created successfully", listing: newListing });
  } catch (error) {
    console.error("Create Listing Error:", error);
    res.status(500).json({ message: "Internal Server Error while creating listing" });
  }
});

/**
 * GET /api/listings/my-listings
 * Fetch listings created/managed by the logged in agent.
 */
router.get("/my-listings", requireAgentOrAdmin, async (req, res) => {
  try {
    const user = (req as any).user;

    const listings = await prisma.listing.findMany({
      where: {
        reviewedById: user.id
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(listings);
  } catch (error) {
    console.error("Fetch My Listings Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
