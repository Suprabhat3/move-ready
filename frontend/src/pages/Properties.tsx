import { useEffect, useState } from "react";
import { Filter, Home, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import PropertyCard from "../components/listings/PropertyCard";
import { fetchListings } from "../lib/api";
import {
  furnishedOptions,
  parkingOptions,
  propertyTypeOptions,
} from "../lib/listing-options";
import type { ListingListResponse, SessionUser } from "../types/listings";

const Properties = ({ user }: { user: SessionUser | null }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [response, setResponse] = useState<ListingListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchListings(Object.fromEntries(searchParams.entries()));
        setResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load listings");
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const goToPage = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(page));
    setSearchParams(nextParams);
  };

  const items = response?.items ?? [];
  const page = response?.page ?? 1;

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1
            className="text-4xl md:text-5xl font-black text-black tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FIND YOUR{" "}
            <span className="text-primary-blue underline decoration-4 underline-offset-8">
              NEXT HOME
            </span>
          </h1>
          <p className="text-text-muted text-lg max-w-xl">
            Browse premium properties managed by verified site agents. Send
            messages directly to agents for visits.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Simple Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search city, area..."
              value={searchParams.get("search") ?? ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all w-full md:w-64"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-5 h-5 z-10" />
            <select
              value={searchParams.get("propertyType") ?? ""}
              onChange={(e) => updateFilter("propertyType", e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all appearance-none cursor-pointer w-full md:w-48"
            >
              <option value="">All Property Types</option>
              {propertyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-6 gap-4 mb-8">
        <input
          value={searchParams.get("city") ?? ""}
          onChange={(e) => updateFilter("city", e.target.value)}
          placeholder="City"
          className="border-2 border-black rounded-xl px-4 py-3 font-bold bg-white"
        />
        <input
          value={searchParams.get("minRent") ?? ""}
          onChange={(e) => updateFilter("minRent", e.target.value)}
          type="number"
          min="0"
          placeholder="Min rent"
          className="border-2 border-black rounded-xl px-4 py-3 font-bold bg-white"
        />
        <input
          value={searchParams.get("maxRent") ?? ""}
          onChange={(e) => updateFilter("maxRent", e.target.value)}
          type="number"
          min="0"
          placeholder="Max rent"
          className="border-2 border-black rounded-xl px-4 py-3 font-bold bg-white"
        />
        <select
          value={searchParams.get("furnished") ?? ""}
          onChange={(e) => updateFilter("furnished", e.target.value)}
          className="border-2 border-black rounded-xl px-4 py-3 font-bold bg-white"
        >
          <option value="">Any furnishing</option>
          {furnishedOptions.map((option) => (
            <option key={option} value={option}>
              {option.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={searchParams.get("parking") ?? ""}
          onChange={(e) => updateFilter("parking", e.target.value)}
          className="border-2 border-black rounded-xl px-4 py-3 font-bold bg-white"
        >
          <option value="">Any parking</option>
          {parkingOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="border-2 border-black rounded-xl px-4 py-3 font-bold bg-white"
        >
          <option value="newest">Newest</option>
          <option value="rent-asc">Rent: Low to High</option>
          <option value="rent-desc">Rent: High to Low</option>
          <option value="available-soonest">Available Soonest</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 bg-black/5 animate-pulse border-2 border-black rounded-3xl"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border-4 border-black bg-[#ff00ff] text-white p-6 rounded-3xl font-bold">
          {error}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} user={user} />
            ))}
          </div>
          <div className="mt-10 flex items-center justify-between">
            <p className="font-bold text-text-muted">
              Showing page {page} of{" "}
              {Math.max(
                1,
                Math.ceil((response?.total ?? items.length) / (response?.pageSize ?? 9)),
              )}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="px-4 py-3 border-2 border-black rounded-xl font-black bg-white disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={!response?.hasMore}
                onClick={() => goToPage(page + 1)}
                className="px-4 py-3 border-2 border-black rounded-xl font-black bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-primary-blue/10 p-6 rounded-full border-2 border-black mb-6">
            <Home className="w-12 h-12 text-black" />
          </div>
          <h3 className="text-2xl font-black mb-2">No properties found</h3>
          <p className="text-text-muted">
            Try adjusting your search or filters to find more properties.
          </p>
        </div>
      )}
    </div>
  );
};

export default Properties;
