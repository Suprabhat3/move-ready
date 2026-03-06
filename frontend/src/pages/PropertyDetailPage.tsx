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
  Info
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { fetchListing, toggleShortlist } from "../lib/api";
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

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const data = await fetchListing(id);
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load property");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-3xl font-black animate-pulse bg-gradient-to-r from-[#ff00ff] to-[#00e5ff] text-transparent bg-clip-text">Loading property...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <div className="border-4 border-black bg-[#ff00ff]/90 backdrop-blur-md text-white p-8 rounded-3xl font-bold text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-2xl">
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

  const btnClass = "w-full px-6 py-4 rounded-xl border-2 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 text-lg";
  const pillClass = "border-2 border-black rounded-xl px-4 py-2 text-sm font-bold bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default";

  return (
    <div className="pt-28 px-6 max-w-[1400px] mx-auto pb-24 relative">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] items-start">
        <section className="space-y-10">
          
          {/* Images Section */}
          <div className="bg-white/60 backdrop-blur-xl border-2 border-black/20 p-4 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
            <div className="rounded-[1.5rem] overflow-hidden border-2 border-black relative group shadow-inner bg-black/5">
              <img
                src={listing.images[0]?.url}
                alt={listing.title}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <span className="bg-[#ff00ff] text-white font-black px-4 py-1.5 rounded-full border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {formatEnumLabel(listing.propertyType)}
                </span>
                <span className="bg-[#39ff14] text-black font-black px-4 py-1.5 rounded-full border-2 border-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  For {formatEnumLabel(listing.availableFor)}
                </span>
              </div>
            </div>
            
            {listing.images.length > 1 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {listing.images.slice(1, 4).map((image, i) => (
                  <div key={image.url} className={`${i === 2 ? 'hidden md:block' : ''} rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer`}>
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
          <div className="bg-white/60 backdrop-blur-xl border-2 border-black/20 p-6 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] space-y-10">
            
            {/* Header Info */}
            <div className="flex flex-col xl:flex-row items-start justify-between gap-6 pb-8 border-b-2 border-black/10">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-black leading-tight bg-gradient-to-r from-black to-black/70 text-transparent bg-clip-text">
                  {listing.title}
                </h1>
                <p className="mt-4 text-black/70 font-bold flex flex-wrap items-center gap-2 text-lg">
                  <span className="bg-[#00e5ff] p-1.5 rounded-lg border border-black text-black">
                    <MapPin className="h-5 w-5" />
                  </span>
                  {listing.address}, {listing.city}, {listing.state} {listing.pincode}
                </p>
              </div>
              
              <div className="bg-black/90 backdrop-blur-md text-white border-2 border-black rounded-2xl px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,229,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,229,255,1)] transition-all shrink-0">
                <p className="text-sm font-black text-[#00e5ff] uppercase tracking-widest mb-1">Rent Amount</p>
                <p className="text-4xl md:text-5xl font-black">
                  ₹{listing.rentAmount.toLocaleString()}
                </p>
                <p className="text-sm font-bold opacity-80 mt-1 flex justify-end">per month</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border-2 border-black rounded-2xl p-5 bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                <div className="bg-[#00e5ff] p-3 rounded-xl border-2 border-black mb-3 text-black">
                  <BedDouble className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-black text-black/60">Bedrooms</p>
                <p className="text-2xl font-black">{listing.bedrooms}</p>
              </div>
              <div className="border-2 border-black rounded-2xl p-5 bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                <div className="bg-[#39ff14] p-3 rounded-xl border-2 border-black mb-3 text-black">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-black text-black/60">Bathrooms</p>
                <p className="text-2xl font-black">{listing.bathrooms}</p>
              </div>
              <div className="border-2 border-black rounded-2xl p-5 bg-white/40 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                <div className="bg-[#ff00ff] p-3 rounded-xl border-2 border-black mb-3 text-white">
                  <Square className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-black text-black/60">Area</p>
                <p className="text-2xl font-black">{listing.area} <span className="text-lg">sqft</span></p>
              </div>
              <div className="border-2 border-black rounded-2xl p-5 bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                <div className="bg-white/20 p-3 rounded-xl border-2 border-white/50 mb-3 text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase font-black text-white/60">Available</p>
                <p className="text-xl font-black">
                  {new Date(listing.availableFrom).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/30 p-6 md:p-8 rounded-3xl border border-white/50 shadow-inner">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-[#ff00ff]" />
                About this property
              </h2>
              <p className="text-lg leading-relaxed font-medium text-black/80 whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Grids for Facts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-wide border-b-2 border-black/10 pb-2">Home Details</h2>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Furnishing</span>
                    <span className="font-bold">{formatEnumLabel(listing.furnished)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Parking</span>
                    <span className="font-bold">{formatEnumLabel(listing.parking)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Balconies</span>
                    <span className="font-bold">{listing.balconies}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Preferred Tenant</span>
                    <span className="font-bold">{formatEnumLabel(listing.preferredTenantType)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Facing / Floor</span>
                    <span className="font-bold text-right">
                      {listing.facing ? formatEnumLabel(listing.facing) : "N/A"} <br className="sm:hidden" /> <span className="hidden sm:inline">•</span> Floor {listing.floorNumber ?? "N/A"}/{listing.totalFloors ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-wide border-b-2 border-black/10 pb-2">Lease & Services</h2>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Deposit</span>
                    <span className="font-bold">₹{listing.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Maintenance</span>
                    <span className="font-bold">₹{listing.maintenanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Brokerage</span>
                    <span className="font-bold">₹{listing.brokerageAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60">Lease / Notice</span>
                    <span className="font-bold text-right">{listing.leaseDurationMonths ?? "Flexible"} mo <br className="sm:hidden" /> <span className="hidden sm:inline">•</span> {listing.noticePeriodDays ?? "N/A"} days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl border-2 border-black/10">
                    <span className="font-black text-black/60 flex items-center gap-1"><PawPrint className="w-4 h-4"/> Pet Policy</span>
                    <span className="font-bold">{formatEnumLabel(listing.petPolicy)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities & Lists */}
            <div className="pt-6 border-t-2 border-black/10">
              <h2 className="text-xl font-black uppercase tracking-wide mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {listing.amenities.map((amenity) => (
                  <span key={amenity} className={`${pillClass} border-black text-black hover:bg-[#00e5ff]`}>
                    {amenity}
                  </span>
                ))}
                {listing.amenities.length === 0 && <p className="text-black/50 font-bold italic">No specific amenities listed.</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t-2 border-black/10">
               <div>
                  <h2 className="text-xl font-black uppercase tracking-wide mb-4">House Rules</h2>
                  <ul className="space-y-3">
                    {listing.rules.map((rule) => (
                      <li key={rule} className="flex items-start gap-2 font-bold text-black/80">
                        <CheckCircle2 className="w-5 h-5 text-[#ff00ff] shrink-0 mt-0.5" />
                        {rule}
                      </li>
                    ))}
                    {listing.rules.length === 0 && <p className="text-black/50 font-bold italic">No house rules mentioned.</p>}
                  </ul>
               </div>
               <div>
                  <h2 className="text-xl font-black uppercase tracking-wide mb-4">Nearby Landmarks</h2>
                  <ul className="space-y-3">
                    {listing.nearbyLandmarks.map((landmark) => (
                      <li key={landmark} className="flex items-start gap-2 font-bold text-black/80">
                        <MapPin className="w-5 h-5 text-[#39ff14] shrink-0 mt-0.5" />
                        {landmark}
                      </li>
                    ))}
                     {listing.nearbyLandmarks.length === 0 && <p className="text-black/50 font-bold italic">No nearby landmarks added.</p>}
                  </ul>
               </div>
            </div>

          </div>
        </section>

        {/* Sidebar Actions */}
        <aside className="lg:sticky top-32 space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border-2 border-black/20 p-6 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden relative">
            
            {/* Playful top banner in sidebar */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#ff00ff] via-[#00e5ff] to-[#39ff14]"></div>
            
            <h2 className="text-2xl font-black mt-2 mb-6">Take the next step</h2>
            
            <div className="flex items-center gap-4 mb-8 bg-white/40 p-4 rounded-xl border-2 border-black/10 shadow-inner">
               <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black text-xl border-2 border-black">
                  {formatEnumLabel(listing.listedBy)[0]}
               </div>
               <div>
                  <p className="text-sm font-black text-black/60 uppercase">Listed By</p>
                  <p className="font-bold text-lg">{formatEnumLabel(listing.listedBy)}</p>
               </div>
            </div>

            <div className="space-y-5">
              <button
                onClick={() => setIsContactOpen(true)}
                className={`${btnClass} bg-[#00e5ff] text-black`}
              >
                Reach Out Now
              </button>
              <button
                onClick={handleShortlist}
                className={`${btnClass} ${listing.shortlisted ? 'bg-[#ff00ff] text-white' : 'bg-white/50 backdrop-blur-md text-black hover:bg-white'}`}
              >
                <Heart className={`h-6 w-6 ${listing.shortlisted ? 'fill-current' : ''}`} />
                {listing.shortlisted ? "Remove Shortlist" : "Save to Shortlist"}
              </button>
              <button
                onClick={() => toggleCompare(listing.id)}
                disabled={!isCompared(listing.id) && compareIds.length >= 3}
                className={`${btnClass} ${isCompared(listing.id) ? 'bg-black text-white' : 'bg-[#39ff14] text-black'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ArrowRightLeft className="h-6 w-6" />
                {isCompared(listing.id) ? "Remove Compare" : "Add to Compare"}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-black/10 text-center">
              <p className="text-sm font-bold text-black/60">
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
