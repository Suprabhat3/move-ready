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
    <div className="pt-32 pb-20 px-6 max-w-[1400px] gap-10 mx-auto w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 glass p-8 rounded-3xl">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight leading-tight">
            DISCOVER YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a5ea8] to-[#28a745]">
              NEXT CHAPTER
            </span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl">
            Browse verified listings from premium agents. Luxury, comfort, and
            convenience, just a click away.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Simple Search */}
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search city, area..."
              value={searchParams.get("search") ?? ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl font-medium shadow-sm focus-ring w-full text-[#1a1a1a]"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <select
              value={searchParams.get("propertyType") ?? ""}
              onChange={(e) => updateFilter("propertyType", e.target.value)}
              className="pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl font-medium shadow-sm focus-ring appearance-none cursor-pointer w-full text-[#1a1a1a]"
            >
              <option value="">All Types</option>
              {propertyTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {formatEnumLabel(option)}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
        <div className="col-span-1 lg:col-span-1">
          <input
            value={searchParams.get("city") ?? ""}
            onChange={(e) => updateFilter("city", e.target.value)}
            placeholder="City"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium shadow-sm outline-none focus-ring text-[#1a1a1a]"
          />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <input
            value={searchParams.get("minRent") ?? ""}
            onChange={(e) => updateFilter("minRent", e.target.value)}
            type="number"
            min="0"
            placeholder="Min rent"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium shadow-sm outline-none focus-ring text-[#1a1a1a]"
          />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <input
            value={searchParams.get("maxRent") ?? ""}
            onChange={(e) => updateFilter("maxRent", e.target.value)}
            type="number"
            min="0"
            placeholder="Max rent"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium shadow-sm outline-none focus-ring text-[#1a1a1a]"
          />
        </div>
        <div className="col-span-1 lg:col-span-1 relative">
          <select
            value={searchParams.get("furnished") ?? ""}
            onChange={(e) => updateFilter("furnished", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 font-medium shadow-sm outline-none focus-ring cursor-pointer appearance-none text-[#1a1a1a]"
          >
            <option value="">Any furnishing</option>
            {furnishedOptions.map((option) => (
              <option key={option} value={option}>
                {formatEnumLabel(option)}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="10"
              height="6"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-1 relative">
          <select
            value={searchParams.get("parking") ?? ""}
            onChange={(e) => updateFilter("parking", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 font-medium shadow-sm outline-none focus-ring cursor-pointer appearance-none text-[#1a1a1a]"
          >
            <option value="">Any parking</option>
            {parkingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="10"
              height="6"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-1 relative">
          <select
            value={searchParams.get("sort") ?? "newest"}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 font-medium shadow-sm outline-none focus-ring cursor-pointer appearance-none text-[#1a1a1a]"
          >
            <option value="newest">Newest First</option>
            <option value="rent-asc">Rent: Low to High</option>
            <option value="rent-desc">Rent: High to Low</option>
            <option value="available-soonest">Available Soon</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="10"
              height="6"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[500px] bg-white rounded-3xl border border-gray-100 shadow-sm"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-2xl font-medium text-center shadow-sm">
          {error}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {items.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} user={user} />
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass p-6 rounded-3xl shadow-sm">
            <p className="font-medium text-gray-500 order-2 md:order-1">
              Page <span className="text-[#1a1a1a] font-bold">{page}</span> of{" "}
              <span className="text-[#1a1a1a] font-bold">
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
                className="px-6 py-3 border border-gray-200 rounded-xl font-bold bg-white text-gray-700 shadow-sm hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!response?.hasMore}
                onClick={() => goToPage(page + 1)}
                className="px-6 py-3 border border-transparent rounded-xl font-bold bg-[#0a5ea8] text-white shadow-md hover:bg-[#084d8a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next Page
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[3rem] shadow-sm mb-12">
          <div className="bg-blue-50 p-6 rounded-3xl mb-6">
            <Home className="w-12 h-12 text-[#0a5ea8]" />
          </div>
          <h3 className="text-3xl font-black mb-4 text-[#1a1a1a]">
            No matches found
          </h3>
          <p className="text-gray-500 font-medium text-lg max-w-md">
            We couldn't find any properties matching your current filters. Try
            adjusting your search criteria!
          </p>
        </div>
      )}
    </div>
  );
};

export default Properties;
