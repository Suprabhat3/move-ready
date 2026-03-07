import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { fetchShortlist } from "../lib/api";
import type { ListingSummary, SessionUser } from "../types/listings";
import PropertyCard from "../components/listings/PropertyCard";

export default function ShortlistPage({ user }: { user: SessionUser | null }) {
  const [items, setItems] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetchShortlist();
        setItems(response.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load shortlist",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1a1a1a]">
          YOUR SHORTLIST
        </h1>
        <p className="mt-4 text-gray-500 font-medium text-lg max-w-2xl">
          Keep your strongest options together and revisit them when you are
          ready to schedule the next step.
        </p>
      </div>

      {loading ? (
        <div className="h-40 glass rounded-3xl animate-pulse" />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 font-medium text-center">
          {error}
        </div>
      ) : items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((listing) => (
            <PropertyCard key={listing.id} listing={listing} user={user} />
          ))}
        </div>
      ) : (
        <div className="glass p-16 text-center rounded-[3rem] max-w-3xl mx-auto">
          <div className="bg-pink-50 w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-[#d81b60]" />
          </div>
          <h2 className="text-3xl font-black text-[#1a1a1a]">
            No shortlisted homes yet
          </h2>
          <p className="mt-4 text-gray-500 font-medium text-lg">
            Save the homes you like from the listings page to compare them
            later.
          </p>
        </div>
      )}
    </div>
  );
}
