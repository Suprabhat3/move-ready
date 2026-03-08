export type ListingStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
export type FurnishedType =
  | "UNFURNISHED"
  | "SEMI_FURNISHED"
  | "FULLY_FURNISHED";
export type PropertyType =
  | "APARTMENT"
  | "INDEPENDENT_HOUSE"
  | "VILLA"
  | "STUDIO"
  | "PENTHOUSE"
  | "PG";
export type PreferredTenantType =
  | "ANY"
  | "FAMILY"
  | "BACHELORS"
  | "FEMALE_ONLY"
  | "MALE_ONLY"
  | "STUDENTS";
export type ParkingType = "NONE" | "BIKE" | "CAR" | "BOTH";
export type FacingType =
  | "NORTH"
  | "SOUTH"
  | "EAST"
  | "WEST"
  | "NORTH_EAST"
  | "NORTH_WEST"
  | "SOUTH_EAST"
  | "SOUTH_WEST";
export type ListedByType = "OWNER" | "AGENT" | "BUILDER";
export type AvailableForType = "RENT" | "LEASE";
export type PetPolicyType = "ALLOWED" | "NEGOTIABLE" | "NOT_ALLOWED";
export type WaterSupplyType =
  | "CORPORATION"
  | "BOREWELL"
  | "BOTH"
  | "TANKER";
export type PowerBackupType = "NONE" | "PARTIAL" | "FULL";

export type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ListingImage = {
  id?: string;
  url: string;
  caption?: string | null;
  order?: number;
};

export type ListingSummary = {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: ListingStatus;
  rentAmount: number;
  deposit: number;
  maintenanceAmount: number;
  brokerageAmount: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  area: number;
  propertyType: PropertyType;
  furnished: FurnishedType;
  parking: ParkingType;
  availableFrom: string;
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
};

export type ListingDetail = ListingSummary & {
  preferredTenantType: PreferredTenantType;
  floorNumber: number | null;
  totalFloors: number | null;
  facing: FacingType | null;
  listedBy: ListedByType;
  availableFor: AvailableForType;
  leaseDurationMonths: number | null;
  noticePeriodDays: number | null;
  petPolicy: PetPolicyType;
  waterSupply: WaterSupplyType | null;
  powerBackup: PowerBackupType;
  ageOfProperty: number | null;
  videoTourUrl: string | null;
  amenities: string[];
  rules: string[];
  nearbyLandmarks: string[];
  shortlisted?: boolean;
  createdBy?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
  reviewedBy?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  } | null;
};

export type ListingListResponse = {
  items: ListingSummary[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type ListingFilters = {
  search?: string;
  city?: string;
  minRent?: string;
  maxRent?: string;
  propertyType?: PropertyType | "";
  furnished?: FurnishedType | "";
  parking?: ParkingType | "";
  bedrooms?: string;
  availableFrom?: string;
  sort?: string;
  page?: string;
};

export type ListingFormValues = {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rentAmount: string;
  deposit: string;
  maintenanceAmount: string;
  brokerageAmount: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  floorNumber: string;
  totalFloors: string;
  area: string;
  ageOfProperty: string;
  propertyType: PropertyType;
  furnished: FurnishedType;
  preferredTenantType: PreferredTenantType;
  parking: ParkingType;
  facing: FacingType | "";
  listedBy: ListedByType;
  availableFor: AvailableForType;
  leaseDurationMonths: string;
  noticePeriodDays: string;
  petPolicy: PetPolicyType;
  waterSupply: WaterSupplyType | "";
  powerBackup: PowerBackupType;
  availableFrom: string;
  videoTourUrl: string;
  amenities: string[];
  rules: string[];
  nearbyLandmarks: string[];
};

export type ListingPayload = ListingFormValues & {
  images: ListingImage[];
};
