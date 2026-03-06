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
        <div className="text-3xl font-black animate-pulse bg-gradient-to-r from-[#ff00ff] to-[#00e5ff] text-transparent bg-clip-text">
          Syncing your inventory...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-[#ff00ff]/90 backdrop-blur-md border-4 border-black rounded-[2rem] text-white text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-2xl font-black mb-4">Something went wrong</h3>
        <p className="font-bold text-lg mb-6">{error}</p>
        <button
          onClick={() => void loadListings()}
          className="px-8 py-3 bg-black text-white font-black rounded-xl border-2 border-white/20 hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header & Filters */}
      <div className="bg-white/60 backdrop-blur-xl border-2 border-black/10 p-6 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2 text-black/40">
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
              className={`px-5 py-2.5 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                activeStatus === status
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-black/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <Link
          to="/dashboard/listings/new"
          className="h-14 px-8 bg-[#39ff14] text-black border-2 border-black rounded-2xl font-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group"
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
        <div className="py-24 px-10 bg-white/40 backdrop-blur-md border-4 border-black border-dashed rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-black/5 rounded-3xl border-2 border-black/20 flex items-center justify-center mx-auto mb-6">
            <Search size={40} className="text-black/20" />
          </div>
          <h3 className="text-3xl font-black text-black/60 uppercase tracking-tighter">
            No Listings Found
          </h3>
          <p className="mt-4 text-black/40 font-bold text-xl max-w-md mx-auto">
            You don't have any properties in the{" "}
            <span className="text-black">"{activeStatus}"</span> state yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((item) => (
            <div
              key={item.id}
              className="group bg-white/60 backdrop-blur-xl border-2 border-black/10 rounded-[2.5rem] flex flex-col p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-56 bg-black relative rounded-[1.8rem] border-2 border-black shadow-inner overflow-hidden mb-6">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/5 text-black/20 font-black uppercase tracking-tighter text-3xl italic">
                    Ready2Move
                  </div>
                )}

                <div
                  className={`absolute top-4 left-4 border-2 border-black rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    item.status === "PUBLISHED"
                      ? "bg-[#39ff14] text-black"
                      : item.status === "REVIEW"
                        ? "bg-[#00e5ff] text-black"
                        : item.status === "DRAFT"
                          ? "bg-white text-black"
                          : "bg-black text-white"
                  }`}
                >
                  {formatStatus(item.status)}
                </div>
              </div>

              <div className="flex-1 flex flex-col px-2 pb-2">
                <h3 className="text-2xl font-black text-black leading-tight mb-2 group-hover:text-[#ff00ff] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-black/50 font-bold text-sm truncate mb-8">
                  {item.address}, {item.city}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-3xl font-black text-black drop-shadow-sm">
                      ₹{item.rentAmount.toLocaleString()}
                      <span className="text-sm text-black/40 ml-1">/mo</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(item.id)}
                      className="h-12 px-4 flex items-center justify-center bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group/copy"
                      title="Copy ID"
                    >
                      <Copy
                        size={18}
                        strokeWidth={3}
                        className="text-black group-hover/copy:scale-110 transition-transform"
                      />
                    </button>

                    {item.status === "DRAFT" && user?.role === "SITE_AGENT" && (
                      <button
                        type="button"
                        onClick={() => void moveListing(item.id, "REVIEW")}
                        className="h-12 px-4 flex items-center justify-center bg-[#00e5ff] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group/send"
                        title="Submit for review"
                      >
                        <Send
                          size={18}
                          strokeWidth={3}
                          className="text-black group-send/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform"
                        />
                      </button>
                    )}

                    <Link
                      to={`/dashboard/listings/${item.id}/edit`}
                      className="flex-1 h-12 flex items-center justify-center gap-3 bg-black text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,229,255,0.3)] hover:bg-[#00e5ff] hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase text-xs tracking-widest px-4"
                    >
                      <span>Manage</span>
                      <ExternalLink size={14} strokeWidth={3} />
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
