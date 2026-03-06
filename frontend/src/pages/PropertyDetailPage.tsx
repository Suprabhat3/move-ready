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
    return <div className="pt-28 px-6 max-w-7xl mx-auto">Loading property...</div>;
  }

  if (error || !listing) {
    return (
      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
        <div className="border-4 border-black bg-[#ff00ff] text-white p-6 rounded-3xl font-bold">
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

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
      <div className="grid gap-10 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="space-y-6">
          <div className="border-4 border-black rounded-[2rem] overflow-hidden bg-white shadow-brutal">
            <img
              src={listing.images[0]?.url}
              alt={listing.title}
              className="w-full h-[420px] object-cover border-b-4 border-black"
            />
            {listing.images.length > 1 ? (
              <div className="grid grid-cols-3 gap-3 p-4 bg-[#fdfdfd]">
                {listing.images.slice(1, 4).map((image) => (
                  <img
                    key={image.url}
                    src={image.url}
                    alt={listing.title}
                    className="h-28 w-full object-cover border-2 border-black rounded-2xl"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-4 border-black rounded-[2rem] bg-white p-8 shadow-brutal space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase font-black text-primary-blue">
                  {formatEnumLabel(listing.propertyType)} • {formatEnumLabel(listing.listedBy)}
                </p>
                <h1 className="text-4xl font-black mt-2">{listing.title}</h1>
                <p className="mt-3 text-text-muted font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {listing.address}, {listing.city}, {listing.state} {listing.pincode}
                </p>
              </div>
              <div className="bg-black text-white border-4 border-black rounded-2xl px-5 py-4">
                <p className="text-3xl font-black">
                  INR {listing.rentAmount.toLocaleString()}
                </p>
                <p className="text-sm font-bold opacity-80">per month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-2 border-black rounded-2xl p-4 bg-[#00e5ff]/10">
                <BedDouble className="mb-2 h-5 w-5" />
                <p className="text-xs uppercase font-black">Bedrooms</p>
                <p className="text-xl font-black">{listing.bedrooms}</p>
              </div>
              <div className="border-2 border-black rounded-2xl p-4 bg-[#39ff14]/10">
                <Building2 className="mb-2 h-5 w-5" />
                <p className="text-xs uppercase font-black">Bathrooms</p>
                <p className="text-xl font-black">{listing.bathrooms}</p>
              </div>
              <div className="border-2 border-black rounded-2xl p-4 bg-[#ff00ff]/10">
                <Square className="mb-2 h-5 w-5" />
                <p className="text-xs uppercase font-black">Area</p>
                <p className="text-xl font-black">{listing.area} sqft</p>
              </div>
              <div className="border-2 border-black rounded-2xl p-4 bg-black text-white">
                <Calendar className="mb-2 h-5 w-5" />
                <p className="text-xs uppercase font-black">Available</p>
                <p className="text-lg font-black">
                  {new Date(listing.availableFrom).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-base leading-7 font-medium">{listing.description}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-black mb-3">Home Details</h2>
                <dl className="grid gap-2 text-sm font-bold">
                  <div>Furnishing: {formatEnumLabel(listing.furnished)}</div>
                  <div>Parking: {formatEnumLabel(listing.parking)}</div>
                  <div>Balconies: {listing.balconies}</div>
                  <div>Preferred Tenant: {formatEnumLabel(listing.preferredTenantType)}</div>
                  <div>Facing: {listing.facing ? formatEnumLabel(listing.facing) : "Not specified"}</div>
                  <div>Floor: {listing.floorNumber ?? "NA"} / {listing.totalFloors ?? "NA"}</div>
                </dl>
              </div>
              <div>
                <h2 className="text-lg font-black mb-3">Lease & Services</h2>
                <dl className="grid gap-2 text-sm font-bold">
                  <div>Deposit: INR {listing.deposit.toLocaleString()}</div>
                  <div>Maintenance: INR {listing.maintenanceAmount.toLocaleString()}</div>
                  <div>Brokerage: INR {listing.brokerageAmount.toLocaleString()}</div>
                  <div>Available For: {formatEnumLabel(listing.availableFor)}</div>
                  <div>Lease Duration: {listing.leaseDurationMonths ?? "Flexible"} months</div>
                  <div>Notice Period: {listing.noticePeriodDays ?? "Not specified"} days</div>
                  <div className="flex items-center gap-2">
                    <PawPrint className="h-4 w-4" />
                    {formatEnumLabel(listing.petPolicy)}
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="border-2 border-black rounded-full px-3 py-1 text-sm font-bold bg-[#00e5ff]/10"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black mb-3">Rules & Nearby</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm font-bold">
                  {listing.rules.map((rule) => (
                    <li key={rule}>• {rule}</li>
                  ))}
                </ul>
                <ul className="space-y-2 text-sm font-bold">
                  {listing.nearbyLandmarks.map((landmark) => (
                    <li key={landmark}>• {landmark}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="border-4 border-black rounded-[2rem] bg-white p-6 shadow-brutal">
            <h2 className="text-xl font-black mb-4">Take the next step</h2>
            <div className="space-y-3">
              <button
                onClick={() => setIsContactOpen(true)}
                className="w-full border-2 border-black bg-primary-blue text-white py-3 font-black rounded-2xl shadow-brutal hover-brutal"
              >
                Contact Agent
              </button>
              <button
                onClick={handleShortlist}
                className="w-full border-2 border-black bg-white py-3 font-black rounded-2xl shadow-brutal hover-brutal flex items-center justify-center gap-2"
              >
                <Heart className="h-4 w-4" />
                {listing.shortlisted ? "Remove from Shortlist" : "Save to Shortlist"}
              </button>
              <button
                onClick={() => toggleCompare(listing.id)}
                disabled={!isCompared(listing.id) && compareIds.length >= 3}
                className="w-full border-2 border-black bg-[#39ff14] py-3 font-black rounded-2xl shadow-brutal hover-brutal disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  {isCompared(listing.id) ? "Remove from Compare" : "Add to Compare"}
                </span>
              </button>
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
