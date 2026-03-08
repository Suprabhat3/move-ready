import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { ListingSummary } from "../types/listings";
import { getWishlist, removeFromWishlist } from "../lib/wishlist-store";
import {
  Heart,
  MapPin,
  BedDouble,
  Building2,
  Square,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { formatEnumLabel } from "../lib/listing-options";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<ListingSummary[]>([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <span>Your Collection</span>
            <span className="text-gray-300">•</span>
            <span className="text-[#28a745]">
              {wishlist.length} Items Saved
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] tracking-tight">
            My Wishlist
          </h1>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-xl border border-gray-100 animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="w-12 h-12 text-[#d81b60] opacity-20" />
          </div>
          <h2 className="text-3xl font-black text-[#1a1a1a] mb-4">
            No properties saved yet
          </h2>
          <p className="text-lg text-gray-500 font-medium mb-10 max-w-md mx-auto">
            Explore our curated listings and heart your favorites to see them
            here!
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-3 bg-[#0a5ea8] text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            Explore Properties <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((item) => (
            <Link
              key={item.id}
              to={`/properties/${item.id}`}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.images[0]?.url || "/placeholder-property.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/95 backdrop-blur-md text-[#1a1a1a] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {formatEnumLabel(item.propertyType)}
                  </span>
                </div>
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-md text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-lg active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Monthly Rent
                      </p>
                      <p className="text-xl font-black text-[#1a1a1a]">
                        ₹{item.rentAmount.toLocaleString()}
                        <span className="text-xs text-gray-400 font-bold">
                          /mo
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Deposit
                      </p>
                      <p className="font-bold text-gray-700">
                        ₹{item.deposit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-[#1a1a1a] mb-2 line-clamp-1 group-hover:text-[#0a5ea8] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                    <MapPin className="w-4 h-4 text-[#28a745]" />
                    <span className="text-sm truncate">
                      {item.address}, {item.city}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col items-center">
                    <BedDouble className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-sm font-black">{item.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Building2 className="w-5 h-5 text-green-500 mb-1" />
                    <span className="text-sm font-black">{item.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Square className="w-5 h-5 text-cyan-500 mb-1" />
                    <span className="text-[10px] font-black">
                      {item.area} sqft
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
