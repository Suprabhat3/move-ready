import {
  ArrowRightLeft,
  MapPin,
  BedDouble,
  Bath,
  Square,
  ChevronRight,
  MessageSquare,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
    <div className="group relative bg-white/60 backdrop-blur-xl border-2 border-black/20 rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.9)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col p-4">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden rounded-[1.8rem] border-2 border-black shadow-inner bg-black/5">
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-4 py-1.5 bg-[#ff00ff] text-white border-2 border-black rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {listing.furnished.replace("_", " ")}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 translate-y-1">
          <div className="bg-black/90 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl border-2 border-[#00e5ff] shadow-[4px_4px_0px_0px_rgba(0,229,255,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,229,255,1)] transition-all">
            <span className="text-2xl font-black">
              ₹{listing.rentAmount.toLocaleString()}
            </span>
            <span className="text-xs ml-1 font-bold opacity-60">/ mo</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 pt-6 pb-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-black leading-tight mb-2 group-hover:text-[#ff00ff] transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <div className="flex items-center text-black/50 gap-1.5 text-sm font-bold">
              <MapPin className="w-4 h-4 text-[#00e5ff]" />
              <span className="truncate">
                {listing.city}, {listing.state}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 py-5 border-y-2 border-black/5 mb-6">
          <div className="flex flex-col items-center gap-1.5">
            <div className="bg-black/5 p-2 rounded-lg">
              <BedDouble className="w-4 h-4 text-black" />
            </div>
            <span className="text-xs font-black uppercase text-black/60 tracking-wider text-center">
              {listing.bedrooms} Beds
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-x-2 border-black/5">
            <div className="bg-black/5 p-2 rounded-lg">
              <Bath className="w-4 h-4 text-black" />
            </div>
            <span className="text-xs font-black uppercase text-black/60 tracking-wider text-center">
              {listing.bathrooms} Baths
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="bg-black/5 p-2 rounded-lg">
              <Square className="w-4 h-4 text-black" />
            </div>
            <span className="text-xs font-black uppercase text-black/60 tracking-wider text-center">
              {listing.area} sqft
            </span>
          </div>
        </div>

        {/* Action Grid */}
        <div className="mt-auto space-y-4">
          {/* Secondary Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShortlist}
              className={`flex-1 h-14 flex items-center justify-center gap-2 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-black ${isShortlisted ? "bg-[#ff00ff] text-white" : "bg-white"}`}
            >
              <Heart
                className={`w-5 h-5 ${isShortlisted ? "fill-current" : ""}`}
              />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              type="button"
              disabled={!isCompared(listing.id) && compareIds.length >= 3}
              onClick={() => toggleCompare(listing.id)}
              className={`flex-1 h-14 flex items-center justify-center gap-2 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-black ${isCompared(listing.id) ? "bg-[#39ff14] text-black" : "bg-white"} disabled:opacity-30`}
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            <Link
              to={`/properties/${listing.id}`}
              className="h-14 w-14 flex items-center justify-center bg-black text-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 bg-[#00e5ff] text-black font-black py-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-lg"
          >
            <MessageSquare className="w-5 h-5" />
            Contact Agent
          </button>
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
