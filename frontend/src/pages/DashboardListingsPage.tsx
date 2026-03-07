import AgentPropertiesGrid from "../components/dashboards/AgentPropertiesGrid";
import type { SessionUser } from "../types/listings";

export default function DashboardListingsPage({
  user,
}: {
  user: SessionUser | null;
}) {
  return (
    <div className="min-h-screen bg-bg-base pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a]">
              Listing Inventory
            </h1>
            <p className="mt-4 text-gray-500 font-medium text-lg">
              Manage drafts, review submissions, published homes, and archived
              stock.
            </p>
          </div>
        </div>
        <AgentPropertiesGrid user={user} />
      </div>
    </div>
  );
}
