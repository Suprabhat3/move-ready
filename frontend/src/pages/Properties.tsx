import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Home, MessageSquare } from "lucide-react";
import PropertyCard from "../components/listings/PropertyCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Properties = ({ user }: { user: any }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/listings`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" ||
      listing.furnished.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all w-full md:w-64"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-5 h-5 z-10" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all appearance-none cursor-pointer w-full md:w-48"
            >
              <option value="all">All Types</option>
              <option value="FURNISHED">Furnished</option>
              <option value="SEMI_FURNISHED">Semi-Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
            </select>
          </div>
        </div>
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
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <PropertyCard key={listing.id} listing={listing} user={user} />
          ))}
        </div>
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
