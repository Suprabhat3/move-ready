import { useEffect, useState } from "react";
import { Copy, ExternalLink, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { fetchMyListings, updateListingStatus } from "../../lib/api";
import type { ListingStatus, ListingSummary, SessionUser } from "../../types/listings";

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

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-12 h-12 border-4 border-black border-t-[#ff00ff] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border-4 border-black bg-[#ff00ff] text-white font-bold shadow-brutal">
        <p>Error loading listings: {error}</p>
        <button
          onClick={() => void loadListings()}
          className="mt-4 px-4 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => changeStatusFilter(status)}
            className={`px-4 py-2 border-2 border-black rounded-xl font-black ${
              activeStatus === status ? "bg-black text-white" : "bg-white"
            }`}
          >
            {status}
          </button>
        ))}
        <Link
          to="/dashboard/listings/new"
          className="ml-auto px-4 py-2 border-2 border-black rounded-xl font-black bg-[#39ff14]"
        >
          New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="p-12 border-4 border-black border-dashed text-center bg-white shadow-brutal">
          <h3 className="text-2xl font-black uppercase text-text-muted">
            No Listings In This State
          </h3>
          <p className="mt-2 text-text-muted font-bold">
            Create a new listing or change the inventory filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white border-4 border-black overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(57,255,20,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
            >
              <div className="h-48 bg-black relative border-b-4 border-black overflow-hidden">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 font-bold uppercase tracking-widest bg-gray-900">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white text-black text-xs font-black px-2 py-1 border-2 border-black uppercase tracking-wider shadow-brutal">
                  {item.status}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-black leading-tight mb-2 truncate">
                  {item.title}
                </h3>
                <p className="text-text-muted font-bold text-sm truncate mb-4">
                  {item.address}, {item.city}
                </p>

                <div className="mt-auto">
                  <p className="text-2xl font-black text-black mb-4 inline-block bg-[#00e5ff] px-2 py-1 border-2 border-black -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    INR {item.rentAmount.toLocaleString()}
                    <span className="text-sm">/mo</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(item.id)}
                      className="flex items-center justify-center bg-[#fdfdfd] border-2 border-black p-2 hover:bg-[#39ff14] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all w-10"
                      title="Copy ID"
                    >
                      <Copy size={16} strokeWidth={3} />
                    </button>
                    {item.status === "DRAFT" && user?.role === "SITE_AGENT" ? (
                      <button
                        type="button"
                        onClick={() => void moveListing(item.id, "REVIEW")}
                        className="w-10 h-10 flex items-center justify-center bg-[#00e5ff] border-2 border-black"
                        title="Submit for review"
                      >
                        <Send size={16} strokeWidth={3} />
                      </button>
                    ) : null}
                    <Link
                      to={`/dashboard/listings/${item.id}/edit`}
                      className="flex-1 flex items-center justify-center bg-black text-white font-black uppercase text-sm border-2 border-transparent py-2 hover:bg-transparent hover:text-black hover:border-black transition-colors group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Manage
                      <ExternalLink size={16} className="ml-2" />
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
