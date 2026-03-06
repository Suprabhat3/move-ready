import { useEffect, useState } from "react";
import { Copy, Eye, ExternalLink } from "lucide-react";

type Listing = {
  id: string;
  title: string;
  address: string;
  rentAmount: number;
  status: string;
  images: { url: string }[];
};

export default function AgentPropertiesGrid() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/listings/my-listings`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      setListings(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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
        <p>Error loading properties: {error}</p>
        <button
          onClick={fetchMyListings}
          className="mt-4 px-4 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-12 border-4 border-black border-dashed text-center bg-white shadow-brutal">
        <h3 className="text-2xl font-black uppercase text-text-muted">
          No Properties Yet
        </h3>
        <p className="mt-2 text-text-muted font-bold">
          Click "Add Property" to start managing your listings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <div
          key={item.id}
          className="bg-white border-4 border-black overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(57,255,20,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
        >
          {/* Image */}
          <div className="h-48 bg-black relative border-b-4 border-black overflow-hidden">
            {item.images && item.images.length > 0 ? (
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

          {/* Details */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-xl font-black text-black leading-tight mb-2 truncate">
              {item.title}
            </h3>
            <p className="text-text-muted font-bold text-sm truncate mb-4">
              {item.address}
            </p>

            <div className="mt-auto">
              <p className="text-2xl font-black text-black mb-4 inline-block bg-[#00e5ff] px-2 py-1 border-2 border-black -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ₹{item.rentAmount.toLocaleString()}
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
                <button className="flex-1 flex items-center justify-center bg-black text-white font-black uppercase text-sm border-2 border-transparent py-2 hover:bg-transparent hover:text-black hover:border-black transition-colors group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  View Details
                  <ExternalLink size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
