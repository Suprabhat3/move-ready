import express, { type Response } from "express";
import {
  type AvailableForType,
  FacingType,
  FurnishedType,
  ListingStatus,
  ListedByType,
  ParkingType,
  PetPolicyType,
  PowerBackupType,
  PreferredTenantType,
  PropertyType,
  Role,
  WaterSupplyType,
} from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  type AuthedRequest,
  getSessionUser,
  requireAgentOrAdmin,
  requireTenant,
} from "../lib/session";

const router = express.Router();

const listingSummaryInclude = {
  images: {
    orderBy: {
      order: "asc" as const,
    },
  },
};

const listingDetailInclude = {
  ...listingSummaryInclude,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  },
};

const stringFields = [
  "title",
  "description",
  "address",
  "city",
  "state",
  "pincode",
] as const;

const propertyTypes = Object.values(PropertyType);
const preferredTenantTypes = Object.values(PreferredTenantType);
const furnishedTypes = Object.values(FurnishedType);
const parkingTypes = Object.values(ParkingType);
const facingTypes = Object.values(FacingType);
const listedByTypes = Object.values(ListedByType);
const availableForTypes = ["RENT", "LEASE"] as const;
const petPolicyTypes = Object.values(PetPolicyType);
const waterSupplyTypes = Object.values(WaterSupplyType);
const powerBackupTypes = Object.values(PowerBackupType);
const listingStatuses = Object.values(ListingStatus);

type ListingImageInput = {
  url: string;
  caption?: string | null;
};

type ListingPayload = {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rentAmount: number;
  deposit: number;
  maintenanceAmount: number;
  brokerageAmount: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  floorNumber: number | null;
  totalFloors: number | null;
  area: number;
  ageOfProperty: number | null;
  furnished: FurnishedType;
  propertyType: PropertyType;
  preferredTenantType: PreferredTenantType;
  parking: ParkingType;
  facing: FacingType | null;
  listedBy: ListedByType;
  availableFor: AvailableForType;
  leaseDurationMonths: number | null;
  noticePeriodDays: number | null;
  petPolicy: PetPolicyType;
  waterSupply: WaterSupplyType | null;
  powerBackup: PowerBackupType;
  availableFrom: Date;
  videoTourUrl: string | null;
  amenities: string[];
  rules: string[];
  nearbyLandmarks: string[];
  images: ListingImageInput[];
};

function parsePositiveNumber(
  value: unknown,
  fieldName: string,
  options?: { integer?: boolean; min?: number; allowNull?: boolean },
) {
  if (value === undefined || value === null || value === "") {
    if (options?.allowNull) {
      return null;
    }

    throw new Error(`${fieldName} is required`);
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (options?.integer && !Number.isInteger(parsed)) {
    throw new Error(`${fieldName} must be an integer`);
  }

  if (options?.min !== undefined && parsed < options.min) {
    throw new Error(`${fieldName} must be at least ${options.min}`);
  }

  return parsed;
}

function parseRequiredNumber(
  value: unknown,
  fieldName: string,
  options?: { integer?: boolean; min?: number },
) {
  const parsed = parsePositiveNumber(value, fieldName, options);
  if (parsed === null) {
    throw new Error(`${fieldName} is required`);
  }
  return parsed;
}

function parseEnumValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fieldName: string,
  options?: { allowNull?: boolean },
): T | null {
  if (value === undefined || value === null || value === "") {
    if (options?.allowNull) {
      return null;
    }

    throw new Error(`${fieldName} is required`);
  }

  if (typeof value !== "string" || !allowedValues.includes(value as T)) {
    throw new Error(`${fieldName} is invalid`);
  }

  return value as T;
}

function parseStringArray(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") {
    return [] as string[];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function parseImages(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return [] as ListingImageInput[];
  }

  if (!Array.isArray(value)) {
    throw new Error("images must be an array");
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { url: item.trim(), caption: null };
      }

      if (
        item &&
        typeof item === "object" &&
        "url" in item &&
        typeof item.url === "string"
      ) {
        return {
          url: item.url.trim(),
          caption:
            typeof item.caption === "string" && item.caption.trim()
              ? item.caption.trim()
              : null,
        };
      }

      throw new Error("images must contain valid URLs");
    })
    .filter((image) => image.url);
}

function parseDateValue(value: unknown, fieldName: string) {
  if (!value || typeof value !== "string") {
    throw new Error(`${fieldName} is required`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return parsed;
}

function parseOptionalUrl(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`${fieldName} must be a valid URL`);
  }
}

function validateListingPayload(body: unknown): ListingPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Listing payload is required");
  }

  const payload = body as Record<string, unknown>;
  const normalizedStrings = Object.fromEntries(
    stringFields.map((field) => {
      const value = payload[field];
      if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${field} is required`);
      }

      return [field, value.trim()];
    }),
  ) as Record<(typeof stringFields)[number], string>;

  const floorNumber = parsePositiveNumber(payload.floorNumber, "floorNumber", {
    integer: true,
    min: 0,
    allowNull: true,
  });
  const totalFloors = parsePositiveNumber(payload.totalFloors, "totalFloors", {
    integer: true,
    min: 0,
    allowNull: true,
  });

  if (
    floorNumber !== null &&
    totalFloors !== null &&
    floorNumber > totalFloors
  ) {
    throw new Error("floorNumber cannot exceed totalFloors");
  }

  return {
    ...normalizedStrings,
    rentAmount: parseRequiredNumber(payload.rentAmount, "rentAmount", {
      integer: true,
      min: 0,
    }),
    deposit: parseRequiredNumber(payload.deposit, "deposit", {
      integer: true,
      min: 0,
    }),
    maintenanceAmount: parseRequiredNumber(
      payload.maintenanceAmount ?? 0,
      "maintenanceAmount",
      {
        integer: true,
        min: 0,
      },
    ),
    brokerageAmount: parseRequiredNumber(
      payload.brokerageAmount ?? 0,
      "brokerageAmount",
      {
        integer: true,
        min: 0,
      },
    ),
    bedrooms: parseRequiredNumber(payload.bedrooms, "bedrooms", {
      integer: true,
      min: 0,
    }),
    bathrooms: parseRequiredNumber(payload.bathrooms, "bathrooms", {
      integer: true,
      min: 0,
    }),
    balconies: parseRequiredNumber(payload.balconies ?? 0, "balconies", {
      integer: true,
      min: 0,
    }),
    floorNumber,
    totalFloors,
    area: parseRequiredNumber(payload.area, "area", {
      min: 1,
    }),
    ageOfProperty: parsePositiveNumber(payload.ageOfProperty, "ageOfProperty", {
      integer: true,
      min: 0,
      allowNull: true,
    }),
    furnished: parseEnumValue(
      payload.furnished,
      furnishedTypes,
      "furnished",
    ) as FurnishedType,
    propertyType: parseEnumValue(
      payload.propertyType,
      propertyTypes,
      "propertyType",
    ) as PropertyType,
    preferredTenantType: parseEnumValue(
      payload.preferredTenantType,
      preferredTenantTypes,
      "preferredTenantType",
    ) as PreferredTenantType,
    parking: parseEnumValue(payload.parking, parkingTypes, "parking") as ParkingType,
    facing: parseEnumValue(payload.facing, facingTypes, "facing", {
      allowNull: true,
    }) as FacingType | null,
    listedBy: parseEnumValue(payload.listedBy, listedByTypes, "listedBy") as ListedByType,
    availableFor: parseEnumValue(
      payload.availableFor,
      availableForTypes,
      "availableFor",
    ) as AvailableForType,
    leaseDurationMonths: parsePositiveNumber(
      payload.leaseDurationMonths,
      "leaseDurationMonths",
      {
        integer: true,
        min: 1,
        allowNull: true,
      },
    ),
    noticePeriodDays: parsePositiveNumber(
      payload.noticePeriodDays,
      "noticePeriodDays",
      {
        integer: true,
        min: 0,
        allowNull: true,
      },
    ),
    petPolicy: parseEnumValue(
      payload.petPolicy,
      petPolicyTypes,
      "petPolicy",
    ) as PetPolicyType,
    waterSupply: parseEnumValue(
      payload.waterSupply,
      waterSupplyTypes,
      "waterSupply",
      { allowNull: true },
    ) as WaterSupplyType | null,
    powerBackup: parseEnumValue(
      payload.powerBackup,
      powerBackupTypes,
      "powerBackup",
    ) as PowerBackupType,
    availableFrom: parseDateValue(payload.availableFrom, "availableFrom"),
    videoTourUrl: parseOptionalUrl(payload.videoTourUrl, "videoTourUrl"),
    amenities: parseStringArray(payload.amenities, "amenities"),
    rules: parseStringArray(payload.rules, "rules"),
    nearbyLandmarks: parseStringArray(payload.nearbyLandmarks, "nearbyLandmarks"),
    images: parseImages(payload.images),
  };
}

function getIdParam(req: AuthedRequest | express.Request) {
  const id = req.params.id;
  if (typeof id !== "string") {
    throw new Error("Invalid listing id");
  }
  return id;
}

function validateListingReadiness(listing: ListingPayload) {
  const requiredFields = [
    listing.title,
    listing.description,
    listing.address,
    listing.city,
    listing.state,
    listing.pincode,
  ];

  if (requiredFields.some((field) => !field.trim())) {
    throw new Error("Listing is missing required content fields");
  }

  if (!listing.images.length) {
    throw new Error("At least one image is required before review or publish");
  }
}

async function ensureListingAccess(
  req: AuthedRequest,
  res: Response,
  listingId: string,
) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: listingDetailInclude,
  });

  if (!listing) {
    res.status(404).json({ message: "Listing not found" });
    return null;
  }

  if (
    req.user?.role !== Role.ADMIN &&
    listing.createdById !== req.user?.id
  ) {
    res.status(403).json({ message: "Forbidden" });
    return null;
  }

  return listing;
}

router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page ?? 1) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize ?? 9) || 9, 1), 30);
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const city = typeof req.query.city === "string" ? req.query.city.trim() : "";
    const sort =
      typeof req.query.sort === "string" ? req.query.sort : "newest";

    const propertyType = parseEnumValue(
      req.query.propertyType,
      propertyTypes,
      "propertyType",
      { allowNull: true },
    );
    const furnished = parseEnumValue(
      req.query.furnished,
      furnishedTypes,
      "furnished",
      { allowNull: true },
    );
    const parking = parseEnumValue(req.query.parking, parkingTypes, "parking", {
      allowNull: true,
    });

    const bedrooms =
      typeof req.query.bedrooms === "string" && req.query.bedrooms
        ? Number(req.query.bedrooms)
        : null;
    const minRent =
      typeof req.query.minRent === "string" && req.query.minRent
        ? Number(req.query.minRent)
        : null;
    const maxRent =
      typeof req.query.maxRent === "string" && req.query.maxRent
        ? Number(req.query.maxRent)
        : null;
    const availableFrom =
      typeof req.query.availableFrom === "string" && req.query.availableFrom
        ? new Date(req.query.availableFrom)
        : null;

    const where = {
      status: ListingStatus.PUBLISHED,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { address: { contains: search, mode: "insensitive" as const } },
              { city: { contains: search, mode: "insensitive" as const } },
              { state: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(city ? { city: { contains: city, mode: "insensitive" as const } } : {}),
      ...(propertyType ? { propertyType } : {}),
      ...(furnished ? { furnished } : {}),
      ...(parking ? { parking } : {}),
      ...(bedrooms !== null && !Number.isNaN(bedrooms) ? { bedrooms } : {}),
      ...(minRent !== null && !Number.isNaN(minRent)
        ? { rentAmount: { gte: minRent } }
        : {}),
      ...(maxRent !== null && !Number.isNaN(maxRent)
        ? {
            rentAmount: {
              ...(minRent !== null && !Number.isNaN(minRent) ? { gte: minRent } : {}),
              lte: maxRent,
            },
          }
        : {}),
      ...(availableFrom && !Number.isNaN(availableFrom.getTime())
        ? { availableFrom: { lte: availableFrom } }
        : {}),
    };

    const orderBy =
      sort === "rent-asc"
        ? { rentAmount: "asc" as const }
        : sort === "rent-desc"
          ? { rentAmount: "desc" as const }
          : sort === "available-soonest"
            ? { availableFrom: "asc" as const }
            : { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: listingSummaryInclude,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.listing.count({ where }),
    ]);

    res.status(200).json({
      items,
      page,
      pageSize,
      total,
      hasMore: page * pageSize < total,
    });
  } catch (error) {
    console.error("Fetch listings error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/compare", async (req, res) => {
  try {
    const idsParam = typeof req.query.ids === "string" ? req.query.ids : "";
    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length < 2 || ids.length > 3) {
      return res
        .status(400)
        .json({ message: "Compare supports between 2 and 3 listings" });
    }

    const items = await prisma.listing.findMany({
      where: {
        id: { in: ids },
        status: ListingStatus.PUBLISHED,
      },
      include: listingDetailInclude,
    });

    if (items.length !== ids.length) {
      return res
        .status(404)
        .json({ message: "One or more listings were not found" });
    }

    res.status(200).json({
      items: ids.map((id) => items.find((item) => item.id === id)),
    });
  } catch (error) {
    console.error("Compare listings error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/my-listings", requireAgentOrAdmin, async (req: AuthedRequest, res) => {
  try {
    const statusFilter = parseEnumValue(
      req.query.status,
      listingStatuses,
      "status",
      { allowNull: true },
    );
    const where =
      req.user?.role === Role.ADMIN
        ? {
            ...(statusFilter ? { status: statusFilter } : {}),
          }
        : {
            createdById: req.user!.id,
            ...(statusFilter ? { status: statusFilter } : {}),
          };

    const items = await prisma.listing.findMany({
      where,
      include: listingSummaryInclude,
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({ items });
  } catch (error) {
    console.error("Fetch my listings error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", requireAgentOrAdmin, async (req: AuthedRequest, res) => {
  try {
    const payload = validateListingPayload(req.body);

    const listing = await prisma.listing.create({
      data: {
        ...payload,
        status: ListingStatus.DRAFT,
        createdById: req.user!.id,
        images: {
          create: payload.images.map((image, index) => ({
            url: image.url,
            caption: image.caption,
            order: index,
          })),
        },
      },
      include: listingDetailInclude,
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Invalid listing payload",
    });
  }
});

router.patch("/:id", requireAgentOrAdmin, async (req: AuthedRequest, res) => {
  try {
    const listingId = getIdParam(req);
    const existing = await ensureListingAccess(req, res, listingId);
    if (!existing) {
      return;
    }

    if (existing.status === ListingStatus.PUBLISHED && req.user?.role !== Role.ADMIN) {
      return res
        .status(400)
        .json({ message: "Published listings can only be edited by admins" });
    }

    const payload = validateListingPayload(req.body);

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...payload,
        images: {
          deleteMany: {},
          create: payload.images.map((image, index) => ({
            url: image.url,
            caption: image.caption,
            order: index,
          })),
        },
      },
      include: listingDetailInclude,
    });

    res.status(200).json({
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Invalid listing payload",
    });
  }
});

router.patch("/:id/status", requireAgentOrAdmin, async (req: AuthedRequest, res) => {
  try {
    const listingId = getIdParam(req);
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: listingDetailInclude,
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const nextStatus = parseEnumValue(
      req.body?.status,
      listingStatuses,
      "status",
    ) as ListingStatus;

    if (req.user?.role !== Role.ADMIN) {
      if (listing.createdById !== req.user?.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (
        listing.status !== ListingStatus.DRAFT ||
        nextStatus !== ListingStatus.REVIEW
      ) {
        return res.status(403).json({
          message: "Agents can only submit draft listings for review",
        });
      }
    }

    const normalizedForValidation: ListingPayload = {
      title: listing.title,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      pincode: listing.pincode,
      rentAmount: listing.rentAmount,
      deposit: listing.deposit,
      maintenanceAmount: listing.maintenanceAmount,
      brokerageAmount: listing.brokerageAmount,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      balconies: listing.balconies,
      floorNumber: listing.floorNumber,
      totalFloors: listing.totalFloors,
      area: listing.area,
      ageOfProperty: listing.ageOfProperty,
      furnished: listing.furnished,
      propertyType: listing.propertyType,
      preferredTenantType: listing.preferredTenantType,
      parking: listing.parking,
      facing: listing.facing,
      listedBy: listing.listedBy,
      availableFor: listing.availableFor,
      leaseDurationMonths: listing.leaseDurationMonths,
      noticePeriodDays: listing.noticePeriodDays,
      petPolicy: listing.petPolicy,
      waterSupply: listing.waterSupply,
      powerBackup: listing.powerBackup,
      availableFrom: listing.availableFrom,
      videoTourUrl: listing.videoTourUrl,
      amenities: listing.amenities,
      rules: listing.rules,
      nearbyLandmarks: listing.nearbyLandmarks,
      images: listing.images.map((image) => ({
        url: image.url,
        caption: image.caption,
      })),
    };

    if (
      nextStatus === ListingStatus.REVIEW ||
      nextStatus === ListingStatus.PUBLISHED
    ) {
      validateListingReadiness(normalizedForValidation);
    }

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: nextStatus,
        reviewedById: req.user?.role === Role.ADMIN ? req.user.id : listing.reviewedById,
        publishedAt:
          nextStatus === ListingStatus.PUBLISHED ? new Date() : nextStatus === ListingStatus.ARCHIVED ? null : listing.publishedAt,
      },
      include: listingDetailInclude,
    });

    res.status(200).json({
      message: "Listing status updated successfully",
      listing: updated,
    });
  } catch (error) {
    console.error("Update listing status error:", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to update listing status",
    });
  }
});

router.get("/shortlist/me", requireTenant, async (req: AuthedRequest, res) => {
  try {
    const items = await prisma.shortlist.findMany({
      where: {
        tenantId: req.user!.id,
        listing: {
          status: ListingStatus.PUBLISHED,
        },
      },
      include: {
        listing: {
          include: listingSummaryInclude,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      items: items.map((item) => item.listing),
    });
  } catch (error) {
    console.error("Fetch shortlist error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/:id/shortlist-toggle",
  requireTenant,
  async (req: AuthedRequest, res) => {
    try {
      const listingId = getIdParam(req);
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
      });

      if (!listing || listing.status !== ListingStatus.PUBLISHED) {
        return res.status(404).json({ message: "Listing not found" });
      }

      const existing = await prisma.shortlist.findUnique({
        where: {
          tenantId_listingId: {
            tenantId: req.user!.id,
            listingId,
          },
        },
      });

      if (existing) {
        await prisma.shortlist.delete({
          where: { id: existing.id },
        });

        return res.status(200).json({ shortlisted: false });
      }

      await prisma.shortlist.create({
        data: {
          tenantId: req.user!.id,
          listingId,
        },
      });

      res.status(200).json({ shortlisted: true });
    } catch (error) {
      console.error("Toggle shortlist error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get("/:id", async (req, res) => {
  try {
    const listingId = getIdParam(req as AuthedRequest);
    const user = await getSessionUser(req);
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: listingDetailInclude,
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const canView =
      listing.status === ListingStatus.PUBLISHED ||
      (user &&
        (user.role === Role.ADMIN || listing.createdById === user.id));

    if (!canView) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const shortlisted =
      user?.role === Role.TENANT
        ? Boolean(
            await prisma.shortlist.findUnique({
              where: {
                tenantId_listingId: {
                  tenantId: user.id,
                  listingId: listing.id,
                },
              },
            }),
          )
        : false;

    res.status(200).json({
      ...listing,
      shortlisted,
    });
  } catch (error) {
    console.error("Fetch listing detail error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
