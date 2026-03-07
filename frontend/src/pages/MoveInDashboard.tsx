import { useEffect, useState } from "react";
import { format } from "date-fns";

// Enums defined locally as const objects to avoid @prisma/client dependency and satisfy erasableSyntaxOnly
export const MoveInStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type MoveInStatus = (typeof MoveInStatus)[keyof typeof MoveInStatus];

export const ChecklistType = {
  DOCUMENT_UPLOAD: "DOCUMENT_UPLOAD",
  AGREEMENT_CONFIRMATION: "AGREEMENT_CONFIRMATION",
  PAYMENT: "PAYMENT",
  INVENTORY_REVIEW: "INVENTORY_REVIEW",
  KEY_HANDOVER: "KEY_HANDOVER",
  OTHER: "OTHER",
} as const;
export type ChecklistType = (typeof ChecklistType)[keyof typeof ChecklistType];

import type { SessionUser } from "../types/listings";
import { fetchMyMoveIn, createMoveIn, updateChecklistItem } from "../lib/api";

interface MoveIn {
  id: string;
  status: MoveInStatus;
  moveInDate: string;
  listing: {
    title: string;
    address: string;
    city: string;
  };
  checklist: {
    id: string;
    type: ChecklistType;
    label: string;
    completed: boolean;
    fileUrl: string | null;
  }[];
  inventory: {
    id: string;
    name: string;
    condition: string;
    quantity: number;
    notes: string | null;
  }[];
}

export default function MoveInDashboard({
  user,
}: {
  user: SessionUser | null;
}) {
  const [moveIn, setMoveIn] = useState<MoveIn | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminTenantId, setAdminTenantId] = useState("");
  const [adminListingId, setAdminListingId] = useState("");
  const [adminDate, setAdminDate] = useState("");

  const isAgent = user?.role === "SITE_AGENT" || user?.role === "ADMIN";

  const fetchMoveInData = async () => {
    try {
      const data = await fetchMyMoveIn();
      setMoveIn(data);
    } catch (error) {
      console.error("Fetch move-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !isAgent) fetchMoveInData();
    else setIsLoading(false);
  }, [user, isAgent]);

  const handleChecklistUpdate = async (itemId: string, completed: boolean) => {
    if (!moveIn) return;
    try {
      await updateChecklistItem(moveIn.id, itemId, completed);
      fetchMoveInData();
    } catch (error) {
      console.error("Checklist update error:", error);
    }
  };

  const handleCreateMoveInRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMoveIn({
        tenantId: adminTenantId,
        listingId: adminListingId,
        moveInDate: adminDate,
      });
      alert("Move-In Created Successfully!");
    } catch (error) {
      console.error("Create move-in error:", error);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center font-black">Loading...</div>;

  if (isAgent) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-20">
        <h1 className="text-4xl font-black mb-8 uppercase border-b-4 border-black pb-4">
          Move-In Management
        </h1>
        <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-brutal">
          <h2 className="text-2xl font-black mb-6">Initialize New Move-In</h2>
          <form onSubmit={handleCreateMoveInRequest} className="space-y-4">
            <div>
              <label className="block font-black uppercase text-xs mb-1">
                Tenant ID
              </label>
              <input
                type="text"
                value={adminTenantId}
                onChange={(e) => setAdminTenantId(e.target.value)}
                className="w-full border-4 border-black p-3 font-bold"
                placeholder="Paste user uuid here"
                required
              />
            </div>
            <div>
              <label className="block font-black uppercase text-xs mb-1">
                Listing ID
              </label>
              <input
                type="text"
                value={adminListingId}
                onChange={(e) => setAdminListingId(e.target.value)}
                className="w-full border-4 border-black p-3 font-bold"
                placeholder="Paste listing uuid here"
                required
              />
            </div>
            <div>
              <label className="block font-black uppercase text-xs mb-1">
                Planned Move-In Date
              </label>
              <input
                type="date"
                value={adminDate}
                onChange={(e) => setAdminDate(e.target.value)}
                className="w-full border-4 border-black p-3 font-bold"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#39ff14] py-4 font-black text-xl border-4 border-black shadow-brutal hover:-translate-y-1 transition-transform"
            >
              CREATE MOVE-IN RECORD
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!moveIn) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-20">
        <div className="bg-white border-4 border-black p-10 text-center rounded-2xl shadow-brutal">
          <h2 className="text-3xl font-black mb-4">No Active Move-In</h2>
          <p className="font-bold text-lg italic text-text-muted">
            You'll see your move-in checklist here once an agent approves your
            application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-36 pb-20">
      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-8">
        <h1 className="text-4xl font-black uppercase">Move-In Tracker</h1>
        <span className="bg-[#39ff14] border-2 border-black px-4 py-1 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
          {moveIn.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Checklist */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black italic bg-black text-white inline-block px-4 py-1 skew-x-[-12deg]">
            Onboarding Checklist
          </h3>
          <div className="space-y-4">
            {moveIn.checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 border-4 border-black rounded-xl shadow-brutal transition-colors ${item.completed ? "bg-green-50" : "bg-white"}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) =>
                    handleChecklistUpdate(item.id, e.target.checked)
                  }
                  className="w-8 h-8 border-4 border-black accent-black cursor-pointer"
                />
                <div className="flex-1">
                  <p
                    className={`font-black text-lg ${item.completed ? "line-through opacity-50" : ""}`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs uppercase font-bold opacity-60">
                    {item.type.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory & Details */}
        <div className="space-y-10">
          <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-brutal">
            <h3 className="text-xl font-black mb-4 uppercase border-b-2 border-dashed border-black pb-2">
              Property Details
            </h3>
            <p className="text-2xl font-black">{moveIn.listing.title}</p>
            <p className="font-bold italic text-text-muted">
              {moveIn.listing.address}, {moveIn.listing.city}
            </p>
            <div className="mt-4 bg-yellow-100 border-2 border-black p-3 font-black text-center">
              MOVE IN DATE:{" "}
              {format(new Date(moveIn.moveInDate), "MMMM do, yyyy")}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-black italic bg-black text-white inline-block px-4 py-1 skew-x-[-12deg]">
              Property Inventory
            </h3>
            <div className="grid gap-3">
              {moveIn.inventory.length === 0 && (
                <p className="font-bold italic opacity-40">
                  No items listed in inventory yet.
                </p>
              )}
              {moveIn.inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-black p-3 rounded-lg flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    <span className="font-black text-lg">{item.name}</span>
                    <span className="text-xs font-black bg-black text-white px-2 ml-2 rounded">
                      x{item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">
                    Status: {item.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
