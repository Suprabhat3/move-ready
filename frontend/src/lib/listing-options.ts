import type {
  FacingType,
  FurnishedType,
  ListedByType,
  ParkingType,
  PetPolicyType,
  PowerBackupType,
  PreferredTenantType,
  PropertyType,
  WaterSupplyType,
} from "../types/listings";

export const propertyTypeOptions: PropertyType[] = [
  "APARTMENT",
  "INDEPENDENT_HOUSE",
  "VILLA",
  "STUDIO",
  "PENTHOUSE",
  "PG",
];

export const furnishedOptions: FurnishedType[] = [
  "UNFURNISHED",
  "SEMI_FURNISHED",
  "FULLY_FURNISHED",
];

export const preferredTenantOptions: PreferredTenantType[] = [
  "ANY",
  "FAMILY",
  "BACHELORS",
  "FEMALE_ONLY",
  "MALE_ONLY",
  "STUDENTS",
];

export const parkingOptions: ParkingType[] = ["NONE", "BIKE", "CAR", "BOTH"];
export const facingOptions: FacingType[] = [
  "NORTH",
  "SOUTH",
  "EAST",
  "WEST",
  "NORTH_EAST",
  "NORTH_WEST",
  "SOUTH_EAST",
  "SOUTH_WEST",
];
export const listedByOptions: ListedByType[] = ["OWNER", "AGENT", "BUILDER"];
export const petPolicyOptions: PetPolicyType[] = [
  "ALLOWED",
  "NEGOTIABLE",
  "NOT_ALLOWED",
];
export const waterSupplyOptions: WaterSupplyType[] = [
  "CORPORATION",
  "BOREWELL",
  "BOTH",
  "TANKER",
];
export const powerBackupOptions: PowerBackupType[] = [
  "NONE",
  "PARTIAL",
  "FULL",
];

export const amenityOptions = [
  "Lift",
  "Gated Security",
  "Gym",
  "Swimming Pool",
  "Clubhouse",
  "Air Conditioning",
  "Modular Kitchen",
  "Wardrobes",
  "Internet Ready",
  "Gas Pipeline",
  "CCTV",
  "Children Play Area",
];

export const ruleOptions = [
  "No smoking indoors",
  "No loud music after 10 PM",
  "Pets subject to approval",
  "Visitor entry register required",
  "Minimum 11-month commitment preferred",
  "ID proof required before move-in",
];

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
