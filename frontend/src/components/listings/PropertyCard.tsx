import {
  ArrowRightLeft,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import ContactAgentModal from "./ContactAgentModal";
import { toggleShortlist } from "../../lib/api";
import { useCompare } from "./CompareContext";
import type { ListingSummary, SessionUser } from "../../types/listings";

const PropertyCard = ({
  listing,
  user,
}: {
  listing: ListingSummary;
  user: SessionUser | null;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const navigate = useNavigate();
  const { isCompared, toggleCompare, compareIds } = useCompare();
  const mainImage =
    listing.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800";

  const handleShortlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const response = await toggleShortlist(listing.id);
    setIsShortlisted(response.shortlisted);
  };

  return (
    <div
      onClick={() => navigate(`/properties/${listing.id}`)}
      className="group relative bg-white rounded-[2rem] border-2 border-gray-100 hover:border-[#0a5ea8]/20 transition-all duration-300 h-full flex flex-col p-4 cursor-pointer shadow-sm hover:shadow-xl"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden rounded-[1.5rem] shadow-sm bg-gray-100">
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-4 py-1.5 bg-[#0a5ea8] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
            {listing.furnished.replace("_", " ")}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 translate-y-1">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-premium border border-white/50 text-[#1a1a1a]">
            <span className="text-xl font-black">
              ₹{listing.rentAmount.toLocaleString()}
            </span>
            <span className="text-xs ml-1 font-bold text-gray-500">/ mo</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 pt-5 pb-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#1a1a1a] leading-tight mb-2 group-hover:text-[#0a5ea8] transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <div className="flex items-center text-gray-500 gap-1.5 text-sm font-medium">
              <MapPin className="w-4 h-4 text-[#28a745]" />
              <span className="truncate">
                {listing.city}, {listing.state}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100 mb-6">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-blue-50 p-2 rounded-xl">
              <BedDouble className="w-4 h-4 text-[#0a5ea8]" />
            </div>
            <span className="text-xs font-bold text-gray-500 tracking-wide text-center">
              {listing.bedrooms} Beds
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-100">
            <div className="bg-green-50 p-2 rounded-xl">
              <Bath className="w-4 h-4 text-[#28a745]" />
            </div>
            <span className="text-xs font-bold text-gray-500 tracking-wide text-center">
              {listing.bathrooms} Baths
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-cyan-50 p-2 rounded-xl">
              <Square className="w-4 h-4 text-[#00acc1]" />
            </div>
            <span className="text-xs font-bold text-gray-500 tracking-wide text-center">
              {listing.area} sqft
            </span>
          </div>
        </div>

        <div className="mt-auto">
          {/* Secondary Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShortlist();
              }}
              className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border transition-all cursor-pointer font-bold duration-300 ${
                isShortlisted
                  ? "bg-[#d81b60] border-[#d81b60] text-white shadow-md hover:bg-[#ad144b]"
                  : "bg-pink-50 border-pink-100 text-[#d81b60] hover:bg-pink-100 hover:border-pink-200"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isShortlisted ? "fill-current" : ""}`}
              />
              <span>Save</span>
            </button>
            <button
              type="button"
              disabled={!isCompared(listing.id) && compareIds.length >= 3}
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(listing.id);
              }}
              className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border transition-all cursor-pointer font-bold duration-300 ${
                isCompared(listing.id)
                  ? "bg-[#0a5ea8] border-[#0a5ea8] text-white shadow-md hover:bg-[#084d8a]"
                  : "bg-blue-50 border-blue-100 text-[#0a5ea8] hover:bg-blue-100 hover:border-blue-200"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Compare</span>
            </button>
          </div>
        </div>
      </div>

      <ContactAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={listing}
        user={user}
      />
    </div>
  );
};

export default PropertyCard;
