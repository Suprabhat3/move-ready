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
        const data = await fetchListings(
          Object.fromEntries(searchParams.entries()),
        );
        setResponse(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load listings",
        );
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

  const formatEnumLabel = (label: string) => {
    return label
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const items = response?.items ?? [];
  const page = response?.page ?? 1;

  return (
    <div className="pt-24 pb-20 px-6 max-w-[1400px] gap-10 mx-auto w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 bg-white/60 backdrop-blur-xl border-2 border-black/20 p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
        <div className="space-y-4">
          <h1
            className="text-4xl md:text-6xl font-black text-black tracking-tighter"
            style={{ fontFamily: "var(--font-display)" }}
          >
            DISCOVER YOUR <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-black/60">
                NEXT CHAPTER
              </span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-[#39ff14]/70 -z-10 -rotate-1"></span>
            </span>
          </h1>
          <p className="text-black/70 text-lg font-bold max-w-xl">
            Browse verified listings from premium agents. Luxury, comfort, and
            convenience, just a click away.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 items-center">
          {/* Simple Search */}
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search city, area..."
              value={searchParams.get("search") ?? ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md border-2 border-black rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all w-full"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 w-5 h-5 z-10" />
            <select
              value={searchParams.get("propertyType") ?? ""}
              onChange={(e) => updateFilter("propertyType", e.target.value)}
              className="pl-12 pr-8 py-4 bg-white/40 backdrop-blur-md border-2 border-black rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all appearance-none cursor-pointer w-full"
            >
              <option value="">All Types</option>
              {propertyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {formatEnumLabel(option)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
        <div className="col-span-1 lg:col-span-1">
          <input
            value={searchParams.get("city") ?? ""}
            onChange={(e) => updateFilter("city", e.target.value)}
            placeholder="City"
            className="w-full border-2 border-black rounded-2xl px-5 py-4 font-black bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
          />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <input
            value={searchParams.get("minRent") ?? ""}
            onChange={(e) => updateFilter("minRent", e.target.value)}
            type="number"
            min="0"
            placeholder="Min rent"
            className="w-full border-2 border-black rounded-2xl px-5 py-4 font-black bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
          />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <input
            value={searchParams.get("maxRent") ?? ""}
            onChange={(e) => updateFilter("maxRent", e.target.value)}
            type="number"
            min="0"
            placeholder="Max rent"
            className="w-full border-2 border-black rounded-2xl px-5 py-4 font-black bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
          />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <select
            value={searchParams.get("furnished") ?? ""}
            onChange={(e) => updateFilter("furnished", e.target.value)}
            className="w-full border-2 border-black rounded-2xl px-5 py-4 font-black bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none cursor-pointer"
          >
            <option value="">Any furnishing</option>
            {furnishedOptions.map((option) => (
              <option key={option} value={option}>
                {formatEnumLabel(option)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1 lg:col-span-1">
          <select
            value={searchParams.get("parking") ?? ""}
            onChange={(e) => updateFilter("parking", e.target.value)}
            className="w-full border-2 border-black rounded-2xl px-5 py-4 font-black bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none cursor-pointer"
          >
            <option value="">Any parking</option>
            {parkingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1 lg:col-span-1">
          <select
            value={searchParams.get("sort") ?? "newest"}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full border-2 border-black rounded-2xl px-5 py-4 font-black bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="rent-asc">Rent: Low to High</option>
            <option value="rent-desc">Rent: High to Low</option>
            <option value="available-soonest">Available Soon</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[500px] bg-white/60 backdrop-blur-md border-2 border-black/10 rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border-4 border-black bg-[#ff00ff]/90 backdrop-blur-md text-white p-10 rounded-[2rem] font-black text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-2xl">
          {error}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} user={user} />
            ))}
          </div>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/60 backdrop-blur-xl border-2 border-black/20 p-6 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
            <p className="font-black text-black/60 text-lg order-2 md:order-1">
              Page <span className="text-black">{page}</span> of{" "}
              <span className="text-black">
                {Math.max(
                  1,
                  Math.ceil(
                    (response?.total ?? items.length) /
                      (response?.pageSize ?? 9),
                  ),
                )}
              </span>
            </p>
            <div className="flex gap-4 order-1 md:order-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="px-6 py-4 border-2 border-black rounded-2xl font-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!response?.hasMore}
                onClick={() => goToPage(page + 1)}
                className="px-6 py-4 border-2 border-black rounded-full font-black bg-[#39ff14] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-30 transition-all px-10"
              >
                Next Step
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/60 backdrop-blur-xl border-2 border-black/20 rounded-[3rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.8)]">
          <div className="bg-[#00e5ff] p-8 rounded-3xl border-2 border-black mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Home className="w-16 h-16 text-black" />
          </div>
          <h3 className="text-4xl font-black mb-4">A Quiet Place...</h3>
          <p className="text-black/60 font-bold text-xl max-w-md">
            No properties matched your filters. Time to try a broader search!
          </p>
        </div>
      )}
    </div>
  );
};

export default Properties;
