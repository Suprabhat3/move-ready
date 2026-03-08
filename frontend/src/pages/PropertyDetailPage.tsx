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
  Sofa,
  Car,
  ShieldCheck,
  Check,
  Wind,
  Navigation,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { fetchListing, createVisitRequest } from "../lib/api";
import { formatEnumLabel } from "../lib/listing-options";
import type { ListingDetail, SessionUser } from "../types/listings";
import ContactAgentModal from "../components/listings/ContactAgentModal";
import { useCompare } from "../components/listings/CompareContext";
import ShareModal from "../components/common/ShareModal";
import { isInWishlist, toggleWishlistInStore } from "../lib/wishlist-store";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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
    if (!listing || listing.images.length <= 1 || isGalleryOpen) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % listing.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [listing, isGalleryOpen]);

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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0a5ea8] rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-500">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20 flex justify-center">
        <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-3xl font-bold text-center shadow-sm w-full max-w-2xl flex flex-col items-center">
          <Building2 className="w-16 h-16 mb-4 text-red-300" />
          <h2 className="text-2xl mb-2">Property Not Found</h2>
          <p className="font-normal text-red-500">
            {error ||
              "The property you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const handleShortlist = async () => {
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
        new Date(Date.now() + 86400000 * 2).toISOString(),
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

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % (listing?.images.length || 1));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? (listing?.images.length || 1) - 1 : prev - 1,
    );
  };

  const isFurnished = listing.furnished === "FULLY_FURNISHED";
  const hasParking = listing.parking !== "NONE";
  const formatInr = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="pt-24 min-h-screen bg-gray-50/50">
      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-6xl px-4 md:px-12 flex items-center justify-center h-[70vh]">
            <button
              onClick={prevImage}
              className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={listing.images[activeImageIndex]?.url}
              alt={`${listing.title} - Fullscreen View ${activeImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg"
            />

            <button
              onClick={nextImage}
              className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="mt-8 text-white/70 font-medium tracking-widest text-sm uppercase">
            {activeImageIndex + 1} / {listing.images.length}
          </div>

          <div className="mt-6 flex gap-3 overflow-x-auto max-w-full px-10 py-4 scrollbar-hide">
            {listing.images.map((img, idx) => (
              <button
                key={img.url}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-[3px] transition-all ${activeImageIndex === idx ? "border-white scale-110 shadow-lg shadow-black/50" : "border-transparent opacity-40 hover:opacity-100"}`}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Title Bar */}
        <div className="mb-8 pt-4">
          <div className="flex items-center gap-3 text-sm font-bold text-[#0a5ea8] mb-3 bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100">
            <span className="uppercase tracking-wider">
              {formatEnumLabel(listing.propertyType)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a5ea8]/40"></span>
            <span className="text-[#28a745]">
              For {formatEnumLabel(listing.availableFor)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a5ea8]/40"></span>
            <span className="text-gray-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {listing.city}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <h1 className="text-3xl md:text-5xl font-black text-[#1a1a1a] tracking-tight leading-tight max-w-3xl">
              {listing.title}
            </h1>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-semibold text-gray-700 hover:text-black"
                aria-label="Share property"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button
                onClick={handleShortlist}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl shadow-sm transition-all font-semibold ${wishlisted ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-black"}`}
              >
                <Heart
                  className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`}
                />
                {wishlisted ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Premium 16:9 Auto-playing Carousel */}
        <div className="relative mb-12 rounded-3xl overflow-hidden aspect-video bg-gray-100 group shadow-md">
          {listing.images.map((img, idx) => (
            <div
              key={img.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${
                activeImageIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              onClick={() => setIsGalleryOpen(true)}
            >
              <img
                src={img.url}
                alt={`${listing.title} - Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all" />
            </div>
          ))}

          {/* Left/Right Navigation Arrows */}
          <div className="absolute inset-y-0 left-4 flex items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {listing.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeImageIndex === idx
                    ? "w-8 h-2 bg-white shadow-md"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Expand Gallery Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsGalleryOpen(true);
            }}
            className="absolute top-5 right-5 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" /> Expand
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Summary Strip */}
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pb-8 border-b border-gray-200 text-lg sm:text-xl font-medium text-gray-800">
              <div className="flex items-center gap-2.5">
                <BedDouble className="w-6 h-6 text-gray-400" />
                <span>{listing.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Wind className="w-6 h-6 text-gray-400" />
                <span>{listing.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Square className="w-6 h-6 text-gray-400" />
                <span>{listing.area} sq.ft</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-6 h-6 text-gray-400" />
                <span>
                  Avail:{" "}
                  {new Date(listing.availableFrom).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" },
                  )}
                </span>
              </div>
            </div>

            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">
                About this property
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-normal whitespace-pre-wrap">
                {listing.description}
              </div>
            </section>

            {/* Feature Highlights Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#f0f9ff]/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 bg-blue-100/50 text-[#0a5ea8] rounded-xl shrink-0">
                  <Sofa className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Furnishing Status</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {isFurnished
                      ? "Fully furnished and ready to move in with complete sets."
                      : formatEnumLabel(listing.furnished)}
                  </p>
                </div>
              </div>
              <div className="bg-[#f0fdf4]/50 border border-green-100 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-3 bg-green-100/50 text-[#28a745] rounded-xl shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Parking Setup</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {hasParking
                      ? `Dedicated ${formatEnumLabel(listing.parking).toLowerCase()} parking available.`
                      : "No dedicated parking on premises."}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Detailed Info Grids */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
                Home Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Balconies</span>
                  <span className="font-semibold text-gray-900">
                    {listing.balconies}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Facing</span>
                  <span className="font-semibold text-gray-900">
                    {listing.facing ? formatEnumLabel(listing.facing) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Floor Level</span>
                  <span className="font-semibold text-gray-900">
                    {listing.floorNumber ?? "N/A"} of{" "}
                    {listing.totalFloors ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Preferred Tenant
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatEnumLabel(listing.preferredTenantType)}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
                Financials & Lease
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Security Deposit
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatInr(listing.deposit)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Maint. Charge
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatInr(listing.maintenanceAmount)}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Brokerage</span>
                  <span className="font-semibold text-gray-900">
                    {listing.brokerageAmount > 0
                      ? formatInr(listing.brokerageAmount)
                      : "No Brokerage"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Lease Terms</span>
                  <span className="font-semibold text-gray-900">
                    {listing.leaseDurationMonths
                      ? `${listing.leaseDurationMonths} months`
                      : "Flexible"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Notice Period
                  </span>
                  <span className="font-semibold text-gray-900">
                    {listing.noticePeriodDays
                      ? `${listing.noticePeriodDays} days`
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Pet Policy</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    {listing.petPolicy === "ALLOWED" && (
                      <PawPrint className="w-4 h-4 text-green-600" />
                    )}
                    {formatEnumLabel(listing.petPolicy)}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
                Amenities
              </h2>
              {listing.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#28a745]" />
                      <span className="text-gray-700 font-medium">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No specific amenities listed.
                </p>
              )}
            </section>

            <hr className="border-gray-200" />

            <div className="grid sm:grid-cols-2 gap-10">
              <section>
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-5">
                  House Rules
                </h2>
                {listing.rules.length > 0 ? (
                  <ul className="space-y-3">
                    {listing.rules.map((rule) => (
                      <li key={rule} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No particular rules mentioned.
                  </p>
                )}
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#1a1a1a] mb-5">
                  Location & Landmarks
                </h2>
                {listing.nearbyLandmarks.length > 0 ? (
                  <ul className="space-y-3">
                    {listing.nearbyLandmarks.map((landmark) => (
                      <li key={landmark} className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#0a5ea8] shrink-0 mt-0.5" />
                        <span className="text-gray-700">{landmark}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No nearby landmarks added.
                  </p>
                )}
              </section>
            </div>

            {/* Property Map Location */}
            {listing.lat !== null && listing.lng !== null && (
              <section className="space-y-6 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a]">
                      Location
                    </h2>
                    <p className="text-gray-500 font-medium">
                      Find the exact spot of your future home
                    </p>
                  </div>
                </div>

                <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-sm z-[1]">
                  <MapContainer
                    center={[listing.lat, listing.lng]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[listing.lat, listing.lng]} />
                  </MapContainer>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Navigation className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {listing.address}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                  >
                    Get Directions
                  </a>
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar - Sticky Price Card */}
          <div className="lg:col-span-4 relative mt-8 lg:mt-0">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
              <div className="pb-6 border-b border-gray-100">
                <span className="text-gray-500 font-semibold mb-1 block">
                  Monthly Rent
                </span>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-black text-gray-900 tracking-tight">
                    {formatInr(listing.rentAmount)}
                  </span>
                </div>
                {listing.maintenanceAmount === 0 && (
                  <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                    Maintenance Included
                  </span>
                )}
                <div className="text-sm text-gray-500 space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span className="font-semibold text-gray-900">
                      {formatInr(listing.deposit)}
                    </span>
                  </div>
                  {listing.brokerageAmount === 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Brokerage</span>
                      <span>Zero Brokerage</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="py-6 space-y-4">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-full bg-[#0a5ea8] hover:bg-[#084d8a] text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Contact Agent
                </button>

                {user?.role === "TENANT" && (
                  <button
                    onClick={handleRequestVisit}
                    disabled={isVisitRequestLoading}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 py-3.5 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isVisitRequestLoading
                      ? "Booking Visit..."
                      : "Schedule a Visit"}
                  </button>
                )}
              </div>

              <div className="pt-4 flex flex-col items-center border-t border-gray-100">
                <button
                  onClick={() => toggleCompare(listing.id)}
                  disabled={!isCompared(listing.id) && compareIds.length >= 3}
                  className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all ${isCompared(listing.id) ? "bg-[#1a1a1a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  {isCompared(listing.id) ? "In comparison" : "Add to compare"}
                </button>
                {compareIds.length > 0 && (
                  <span className="text-xs text-gray-400 mt-2">
                    {compareIds.length}/3 properties selected
                  </span>
                )}
              </div>

              <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold shadow-sm">
                  {formatEnumLabel(listing.listedBy)[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Listed By
                  </p>
                  <p className="font-bold text-gray-900">
                    {formatEnumLabel(listing.listedBy)}
                  </p>
                </div>
                <ShieldCheck className="w-5 h-5 text-green-500 ml-auto" />
              </div>
            </div>

            {/* Fraud warning or helpful tip */}
            <div className="mt-6 border border-yellow-200 bg-yellow-50 rounded-xl p-4 flex gap-3 text-sm text-yellow-800">
              <div className="shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p>
                Never transfer money without verifying the property and signing
                proper documents.
              </p>
            </div>
          </div>
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
