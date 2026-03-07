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
        setError(
          err instanceof Error ? err.message : "Unable to compare listings",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [compareIds]);

  if (loading) {
    return (
      <div className="pt-28 px-6 max-w-7xl mx-auto">Loading comparison...</div>
    );
  }

  if (compareIds.length < 2) {
    return (
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <div className="glass rounded-[3rem] p-16 text-center max-w-3xl mx-auto mb-12">
          <div className="bg-blue-50 w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6">
            <ArrowRightLeft className="h-10 w-10 text-[#0a5ea8]" />
          </div>
          <h1 className="text-3xl font-black text-[#1a1a1a]">
            Pick at least two homes
          </h1>
          <p className="mt-4 text-gray-500 font-medium text-lg">
            Use the compare action on listing cards or detail pages to build a
            side-by-side view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            COMPARE HOMES
          </h1>
          <p className="mt-4 text-gray-500 font-medium text-lg">
            Check price, fit, availability, and lease details side by side.
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-3 font-bold transition-all shadow-sm"
        >
          Clear Compare
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 font-medium text-center">
          {error}
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="glass rounded-[2.5rem] overflow-hidden flex flex-col p-3"
            >
              <div className="rounded-[2rem] overflow-hidden mb-6 h-64 bg-gray-100 relative">
                <img
                  src={item.images[0]?.url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="px-4 pb-6 space-y-6 flex-1 flex flex-col">
                <div>
                  <h2 className="text-2xl font-black text-[#1a1a1a] leading-tight mb-2 line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="font-medium text-gray-500">
                    {item.city}, {item.state}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-700 border-y border-gray-100 py-6">
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Rent
                    </span>
                    <span className="font-bold">
                      INR {item.rentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Deposit
                    </span>
                    <span className="font-bold">
                      INR {item.deposit.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Type
                    </span>
                    <span className="font-bold line-clamp-1">
                      {formatEnumLabel(item.propertyType)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Furnish
                    </span>
                    <span className="font-bold line-clamp-1">
                      {formatEnumLabel(item.furnished)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Parking
                    </span>
                    <span className="font-bold line-clamp-1">
                      {formatEnumLabel(item.parking)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Tenant
                    </span>
                    <span className="font-bold line-clamp-1">
                      {formatEnumLabel(item.preferredTenantType)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Area
                    </span>
                    <span className="font-bold">{item.area} sqft</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">
                      Available
                    </span>
                    <span className="font-bold">
                      {new Date(item.availableFrom).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <p className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-wider">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.amenities.slice(0, 6).map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-blue-50 text-[#0a5ea8] px-3 py-1.5 text-xs font-bold rounded-xl"
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
