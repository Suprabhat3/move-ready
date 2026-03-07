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
        <h1 className="text-4xl font-black mb-10 border-b border-gray-100 pb-4 text-[#1a1a1a]">
          Move-In Management
        </h1>
        <div className="glass border border-gray-100 p-8 md:p-10 rounded-[2.5rem] shadow-premium">
          <h2 className="text-2xl font-black mb-8 text-[#1a1a1a]">
            Initialize New Move-In
          </h2>
          <form onSubmit={handleCreateMoveInRequest} className="space-y-6">
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Tenant ID
              </label>
              <input
                type="text"
                value={adminTenantId}
                onChange={(e) => setAdminTenantId(e.target.value)}
                className="w-full border border-gray-200 py-3.5 px-4 rounded-xl font-medium outline-none focus-ring"
                placeholder="Paste user uuid here"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Listing ID
              </label>
              <input
                type="text"
                value={adminListingId}
                onChange={(e) => setAdminListingId(e.target.value)}
                className="w-full border border-gray-200 py-3.5 px-4 rounded-xl font-medium outline-none focus-ring"
                placeholder="Paste listing uuid here"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Planned Move-In Date
              </label>
              <input
                type="date"
                value={adminDate}
                onChange={(e) => setAdminDate(e.target.value)}
                className="w-full border border-gray-200 py-3.5 px-4 rounded-xl font-medium outline-none focus-ring"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0a5ea8] py-4 rounded-xl font-bold text-lg text-white shadow-md hover:bg-[#084d8a] hover:-translate-y-0.5 transition-all mt-4"
            >
              Create Move-In Record
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!moveIn) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-20">
        <div className="glass p-16 text-center rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-black mb-4 text-[#1a1a1a]">
            No Active Move-In
          </h2>
          <p className="font-medium text-lg text-gray-500 max-w-lg">
            You'll see your move-in checklist here once an agent approves your
            application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-36 pb-20 relative">
      <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-10">
        <h1 className="text-4xl font-black text-[#1a1a1a]">Move-In Tracker</h1>
        <span className="bg-blue-50 text-[#0a5ea8] px-4 py-1.5 rounded-full font-bold shadow-sm uppercase text-sm border border-blue-100">
          {moveIn.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Checklist */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-[#1a1a1a] mb-6">
            Onboarding Checklist
          </h3>
          <div className="space-y-4">
            {moveIn.checklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-4 p-5 border rounded-2xl transition-all cursor-pointer ${item.completed ? "bg-green-50/50 border-green-200" : "bg-white border-gray-200 hover:shadow-sm"}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) =>
                    handleChecklistUpdate(item.id, e.target.checked)
                  }
                  className="w-6 h-6 border-gray-300 rounded focus-ring text-[#28a745]"
                />
                <div className="flex-1">
                  <p
                    className={`font-bold text-lg text-[#1a1a1a] ${item.completed ? "line-through text-opacity-50" : ""}`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs uppercase font-bold text-gray-400 mt-0.5">
                    {item.type.replace(/_/g, " ")}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Inventory & Details */}
        <div className="space-y-10">
          <div className="glass border border-gray-100 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 uppercase text-gray-700 tracking-wide border-b border-gray-100 pb-3">
              Property Details
            </h3>
            <p className="text-2xl font-black text-[#1a1a1a]">
              {moveIn.listing.title}
            </p>
            <p className="font-medium text-gray-500 mt-2">
              {moveIn.listing.address}, {moveIn.listing.city}
            </p>
            <div className="mt-8 bg-blue-50/50 border border-blue-100 p-4 rounded-xl font-black text-[#0a5ea8] text-center flex items-center justify-center gap-2">
              <span className="text-sm tracking-widest uppercase opacity-70">
                MOVE IN DATE:
              </span>{" "}
              {format(new Date(moveIn.moveInDate), "MMMM do, yyyy")}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-[#1a1a1a] mb-6">
              Property Inventory
            </h3>
            <div className="grid gap-4">
              {moveIn.inventory.length === 0 && (
                <p className="font-medium text-gray-400 italic bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                  No items listed in inventory yet.
                </p>
              )}
              {moveIn.inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 p-4 rounded-xl flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-[#1a1a1a]">
                      {item.name}
                    </span>
                    <span className="text-xs font-black bg-gray-100 text-gray-500 px-2 py-1 rounded">
                      x{item.quantity}
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0a5ea8]">
                    {item.condition}
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
