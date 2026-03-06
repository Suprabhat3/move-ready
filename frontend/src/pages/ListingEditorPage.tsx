import { useNavigate, useParams } from "react-router";
import AddPropertyForm from "../components/dashboards/AddPropertyForm";
import type { SessionUser } from "../types/listings";

export default function ListingEditorPage({
  user,
}: {
  user: SessionUser | null;
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <AddPropertyForm
          user={user}
          listingId={id}
          onSuccess={(listingId) => navigate(`/dashboard/listings/${listingId}/edit`)}
          onCancel={() => navigate("/dashboard/listings")}
        />
      </div>
    </div>
  );
}
