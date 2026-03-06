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

  // Format currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleShortlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const response = await toggleShortlist(listing.id);
    setIsShortlisted(response.shortlisted);
  };

  return (
    <div className="group relative bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {listing.furnished.replace("_", " ")}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-black text-white px-4 py-2 rounded-xl border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xl font-black">
              {formatPrice(listing.rentAmount)}
            </span>
            <span className="text-xs ml-1 opacity-80">/ month</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-black leading-tight mb-1 group-hover:text-primary-blue transition-colors">
              {listing.title}
            </h3>
            <div className="flex items-center text-text-muted gap-1 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {listing.city}, {listing.state}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y-2 border-black/5 mb-6">
          <div className="flex flex-col items-center gap-1">
            <BedDouble className="w-4 h-4 text-primary-blue" />
            <span className="text-sm font-bold">{listing.bedrooms} Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x-2 border-black/5">
            <Bath className="w-4 h-4 text-primary-blue" />
            <span className="text-sm font-bold">{listing.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="w-4 h-4 text-primary-blue" />
            <span className="text-sm font-bold">{listing.area} sqft</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto space-y-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-blue text-white font-black py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Contact Agent
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShortlist}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 ${isShortlisted ? "fill-current" : ""}`}
              />
            </button>
            <button
              type="button"
              disabled={!isCompared(listing.id) && compareIds.length >= 3}
              onClick={() => toggleCompare(listing.id)}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
            <Link
              to={`/properties/${listing.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3 font-black"
            >
              View Details
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
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
