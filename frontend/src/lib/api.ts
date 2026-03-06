import type {
  ListingDetail,
  ListingFilters,
  ListingListResponse,
  ListingPayload,
  ListingSummary,
  SessionUser,
} from "../types/listings";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function fetchSession() {
  try {
    const data = await apiFetch<{ user: SessionUser }>("/api/me");
    return data.user || null;
  } catch {
    return null;
  }
}

export async function signOut() {
  await apiFetch("/api/auth/sign-out", { method: "POST" });
}

export async function fetchListings(filters: ListingFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return apiFetch<ListingListResponse>(`/api/listings?${params.toString()}`);
}

export async function fetchListing(id: string) {
  return apiFetch<ListingDetail>(`/api/listings/${id}`);
}

export async function fetchMyListings(status?: string) {
  const params = new URLSearchParams();
  if (status) {
    params.set("status", status);
  }

  return apiFetch<{ items: ListingSummary[] }>(
    `/api/listings/my-listings${params.toString() ? `?${params.toString()}` : ""}`,
  );
}

export async function createListing(payload: ListingPayload) {
  return apiFetch<{ listing: ListingDetail; message: string }>("/api/listings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateListing(id: string, payload: ListingPayload) {
  return apiFetch<{ listing: ListingDetail; message: string }>(`/api/listings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateListingStatus(id: string, status: string) {
  return apiFetch<{ listing: ListingDetail; message: string }>(
    `/api/listings/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}

export async function fetchShortlist() {
  return apiFetch<{ items: ListingSummary[] }>("/api/listings/shortlist/me");
}

export async function toggleShortlist(id: string) {
  return apiFetch<{ shortlisted: boolean }>(`/api/listings/${id}/shortlist-toggle`, {
    method: "POST",
  });
}

export async function fetchCompare(ids: string[]) {
  return apiFetch<{ items: Array<ListingDetail | undefined> }>(
    `/api/listings/compare?ids=${ids.join(",")}`,
  );
}

export async function createInquiry(input: {
  subject: string;
  message: string;
  listingId: string;
}) {
  return apiFetch("/api/tickets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
