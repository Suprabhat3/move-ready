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
import {
  fetchMyMoveIn,
  createMoveIn,
  updateChecklistItem,
  fetchAdminMoveIns,
} from "../lib/api";

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
  const [moveIns, setMoveIns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminTenantId, setAdminTenantId] = useState("");
  const [adminListingId, setAdminListingId] = useState("");
  const [adminDate, setAdminDate] = useState("");

  const isAgent = user?.role === "SITE_AGENT" || user?.role === "ADMIN";

  const fetchMoveInData = async () => {
    try {
      if (isAgent) {
        const data = await fetchAdminMoveIns();
        setMoveIns(data);
      } else {
        const data = await fetchMyMoveIn();
        setMoveIn(data);
      }
    } catch (error) {
      console.error("Fetch move-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMoveInData();
    else setIsLoading(false);
  }, [user?.id, isAgent]);

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
      <div className="max-w-6xl mx-auto px-6 pt-36 pb-20">
        <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-black text-[#1a1a1a]">
            Move-In Management
          </h1>
          <p className="font-bold text-gray-400">
            {moveIns.length} Active Processes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm sticky top-36">
              <h2 className="text-xl font-black mb-6 text-[#1a1a1a] uppercase tracking-wider">
                Initialize Manual
              </h2>
              <form onSubmit={handleCreateMoveInRequest} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Tenant ID
                  </label>
                  <input
                    type="text"
                    value={adminTenantId}
                    onChange={(e) => setAdminTenantId(e.target.value)}
                    className="w-full border border-gray-100 py-3 px-4 rounded-xl font-bold text-sm outline-none focus:border-[#0a5ea8] bg-gray-50/50"
                    placeholder="User ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Listing ID
                  </label>
                  <input
                    type="text"
                    value={adminListingId}
                    onChange={(e) => setAdminListingId(e.target.value)}
                    className="w-full border border-gray-100 py-3 px-4 rounded-xl font-bold text-sm outline-none focus:border-[#0a5ea8] bg-gray-50/50"
                    placeholder="Listing ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Move-In Date
                  </label>
                  <input
                    type="date"
                    value={adminDate}
                    onChange={(e) => setAdminDate(e.target.value)}
                    className="w-full border border-gray-100 py-3 px-4 rounded-xl font-bold text-sm outline-none focus:border-[#0a5ea8] bg-gray-50/50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1a1a1a] py-4 rounded-xl font-black text-white hover:bg-black transition-all shadow-lg active:scale-95 mt-4"
                >
                  CREATE RECORD
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black mb-6 text-[#1a1a1a] uppercase tracking-wider">
              Active Move-Ins
            </h2>
            {moveIns.length === 0 && (
              <div className="bg-gray-50 p-12 text-center rounded-[2rem] border border-gray-100">
                <p className="font-bold text-gray-400 italic">
                  No move-in processes tracked yet.
                </p>
              </div>
            )}
            {moveIns.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between gap-6"
              >
                <div>
                  <h3 className="text-xl font-black text-[#1a1a1a] mb-1">
                    {m.listing.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 italic truncate mb-4">
                    {m.listing.address}, {m.listing.city}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0a5ea8] text-white flex items-center justify-center font-black">
                      {m.tenant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-gray-400 tracking-tighter">
                        Tenant
                      </p>
                      <p className="font-bold text-sm text-[#1a1a1a]">
                        {m.tenant.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between text-right">
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${m.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100 animate-pulse"}`}
                  >
                    {m.status}
                  </span>
                  <div className="mt-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                      Move In Expected
                    </p>
                    <p className="font-black text-[#1a1a1a]">
                      {format(new Date(m.moveInDate), "MMM do, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
