import { useEffect, useState } from "react";
import { format } from "date-fns";

// Enums defined locally as const objects to avoid @prisma/client dependency and satisfy erasableSyntaxOnly
export const VisitStatus = {
  REQUESTED: "REQUESTED",
  SCHEDULED: "SCHEDULEED",
  VISITED: "VISITED",
  CANCELLED: "CANCELLED",
  DECISION: "DECISION",
} as const;
export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus];

export const VisitDecision = {
  INTERESTED: "INTERESTED",
  NOT_INTERESTED: "NOT_INTERESTED",
  APPLIED: "APPLIED",
} as const;
export type VisitDecision = (typeof VisitDecision)[keyof typeof VisitDecision];

import {
  fetchMyVisits,
  fetchAdminVisits,
  updateVisitDecision,
  cancelVisit,
  scheduleVisit,
  confirmVisit,
} from "../lib/api";
import type { SessionUser } from "../types/listings";

interface Visit {
  id: string;
  listingId: string;
  tenantId: string;
  status: VisitStatus;
  proposedAt: string;
  scheduledAt: string | null;
  visitedAt: string | null;
  decision: VisitDecision | null;
  notes: string | null;
  listing: {
    title: string;
    address: string;
    city: string;
    images?: { url: string }[];
  };
  tenant?: {
    name: string;
    email: string;
  };
}

export default function VisitTrackerPage({
  user,
}: {
  user: SessionUser | null;
}) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAgent = user?.role === "SITE_AGENT" || user?.role === "ADMIN";

  const fetchVisitsData = async () => {
    try {
      const data = isAgent ? await fetchAdminVisits() : await fetchMyVisits();
      setVisits(data);
    } catch (error) {
      console.error("Fetch visits error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchVisitsData();
  }, [user, isAgent]);

  const handleDecision = async (visitId: string, decision: VisitDecision) => {
    try {
      await updateVisitDecision(visitId, decision);
      fetchVisitsData();
    } catch (error) {
      console.error("Decision error:", error);
    }
  };

  const handleCancel = async (visitId: string) => {
    try {
      await cancelVisit(visitId);
      fetchVisitsData();
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  const handleScheduleRequest = async (
    visitId: string,
    scheduledAt: string,
  ) => {
    try {
      await scheduleVisit(visitId, scheduledAt);
      fetchVisitsData();
    } catch (error) {
      console.error("Schedule error:", error);
    }
  };

  const handleConfirmVisit = async (visitId: string) => {
    try {
      await confirmVisit(visitId);
      fetchVisitsData();
    } catch (error) {
      console.error("Confirm error:", error);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center font-black">Loading Visits...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-36 pb-20">
      <h1 className="text-4xl font-black mb-8 uppercase border-b-4 border-black pb-4">
        {isAgent ? "Visit Management (Hub)" : "My Property Visits"}
      </h1>

      <div className="grid gap-6">
        {visits.length === 0 && (
          <div className="bg-white border-4 border-black p-10 text-center rounded-2xl shadow-brutal">
            <p className="text-xl font-bold italic">
              No visits found matching your account.
            </p>
          </div>
        )}

        {visits.map((visit) => (
          <div
            key={visit.id}
            className="bg-white border-4 border-black rounded-2xl p-6 shadow-brutal flex flex-col md:flex-row gap-6 hover:-translate-y-1 transition-transform"
          >
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black">{visit.listing.title}</h3>
                  <p className="text-text-muted font-bold italic">
                    {visit.listing.address}, {visit.listing.city}
                  </p>
                </div>
                <span
                  className={`px-4 py-1 border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    visit.status === VisitStatus.REQUESTED
                      ? "bg-yellow-300"
                      : visit.status === VisitStatus.SCHEDULED
                        ? "bg-blue-300"
                        : visit.status === VisitStatus.VISITED
                          ? "bg-green-300"
                          : "bg-red-300"
                  }`}
                >
                  {visit.status}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <p className="font-bold border-l-4 border-black pl-3">
                  <span className="uppercase text-xs opacity-60 block">
                    Proposed By Tenant
                  </span>
                  {format(new Date(visit.proposedAt), "PPP p")}
                </p>
                {visit.scheduledAt && (
                  <p className="font-bold border-l-4 border-black pl-3 text-blue-600">
                    <span className="uppercase text-xs opacity-60 block">
                      Confirmed Schedule
                    </span>
                    {format(new Date(visit.scheduledAt), "PPP p")}
                  </p>
                )}
                {visit.notes && (
                  <p className="italic bg-gray-100 p-2 rounded border-2 border-dashed border-black">
                    "{visit.notes}"
                  </p>
                )}
                {isAgent && visit.tenant && (
                  <p className="font-black mt-4">
                    Requester: {visit.tenant.name} ({visit.tenant.email})
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Tenant Actions */}
                {!isAgent && visit.status === VisitStatus.REQUESTED && (
                  <button
                    onClick={() => handleCancel(visit.id)}
                    className="bg-red-500 text-white font-black px-6 py-2 border-2 border-black shadow-brutal"
                  >
                    Cancel Request
                  </button>
                )}
                {!isAgent && visit.status === VisitStatus.VISITED && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleDecision(visit.id, VisitDecision.INTERESTED)
                      }
                      className="bg-[#39ff14] font-black px-4 py-2 border-2 border-black shadow-brutal"
                    >
                      I'm Interested
                    </button>
                    <button
                      onClick={() =>
                        handleDecision(visit.id, VisitDecision.APPLIED)
                      }
                      className="bg-[#00e5ff] font-black px-4 py-2 border-2 border-black shadow-brutal"
                    >
                      Applied
                    </button>
                    <button
                      onClick={() =>
                        handleDecision(visit.id, VisitDecision.NOT_INTERESTED)
                      }
                      className="bg-gray-300 font-black px-4 py-2 border-2 border-black shadow-brutal"
                    >
                      Pass
                    </button>
                  </div>
                )}

                {/* Agent Actions */}
                {isAgent && visit.status === VisitStatus.REQUESTED && (
                  <div className="flex gap-2 items-center">
                    <input
                      type="datetime-local"
                      id={`schedule-${visit.id}`}
                      className="border-2 border-black p-2 font-bold"
                    />
                    <button
                      onClick={() => {
                        const val = (
                          document.getElementById(
                            `schedule-${visit.id}`,
                          ) as HTMLInputElement
                        ).value;
                        if (val) handleScheduleRequest(visit.id, val);
                      }}
                      className="bg-[#39ff14] font-black px-6 py-2 border-2 border-black shadow-brutal"
                    >
                      Schedule Visit
                    </button>
                  </div>
                )}
                {isAgent && visit.status === VisitStatus.SCHEDULED && (
                  <button
                    onClick={() => handleConfirmVisit(visit.id)}
                    className="bg-[#ff00ff] text-white font-black px-6 py-2 border-2 border-black shadow-brutal"
                  >
                    Mark as Visited
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
