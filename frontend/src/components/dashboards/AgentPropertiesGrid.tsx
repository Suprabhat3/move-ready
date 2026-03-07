import { useEffect, useState } from "react";
import { Copy, ExternalLink, Send, Plus, Search, Filter } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { fetchMyListings, updateListingStatus } from "../../lib/api";
import type {
  ListingStatus,
  ListingSummary,
  SessionUser,
} from "../../types/listings";

const statusOptions: Array<ListingStatus | "ALL"> = [
  "ALL",
  "DRAFT",
  "REVIEW",
  "PUBLISHED",
  "ARCHIVED",
];

export default function AgentPropertiesGrid({
  user,
}: {
  user: SessionUser | null;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const activeStatus =
    (searchParams.get("status") as ListingStatus | null) ?? "ALL";

  const loadListings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchMyListings(
        activeStatus === "ALL" ? undefined : activeStatus,
      );
      setListings(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadListings();
  }, [searchParams]);

  const changeStatusFilter = (status: ListingStatus | "ALL") => {
    const nextParams = new URLSearchParams(searchParams);
    if (status === "ALL") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", status);
    }
    setSearchParams(nextParams);
  };

  const moveListing = async (listingId: string, status: ListingStatus) => {
    await updateListingStatus(listingId, status);
    await loadListings();
  };

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 min-h-[400px]">
        <div className="text-xl font-bold text-[#0a5ea8] animate-pulse">
          Syncing your inventory...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-10 border border-gray-100 rounded-[2rem] text-center shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a]">
          Something went wrong
        </h3>
        <p className="font-medium text-lg mb-6 text-gray-500">{error}</p>
        <button
          onClick={() => void loadListings()}
          className="px-8 py-3 bg-[#0a5ea8] text-white font-bold rounded-xl shadow-sm hover:bg-[#084d8a] transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header & Filters */}
      <div className="glass border border-gray-100 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2 text-gray-400">
            <Filter size={18} className="shrink-0" />
            <span className="text-xs font-black uppercase tracking-widest">
              Filter:
            </span>
          </div>
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => changeStatusFilter(status)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${
                activeStatus === status
                  ? "bg-[#0a5ea8] text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <Link
          to="/dashboard/listings/new"
          className="h-14 px-8 bg-[#28a745] text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-md hover:bg-[#218838] transition-all group"
        >
          <Plus
            size={20}
            strokeWidth={3}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          Add New Property
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="py-24 px-10 glass border border-gray-100 border-dashed rounded-[3rem] text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-[#1a1a1a]">
            No Listings Found
          </h3>
          <p className="mt-2 text-gray-500 font-medium text-lg max-w-md mx-auto">
            You don't have any properties in the{" "}
            <span className="text-[#1a1a1a] font-bold">"{activeStatus}"</span>{" "}
            state yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-gray-100 rounded-[2rem] flex flex-col p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-56 bg-gray-100 relative rounded-2xl overflow-hidden mb-5 shadow-inner">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-black uppercase tracking-wider text-xl">
                    Ready2Move
                  </div>
                )}

                <div
                  className={`absolute top-4 left-4 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md border ${
                    item.status === "PUBLISHED"
                      ? "bg-green-100/90 text-green-700 border-green-200"
                      : item.status === "REVIEW"
                        ? "bg-blue-100/90 text-blue-700 border-blue-200"
                        : item.status === "DRAFT"
                          ? "bg-white/90 text-gray-700 border-gray-200"
                          : "bg-gray-800/90 text-white border-gray-700"
                  }`}
                >
                  {formatStatus(item.status)}
                </div>
              </div>

              <div className="flex-1 flex flex-col px-1 pb-1">
                <h3 className="text-2xl font-bold text-[#1a1a1a] leading-tight mb-1 group-hover:text-[#0a5ea8] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-gray-500 font-medium text-sm truncate mb-6">
                  {item.address}, {item.city}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-2xl font-black text-[#1a1a1a]">
                      ₹{item.rentAmount.toLocaleString()}
                      <span className="text-sm font-medium text-gray-400 ml-1">
                        /mo
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(item.id)}
                      className="h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 hover:bg-gray-50 text-gray-600 transition-all group/copy"
                      title="Copy ID"
                    >
                      <Copy
                        size={18}
                        className="group-hover/copy:scale-110 transition-transform text-gray-500"
                      />
                    </button>

                    {item.status === "DRAFT" && user?.role === "SITE_AGENT" && (
                      <button
                        type="button"
                        onClick={() => void moveListing(item.id, "REVIEW")}
                        className="h-12 w-12 flex items-center justify-center bg-blue-50 border border-blue-200 text-[#0a5ea8] rounded-xl hover:bg-blue-100 transition-all group/send"
                        title="Submit for review"
                      >
                        <Send
                          size={18}
                          className="group-hover/send:-translate-y-0.5 group-hover/send:translate-x-0.5 transition-transform"
                        />
                      </button>
                    )}

                    <Link
                      to={`/dashboard/listings/${item.id}/edit`}
                      className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#1a1a1a] text-white rounded-xl shadow-sm hover:bg-gray-800 transition-all font-bold uppercase text-xs tracking-wider px-4"
                    >
                      <span>Manage</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
