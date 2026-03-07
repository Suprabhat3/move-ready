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
  Info,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { fetchListing, toggleShortlist, createVisitRequest } from "../lib/api";
import { formatEnumLabel } from "../lib/listing-options";
import type { ListingDetail, SessionUser } from "../types/listings";
import ContactAgentModal from "../components/listings/ContactAgentModal";
import { useCompare } from "../components/listings/CompareContext";

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
    if (!user) {
      navigate("/login");
      return;
    }

    const response = await toggleShortlist(listing.id);
    setListing((current) =>
      current ? { ...current, shortlisted: response.shortlisted } : current,
    );
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

  const btnClass =
    "w-full px-6 py-4 rounded-xl border font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-sm hover:shadow-md cursor-pointer duration-300";
  const pillClass =
    "bg-blue-50 text-[#0a5ea8] px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-default border-transparent";

  return (
    <div className="pt-28 px-6 max-w-[1400px] mx-auto pb-24 relative">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] items-start">
        <section className="space-y-10">
          {/* Images Section */}
          <div className="glass p-4 rounded-[2.5rem] shadow-sm">
            <div className="rounded-[2rem] overflow-hidden relative group bg-gray-100">
              <img
                src={listing.images[0]?.url}
                alt={listing.title}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <span className="bg-[#0a5ea8] text-white font-bold px-4 py-1.5 rounded-full text-sm uppercase shadow-md">
                  {formatEnumLabel(listing.propertyType)}
                </span>
                <span className="bg-[#28a745] text-white font-bold px-4 py-1.5 rounded-full text-sm uppercase shadow-md">
                  For {formatEnumLabel(listing.availableFor)}
                </span>
              </div>
            </div>

            {listing.images.length > 1 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {listing.images.slice(1, 4).map((image, i) => (
                  <div
                    key={image.url}
                    className={`${i === 2 ? "hidden md:block" : ""} rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:border-[#0a5ea8] transition-all cursor-pointer`}
                  >
                    <img
                      src={image.url}
                      alt={`${listing.title} view ${i + 2}`}
                      className="h-28 sm:h-32 w-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Details Main Container */}
          <div className="glass p-6 md:p-10 rounded-[2.5rem] shadow-sm space-y-10">
            {/* Header Info */}
            <div className="flex flex-col xl:flex-row items-start justify-between gap-6 pb-8 border-b border-gray-100">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-black leading-tight text-[#1a1a1a]">
                  {listing.title}
                </h1>
                <p className="mt-4 text-gray-500 font-medium flex flex-wrap items-center gap-2 text-lg">
                  <span className="text-[#28a745]">
                    <MapPin className="h-6 w-6" />
                  </span>
                  {listing.address}, {listing.city}, {listing.state}{" "}
                  {listing.pincode}
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-[2rem] px-8 py-6 shadow-premium flex flex-col items-center justify-center min-w-[220px] shrink-0">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Rent Amount
                </p>
                <p className="text-4xl md:text-5xl font-black text-[#0a5ea8]">
                  ₹{listing.rentAmount.toLocaleString()}
                </p>
                <p className="text-sm font-bold text-gray-400 mt-2">
                  per month
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl mb-3 text-[#0a5ea8]">
                  <BedDouble className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-bold text-gray-500">
                  Bedrooms
                </p>
                <p className="text-2xl font-black text-[#1a1a1a]">
                  {listing.bedrooms}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                <div className="bg-green-100 p-3 rounded-xl mb-3 text-[#28a745]">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-bold text-gray-500">
                  Bathrooms
                </p>
                <p className="text-2xl font-black text-[#1a1a1a]">
                  {listing.bathrooms}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                <div className="bg-cyan-100 p-3 rounded-xl mb-3 text-[#00acc1]">
                  <Square className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-bold text-gray-500">
                  Area
                </p>
                <p className="text-2xl font-black text-[#1a1a1a]">
                  {listing.area} <span className="text-lg">sqft</span>
                </p>
              </div>
              <div className="bg-[#0a5ea8] rounded-2xl p-5 border border-transparent shadow-md flex flex-col items-center text-center text-white">
                <div className="bg-white/20 p-3 rounded-xl mb-3 text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-bold text-blue-100">
                  Available
                </p>
                <p className="text-xl font-black">
                  {new Date(listing.availableFrom).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-blue-50/50 p-6 md:p-8 rounded-3xl border border-blue-100/50">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-[#1a1a1a]">
                <Info className="h-6 w-6 text-[#0a5ea8]" />
                About this property
              </h2>
              <p className="text-lg leading-relaxed font-medium text-gray-700 whitespace-pre-wrap">
                {listing.description}
              </p>
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
          </div>
        </section>

        {/* Sidebar Actions */}
        <aside className="lg:sticky top-32 space-y-6">
          <div className="glass p-6 md:p-8 rounded-[2.5rem] shadow-sm overflow-hidden relative">
            {/* Playful top banner in sidebar */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#0a5ea8] to-[#28a745]"></div>

            <h2 className="text-2xl font-black mt-2 mb-6 text-[#1a1a1a]">
              Take the next step
            </h2>

            <div className="flex items-center gap-4 mb-8 bg-gray-50 border border-gray-100 p-4 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-[#0a5ea8] rounded-full flex items-center justify-center text-white font-black text-xl">
                {formatEnumLabel(listing.listedBy)[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Listed By
                </p>
                <p className="font-black text-lg text-[#1a1a1a]">
                  {formatEnumLabel(listing.listedBy)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setIsContactOpen(true)}
                className={`${btnClass} bg-[#28a745] hover:bg-[#218838] text-white border-transparent`}
              >
                Reach Out Now
              </button>
              {user?.role === "TENANT" && (
                <button
                  onClick={handleRequestVisit}
                  disabled={isVisitRequestLoading}
                  className={`${btnClass} bg-[#0a5ea8] hover:bg-[#084d8a] text-white border-transparent disabled:opacity-50`}
                >
                  {isVisitRequestLoading
                    ? "Processing..."
                    : "Request Property Visit"}
                </button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShortlist}
                  className={`${btnClass} border-transparent text-sm px-2 ${listing.shortlisted ? "bg-[#d81b60] text-white hover:bg-[#ad144b]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <Heart
                    className={`h-5 w-5 ${listing.shortlisted ? "fill-current" : ""}`}
                  />
                  {listing.shortlisted ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => toggleCompare(listing.id)}
                  disabled={!isCompared(listing.id) && compareIds.length >= 3}
                  className={`${btnClass} border-transparent text-sm px-2 ${isCompared(listing.id) ? "bg-[#0a5ea8] text-white hover:bg-[#084d8a]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  {isCompared(listing.id) ? "Comparing" : "Compare"}
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm font-medium text-gray-500">
                Need help? Our support team is available 24/7 to assist you.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <ContactAgentModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        listing={listing}
        user={user}
      />
    </div>
  );
}
