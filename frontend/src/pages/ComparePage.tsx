import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { fetchCompare } from "../lib/api";
import { formatEnumLabel } from "../lib/listing-options";
import { useCompare } from "../components/listings/CompareContext";
import type { ListingDetail } from "../types/listings";

export default function ComparePage() {
  const { compareIds, clearCompare } = useCompare();
  const [items, setItems] = useState<ListingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (compareIds.length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        setLoading(true);
        const response = await fetchCompare(compareIds);
        setItems(
          response.items.filter((item): item is ListingDetail => Boolean(item)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to compare listings");
      } finally {
        setLoading(false);
      }
    })();
  }, [compareIds]);

  if (loading) {
    return <div className="pt-28 px-6 max-w-7xl mx-auto">Loading comparison...</div>;
  }

  if (compareIds.length < 2) {
    return (
      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
        <div className="border-4 border-black bg-white rounded-3xl p-12 text-center shadow-brutal">
          <ArrowRightLeft className="mx-auto mb-4 h-12 w-12" />
          <h1 className="text-3xl font-black">Pick at least two homes</h1>
          <p className="mt-3 text-text-muted font-bold">
            Use the compare action on listing cards or detail pages to build a
            side-by-side view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black">COMPARE HOMES</h1>
          <p className="mt-2 text-text-muted font-bold">
            Check price, fit, availability, and lease details side by side.
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="border-2 border-black bg-white px-4 py-3 font-black uppercase shadow-brutal hover-brutal"
        >
          Clear Compare
        </button>
      </div>

      {error ? (
        <div className="border-4 border-black bg-[#ff00ff] text-white p-4 font-bold">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="border-4 border-black rounded-3xl bg-white overflow-hidden shadow-brutal"
            >
              <img
                src={item.images[0]?.url}
                alt={item.title}
                className="h-56 w-full object-cover border-b-4 border-black"
              />
              <div className="p-6 space-y-5">
                <div>
                  <h2 className="text-2xl font-black">{item.title}</h2>
                  <p className="font-bold text-text-muted">
                    {item.city}, {item.state}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm font-bold">
                  <div>Rent: INR {item.rentAmount.toLocaleString()}</div>
                  <div>Deposit: INR {item.deposit.toLocaleString()}</div>
                  <div>Type: {formatEnumLabel(item.propertyType)}</div>
                  <div>Furnishing: {formatEnumLabel(item.furnished)}</div>
                  <div>Parking: {formatEnumLabel(item.parking)}</div>
                  <div>Tenant: {formatEnumLabel(item.preferredTenantType)}</div>
                  <div>Area: {item.area} sqft</div>
                  <div>Available: {new Date(item.availableFrom).toLocaleDateString()}</div>
                </div>
                <div>
                  <p className="text-xs uppercase font-black mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {item.amenities.slice(0, 6).map((amenity) => (
                      <span
                        key={amenity}
                        className="border-2 border-black px-2 py-1 text-xs font-bold bg-[#00e5ff]/15"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
