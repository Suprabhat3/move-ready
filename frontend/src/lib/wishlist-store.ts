import type { ListingSummary } from "../types/listings";

const WISHLIST_KEY = "moveready_wishlist";

export const getWishlist = (): ListingSummary[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(WISHLIST_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addToWishlist = (listing: ListingSummary) => {
  const wishlist = getWishlist();
  if (!wishlist.find((item) => item.id === listing.id)) {
    // Only store essential info to keep localStorage small
    const summary: ListingSummary = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      pincode: listing.pincode,
      lat: listing.lat,
      lng: listing.lng,
      status: listing.status,
      rentAmount: listing.rentAmount,
      deposit: listing.deposit,
      maintenanceAmount: listing.maintenanceAmount,
      brokerageAmount: listing.brokerageAmount,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      balconies: listing.balconies,
      area: listing.area,
      propertyType: listing.propertyType,
      furnished: listing.furnished,
      parking: listing.parking,
      availableFrom: listing.availableFrom,
      images: listing.images,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };
    wishlist.push(summary);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (id: string) => {
  const wishlist = getWishlist();
  const updated = wishlist.filter((item) => item.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
};

export const toggleWishlistInStore = (listing: ListingSummary) => {
  if (isInWishlist(listing.id)) {
    removeFromWishlist(listing.id);
  } else {
    addToWishlist(listing);
  }
};

export const isInWishlist = (id: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === id);
};
