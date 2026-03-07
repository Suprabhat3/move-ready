import type {
  ListingDetail,
  ListingFilters,
  ListingListResponse,
  ListingPayload,
  ListingSummary,
  SessionUser,
} from "../types/listings";

export const API_BASE_URL = "http://localhost:4000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let errorDetail = "Request failed";
    try {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const errorBody = await response.json();
        errorDetail = errorBody.message || errorDetail;
      } else {
        errorDetail = `Error ${response.status}: ${response.statusText}`;
      }
    } catch (e) {
      console.error("Error reading error response:", e);
    }
    throw new Error(errorDetail);
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

// Visit Management
export async function fetchMyVisits() {
  return apiFetch<any[]>("/api/visits/me");
}

export async function fetchAdminVisits(status?: string) {
  return apiFetch<any[]>(`/api/visits/admin${status ? `?status=${status}` : ""}`);
}

export async function createVisitRequest(listingId: string, proposedAt: string, notes?: string) {
  return apiFetch("/api/visits", {
    method: "POST",
    body: JSON.stringify({ listingId, proposedAt, notes }),
  });
}

export async function updateVisitDecision(visitId: string, decision: string) {
  return apiFetch(`/api/visits/${visitId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({ decision }),
  });
}

export async function cancelVisit(visitId: string) {
  return apiFetch(`/api/visits/${visitId}/cancel`, {
    method: "PATCH",
  });
}

export async function scheduleVisit(visitId: string, scheduledAt: string) {
  return apiFetch(`/api/visits/${visitId}/schedule`, {
    method: "PATCH",
    body: JSON.stringify({ scheduledAt }),
  });
}

export async function confirmVisit(visitId: string) {
  return apiFetch(`/api/visits/${visitId}/confirm`, {
    method: "PATCH",
  });
}

// Move-In Management
export async function fetchMyMoveIn() {
  return apiFetch<any>("/api/move-in/me");
}

export async function createMoveIn(payload: any) {
  return apiFetch("/api/move-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateChecklistItem(moveInId: string, itemId: string, completed: boolean) {
  return apiFetch(`/api/move-in/${moveInId}/checklist/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
}

// Support Tickets (Tenant & Agent)
export async function fetchMyTickets() {
  return apiFetch<any[]>("/api/tickets/me");
}

export async function fetchAgentTickets() {
  return apiFetch<any[]>("/api/tickets/agent");
}

export async function replyToTicket(ticketId: string, content: string) {
  return apiFetch(`/api/tickets/${ticketId}/reply`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function updateTicketStatus(ticketId: string, status: string) {
  return apiFetch(`/api/tickets/${ticketId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
