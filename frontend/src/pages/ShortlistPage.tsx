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
        setError(err instanceof Error ? err.message : "Unable to load shortlist");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          YOUR SHORTLIST
        </h1>
        <p className="mt-3 text-text-muted font-bold max-w-2xl">
          Keep your strongest options together and revisit them when you are
          ready to schedule the next step.
        </p>
      </div>

      {loading ? (
        <div className="h-40 border-4 border-black rounded-3xl bg-white/70 animate-pulse" />
      ) : error ? (
        <div className="border-4 border-black rounded-3xl bg-[#ff00ff] text-white p-6 font-bold">
          {error}
        </div>
      ) : items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((listing) => (
            <PropertyCard key={listing.id} listing={listing} user={user} />
          ))}
        </div>
      ) : (
        <div className="border-4 border-black rounded-3xl bg-white p-12 text-center shadow-brutal">
          <Heart className="mx-auto mb-4 h-12 w-12" />
          <h2 className="text-2xl font-black">No shortlisted homes yet</h2>
          <p className="mt-2 text-text-muted font-bold">
            Save the homes you like from the listings page to compare them later.
          </p>
        </div>
      )}
    </div>
  );
}
