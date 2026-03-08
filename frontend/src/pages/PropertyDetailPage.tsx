import { useEffect, useState } from "react";
import {
  ArrowRightLeft,
  BedDouble,
  Building2,
  Calendar,
  Heart,
  MapPin,
  PawPrint,
  Square,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Share2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { fetchListing, createVisitRequest } from "../lib/api";
import { formatEnumLabel } from "../lib/listing-options";
import type { ListingDetail, SessionUser } from "../types/listings";
import ContactAgentModal from "../components/listings/ContactAgentModal";
import { useCompare } from "../components/listings/CompareContext";
import ShareModal from "../components/common/ShareModal";
import { isInWishlist, toggleWishlistInStore } from "../lib/wishlist-store";

export default function PropertyDetailPage({
  user,
}: {
  user: SessionUser | null;
}) {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { isCompared, toggleCompare, compareIds } = useCompare();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isVisitRequestLoading, setIsVisitRequestLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (listing) {
      setWishlisted(isInWishlist(listing.id));
    }
  }, [listing]);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const data = await fetchListing(id);
        setListing(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load property",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-3xl font-black animate-pulse bg-gradient-to-r from-[#0a5ea8] to-[#28a745] text-transparent bg-clip-text">
          Loading property...
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-3xl font-bold text-center shadow-sm text-2xl">
          {error || "Property not found"}
        </div>
      </div>
    );
  }

  const handleShortlist = async () => {
    // We now use local wishlist as requested
    if (listing) {
      toggleWishlistInStore(listing);
      setWishlisted(isInWishlist(listing.id));
    }
  };

  const handleRequestVisit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setIsVisitRequestLoading(true);
      await createVisitRequest(
        listing.id,
        new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        "Interested in seeing this property.",
      );

      alert("Visit requested successfully! Check the Visits tab for updates.");
    } catch (error) {
      console.error("Visit request error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to request visit.",
      );
    } finally {
      setIsVisitRequestLoading(false);
    }
  };

  const pillClass =
    "bg-blue-50/80 text-[#0a5ea8] px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-default border-transparent backdrop-blur-sm";

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % (listing?.images.length || 1));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? (listing?.images.length || 1) - 1 : prev - 1,
    );
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50/30">
      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-6xl px-6 flex items-center justify-center">
            <button
              onClick={prevImage}
              className="absolute left-0 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <img
              src={listing.images[activeImageIndex]?.url}
              alt={`${listing.title} - Fullscreen View ${activeImageIndex + 1}`}
              className="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-lg"
            />

            <button
              onClick={nextImage}
              className="absolute right-0 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>

          <div className="mt-8 text-white font-medium">
            {activeImageIndex + 1} / {listing.images.length}
          </div>

          <div className="mt-6 flex gap-3 overflow-x-auto max-w-full px-10 py-4 scrollbar-hide">
            {listing.images.map((img, idx) => (
              <button
                key={img.url}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${activeImageIndex === idx ? "border-[#0a5ea8] scale-110" : "border-transparent opacity-50"}`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Breadcrumbs & Title Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
              <span>{formatEnumLabel(listing.propertyType)}</span>
              <span className="text-gray-300">•</span>
              <span className="text-[#28a745]">
                For {formatEnumLabel(listing.availableFor)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] tracking-tight">
              {listing.title}
            </h1>
            <p className="text-lg text-gray-500 font-medium flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#28a745]" />
              {listing.address}, {listing.city}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-600"
              aria-label="Share property"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <button
              onClick={handleShortlist}
              className={`p-3 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all ${wishlisted ? "bg-[#d81b60] border-[#d81b60] text-white" : "bg-white text-gray-600"}`}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={`w-6 h-6 ${wishlisted ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Cinematic Image Showcase */}
        <div className="relative group rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl bg-white p-2">
          <div className="relative aspect-video w-full rounded-[1.8rem] overflow-hidden bg-gray-100">
            <img
              src={listing.images[activeImageIndex]?.url}
              alt={listing.title}
              className="w-full h-full object-cover transition-all duration-700"
            />

            {/* Image Overlay Navigation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-y-0 left-4 flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="p-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="p-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Counter & Gallery Toggle */}
            <div className="absolute bottom-6 right-6 flex items-center gap-4">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-sm">
                {activeImageIndex + 1} / {listing.images.length}
              </div>
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="bg-white/95 hover:bg-white text-[#1a1a1a] px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" /> Expand Gallery
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] items-start">
          <section className="space-y-12">
            {/* Key Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: <BedDouble />,
                  label: "Bedrooms",
                  value: listing.bedrooms,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  icon: <Building2 />,
                  label: "Bathrooms",
                  value: listing.bathrooms,
                  color: "bg-green-50 text-green-600",
                },
                {
                  icon: <Square />,
                  label: "Lot Area",
                  value: `${listing.area} sqft`,
                  color: "bg-cyan-50 text-cyan-600",
                },
                {
                  icon: <Calendar />,
                  label: "Ready By",
                  value: new Date(listing.availableFrom).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" },
                  ),
                  color: "bg-purple-50 text-purple-600",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center text-center shadow-lg transition-all hover:shadow-xl"
                >
                  <div className={`p-4 rounded-2xl mb-4 ${item.color}`}>
                    {item.icon}
                  </div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="text-2xl font-black text-[#1a1a1a]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description Card */}
            <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-xl">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-[#1a1a1a]">
                <span className="w-2 h-8 bg-[#0a5ea8] rounded-full" />
                About this Oasis
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-xl leading-relaxed text-gray-600 font-medium whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Furnishing Status */}
              <div className="mt-12 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                  <div className="w-3 h-3 bg-[#0a5ea8] rounded-full animate-pulse" />
                  <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                    Status:
                  </span>
                  <span className="font-black text-[#1a1a1a]">
                    {formatEnumLabel(listing.furnished)}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                  <div className="w-3 h-3 bg-[#28a745] rounded-full" />
                  <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                    Parking:
                  </span>
                  <span className="font-black text-[#1a1a1a]">
                    {formatEnumLabel(listing.parking)}
                  </span>
                </div>
              </div>
            </div>

            {/* Grids for Facts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-100 pb-3 text-gray-800">
                  Home Details
                </h2>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">Furnishing</span>
                    <span className="font-black text-[#1a1a1a]">
                      {formatEnumLabel(listing.furnished)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">Parking</span>
                    <span className="font-black text-[#1a1a1a]">
                      {formatEnumLabel(listing.parking)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">Balconies</span>
                    <span className="font-black text-[#1a1a1a]">
                      {listing.balconies}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">
                      Preferred Tenant
                    </span>
                    <span className="font-black text-[#1a1a1a]">
                      {formatEnumLabel(listing.preferredTenantType)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">
                      Facing / Floor
                    </span>
                    <span className="font-black text-[#1a1a1a] text-right">
                      {listing.facing ? formatEnumLabel(listing.facing) : "N/A"}{" "}
                      <br className="sm:hidden" />{" "}
                      <span className="hidden sm:inline">•</span> Floor{" "}
                      {listing.floorNumber ?? "N/A"}/
                      {listing.totalFloors ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-100 pb-3 text-gray-800">
                  Lease & Services
                </h2>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">Deposit</span>
                    <span className="font-black text-[#1a1a1a]">
                      ₹{listing.deposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">Maintenance</span>
                    <span className="font-black text-[#1a1a1a]">
                      ₹{listing.maintenanceAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">Brokerage</span>
                    <span className="font-black text-[#1a1a1a]">
                      ₹{listing.brokerageAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500">
                      Lease / Notice
                    </span>
                    <span className="font-black text-[#1a1a1a] text-right">
                      {listing.leaseDurationMonths ?? "Flexible"} mo{" "}
                      <br className="sm:hidden" />{" "}
                      <span className="hidden sm:inline">•</span>{" "}
                      {listing.noticePeriodDays ?? "N/A"} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500 flex items-center gap-2">
                      <PawPrint className="w-4 h-4" /> Pet Policy
                    </span>
                    <span className="font-black text-[#1a1a1a]">
                      {formatEnumLabel(listing.petPolicy)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities & Lists */}
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold uppercase tracking-wide mb-6 text-gray-800">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {listing.amenities.map((amenity) => (
                  <span key={amenity} className={pillClass}>
                    {amenity}
                  </span>
                ))}
                {listing.amenities.length === 0 && (
                  <p className="text-gray-400 font-medium italic">
                    No specific amenities listed.
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-10 pt-8 border-t border-gray-100">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide mb-6 text-gray-800">
                  House Rules
                </h2>
                <ul className="space-y-4">
                  {listing.rules.map((rule) => (
                    <li
                      key={rule}
                      className="flex items-start gap-3 font-medium text-gray-700"
                    >
                      <CheckCircle2 className="w-6 h-6 text-[#28a745] shrink-0" />
                      {rule}
                    </li>
                  ))}
                  {listing.rules.length === 0 && (
                    <p className="text-gray-400 font-medium italic">
                      No house rules mentioned.
                    </p>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide mb-6 text-gray-800">
                  Nearby Landmarks
                </h2>
                <ul className="space-y-4">
                  {listing.nearbyLandmarks.map((landmark) => (
                    <li
                      key={landmark}
                      className="flex items-start gap-3 font-medium text-gray-700"
                    >
                      <MapPin className="w-5 h-5 text-[#0a5ea8] shrink-0 mt-0.5" />
                      {landmark}
                    </li>
                  ))}
                  {listing.nearbyLandmarks.length === 0 && (
                    <p className="text-gray-400 font-medium italic">
                      No nearby landmarks added.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </section>

          {/* Sidebar Actions */}
          <aside className="lg:sticky top-32 space-y-8">
            {/* Price Card */}
            <div className="glass overflow-hidden rounded-[2.5rem] shadow-2xl relative p-8">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0a5ea8] to-[#28a745]"></div>

              <div className="flex flex-col items-center justify-center pb-8 border-b border-gray-100 mb-8">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Monthly Rent
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-[#1a1a1a]">
                    ₹{listing.rentAmount.toLocaleString()}
                  </span>
                  <span className="text-gray-400 font-bold text-lg">/mo</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg uppercase">
                    Security: ₹{listing.deposit.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black bg-green-50 text-green-600 px-3 py-1 rounded-lg uppercase">
                    No Brokerage
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-full bg-[#0a5ea8] hover:bg-[#084d8a] text-white h-16 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Reach Out Agent
                </button>

                {user?.role === "TENANT" && (
                  <button
                    onClick={handleRequestVisit}
                    disabled={isVisitRequestLoading}
                    className="w-full bg-white border-2 border-[#0a5ea8] text-[#0a5ea8] hover:bg-blue-50 h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isVisitRequestLoading
                      ? "Booking..."
                      : "Schedule Site Visit"}
                  </button>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => toggleCompare(listing.id)}
                    disabled={!isCompared(listing.id) && compareIds.length >= 3}
                    className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl font-bold transition-all border ${isCompared(listing.id) ? "bg-[#1a1a1a] text-white border-transparent" : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"}`}
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                    {isCompared(listing.id) ? "Comparing" : "Compare"}
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-gray-50/80 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1a1a1a] font-black text-xl shadow-sm">
                  {formatEnumLabel(listing.listedBy)[0]}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Property Managed By
                  </p>
                  <p className="font-bold text-[#1a1a1a]">
                    {formatEnumLabel(listing.listedBy)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips or Landmarks in Sidebar */}
            <div className="bg-[#1a1a1a] rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <MapPin className="text-[#28a745]" /> Nearby Landmarks
              </h3>
              <div className="space-y-4">
                {listing.nearbyLandmarks.slice(0, 3).map((landmark) => (
                  <div
                    key={landmark}
                    className="flex gap-4 items-start pb-4 border-b border-white/10 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#28a745] mt-2 shrink-0" />
                    <p className="font-medium text-gray-300">{landmark}</p>
                  </div>
                ))}
                {listing.nearbyLandmarks.length === 0 && (
                  <p className="text-gray-500 italic">No landmarks specified</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={listing.title}
        url={window.location.href}
      />

      <ContactAgentModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        listing={listing!}
        user={user}
      />
    </div>
  );
}
