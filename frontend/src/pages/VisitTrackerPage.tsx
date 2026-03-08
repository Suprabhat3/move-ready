import { useEffect, useState } from "react";
import { format } from "date-fns";

// Enums defined locally as const objects to avoid @prisma/client dependency and satisfy erasableSyntaxOnly
export const VisitStatus = {
  REQUESTED: "REQUESTED",
  SCHEDULED: "SCHEDULED",
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
  createMoveIn,
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

  const handleApproveMoveIn = async (visit: Visit, moveInDate: string) => {
    try {
      if (!moveInDate) {
        alert("Please select a move-in date.");
        return;
      }
      await createMoveIn({
        tenantId: visit.tenantId,
        listingId: visit.listingId,
        moveInDate,
      });
      alert("Application approved and Move-In started!");
      fetchVisitsData();
    } catch (error) {
      console.error("Approve Move-In error:", error);
      alert("Error approving move-in. Check console.");
    }
  };

  if (isLoading)
    return <div className="p-10 text-center font-black">Loading Visits...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-36 pb-20 relative">
      <h1 className="text-4xl font-black mb-10 text-[#1a1a1a]">
        {isAgent ? "Visit Management (Hub)" : "My Property Visits"}
      </h1>

      <div className="grid gap-6">
        {visits.length === 0 && (
          <div className="glass flex flex-col items-center justify-center p-16 text-center rounded-[2.5rem] shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-gray-500">
              No visits found matching your account.
            </p>
          </div>
        )}

        {visits.map((visit) => (
          <div
            key={visit.id}
            className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#1a1a1a]">
                    {visit.listing.title}
                  </h3>
                  <p className="text-gray-500 font-medium mt-1">
                    {visit.listing.address}, {visit.listing.city}
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full font-bold text-sm shadow-sm border ${
                    visit.status === VisitStatus.REQUESTED
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : visit.status === VisitStatus.SCHEDULED
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : visit.status === VisitStatus.VISITED
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : visit.status === VisitStatus.DECISION
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {visit.status === VisitStatus.DECISION
                    ? `DECISION: ${visit.decision}`
                    : visit.status}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <div className="bg-white p-2 text-gray-400 rounded-lg shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <span className="uppercase text-xs font-bold text-gray-400 tracking-wider block mb-1">
                      Proposed By Tenant
                    </span>
                    <p className="font-bold text-[#1a1a1a]">
                      {format(new Date(visit.proposedAt), "PPP p")}
                    </p>
                  </div>
                </div>

                {visit.scheduledAt && (
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                    <div className="bg-white p-2 text-[#0a5ea8] rounded-lg shadow-sm border border-blue-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <path d="m9 16 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <span className="uppercase text-xs font-bold text-blue-500 tracking-wider block mb-1">
                        Confirmed Schedule
                      </span>
                      <p className="font-bold text-[#0a5ea8]">
                        {format(new Date(visit.scheduledAt), "PPP p")}
                      </p>
                    </div>
                  </div>
                )}

                {visit.notes && (
                  <p className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-600 font-medium italic">
                    "{visit.notes}"
                  </p>
                )}
                {isAgent && visit.tenant && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0a5ea8] flex items-center justify-center font-black">
                      {visit.tenant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Requester
                      </p>
                      <p className="font-bold text-[#1a1a1a]">
                        {visit.tenant.name}{" "}
                        <span className="font-medium text-gray-500">
                          ({visit.tenant.email})
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Tenant Actions */}
                {!isAgent && visit.status === VisitStatus.REQUESTED && (
                  <button
                    onClick={() => handleCancel(visit.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-6 py-2.5 rounded-xl border border-red-200 transition-colors"
                  >
                    Cancel Request
                  </button>
                )}
                {!isAgent &&
                  (visit.status === VisitStatus.VISITED ||
                    (visit.status === VisitStatus.DECISION &&
                      visit.decision === VisitDecision.INTERESTED)) && (
                    <div className="flex flex-col w-full gap-4 pt-4 border-t border-gray-50">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Your Next Step
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {/* Only show 'Interested' if not already interested */}
                        {visit.decision !== VisitDecision.INTERESTED && (
                          <button
                            onClick={() =>
                              handleDecision(visit.id, VisitDecision.INTERESTED)
                            }
                            className="bg-[#28a745] hover:bg-[#218838] text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                          >
                            I'm Interested
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDecision(visit.id, VisitDecision.APPLIED)
                          }
                          className="bg-[#0a5ea8] hover:bg-[#084d8a] text-white font-bold px-8 py-2.5 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                          Apply for Move-In
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </button>

                        <button
                          onClick={() =>
                            handleDecision(
                              visit.id,
                              VisitDecision.NOT_INTERESTED,
                            )
                          }
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl transition-colors"
                        >
                          Pass
                        </button>
                      </div>
                    </div>
                  )}

                {/* Agent Actions */}
                {isAgent && visit.status === VisitStatus.REQUESTED && (
                  <div className="flex flex-wrap gap-3 items-center w-full">
                    <input
                      type="datetime-local"
                      id={`schedule-${visit.id}`}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 font-bold outline-none focus-ring text-gray-700"
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
                      className="bg-[#0a5ea8] hover:bg-[#084d8a] text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                      Schedule Visit
                    </button>
                  </div>
                )}
                {isAgent && visit.status === VisitStatus.SCHEDULED && (
                  <button
                    onClick={() => handleConfirmVisit(visit.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    Mark as Visited
                  </button>
                )}
                {isAgent &&
                  visit.status === VisitStatus.DECISION &&
                  visit.decision === VisitDecision.APPLIED && (
                    <div className="flex flex-wrap gap-3 items-center w-full pt-4 border-t border-gray-50">
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                          Planned Move-In Date
                        </p>
                        <input
                          type="date"
                          id={`approve-date-${visit.id}`}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-bold outline-none focus-ring text-gray-700"
                          defaultValue={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const val = (
                            document.getElementById(
                              `approve-date-${visit.id}`,
                            ) as HTMLInputElement
                          ).value;
                          handleApproveMoveIn(visit, val);
                        }}
                        className="bg-[#28a745] hover:bg-[#218838] text-white font-black px-8 py-3 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all mt-auto"
                      >
                        Approve & Start Move-In
                      </button>
                    </div>
                  )}
                {isAgent &&
                  visit.status === VisitStatus.DECISION &&
                  visit.decision === VisitDecision.INTERESTED && (
                    <p className="text-sm font-bold text-gray-400 italic">
                      Tenant is interested. Waiting for them to Apply or for you
                      to initialize Move-In manually.
                    </p>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
