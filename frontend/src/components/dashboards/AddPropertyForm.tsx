import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { IKContext, IKUpload } from "imagekitio-react";
import { Upload, X } from "lucide-react";
import {
  createListing,
  fetchListing,
  updateListing,
  updateListingStatus,
} from "../../lib/api";
import {
  amenityOptions,
  facingOptions,
  furnishedOptions,
  listedByOptions,
  parkingOptions,
  petPolicyOptions,
  powerBackupOptions,
  preferredTenantOptions,
  propertyTypeOptions,
  ruleOptions,
  waterSupplyOptions,
} from "../../lib/listing-options";
import type {
  ListingDetail,
  ListingFormValues,
  ListingImage,
  SessionUser,
} from "../../types/listings";

type Props = {
  user: SessionUser | null;
  listingId?: string;
  onSuccess: (listingId: string) => void;
  onCancel: () => void;
};

const today = new Date().toISOString().slice(0, 10);

const emptyForm: ListingFormValues = {
  title: "",
  description: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  rentAmount: "",
  deposit: "",
  maintenanceAmount: "0",
  brokerageAmount: "0",
  bedrooms: "1",
  bathrooms: "1",
  balconies: "0",
  floorNumber: "",
  totalFloors: "",
  area: "",
  ageOfProperty: "",
  propertyType: "APARTMENT",
  furnished: "UNFURNISHED",
  preferredTenantType: "ANY",
  parking: "NONE",
  facing: "",
  listedBy: "AGENT",
  availableFor: "RENT",
  leaseDurationMonths: "",
  noticePeriodDays: "",
  petPolicy: "NOT_ALLOWED",
  waterSupply: "",
  powerBackup: "NONE",
  availableFrom: today,
  videoTourUrl: "",
  amenities: [],
  rules: [],
  nearbyLandmarks: [],
};

function splitTextRows(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toFormValues(listing: ListingDetail): ListingFormValues {
  return {
    title: listing.title,
    description: listing.description,
    address: listing.address,
    city: listing.city,
    state: listing.state,
    pincode: listing.pincode,
    rentAmount: String(listing.rentAmount),
    deposit: String(listing.deposit),
    maintenanceAmount: String(listing.maintenanceAmount),
    brokerageAmount: String(listing.brokerageAmount),
    bedrooms: String(listing.bedrooms),
    bathrooms: String(listing.bathrooms),
    balconies: String(listing.balconies),
    floorNumber:
      listing.floorNumber === null ? "" : String(listing.floorNumber),
    totalFloors:
      listing.totalFloors === null ? "" : String(listing.totalFloors),
    area: String(listing.area),
    ageOfProperty:
      listing.ageOfProperty === null ? "" : String(listing.ageOfProperty),
    propertyType: listing.propertyType,
    furnished: listing.furnished,
    preferredTenantType: listing.preferredTenantType,
    parking: listing.parking,
    facing: listing.facing ?? "",
    listedBy: listing.listedBy,
    availableFor: listing.availableFor,
    leaseDurationMonths:
      listing.leaseDurationMonths === null
        ? ""
        : String(listing.leaseDurationMonths),
    noticePeriodDays:
      listing.noticePeriodDays === null ? "" : String(listing.noticePeriodDays),
    petPolicy: listing.petPolicy,
    waterSupply: listing.waterSupply ?? "",
    powerBackup: listing.powerBackup,
    availableFrom: listing.availableFrom.slice(0, 10),
    videoTourUrl: listing.videoTourUrl ?? "",
    amenities: listing.amenities,
    rules: listing.rules,
    nearbyLandmarks: listing.nearbyLandmarks,
  };
}

export default function AddPropertyForm({
  user,
  listingId,
  onSuccess,
  onCancel,
}: Props) {
  const [formValues, setFormValues] = useState<ListingFormValues>(emptyForm);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [landmarksText, setLandmarksText] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(Boolean(listingId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [status, setStatus] = useState<string>("DRAFT");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Basic Details",
    "Financials",
    "Property Features",
    "Terms & Resources",
    "Media & Extras",
  ];

  const isEdit = Boolean(listingId);
  const isAdmin = user?.role === "ADMIN";
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!listingId) {
      return;
    }

    void (async () => {
      try {
        setLoading(true);
        const listing = await fetchListing(listingId);
        setFormValues(toFormValues(listing));
        setImages(listing.images);
        setLandmarksText(listing.nearbyLandmarks.join("\n"));
        setStatus(listing.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load listing");
      } finally {
        setLoading(false);
      }
    })();
  }, [listingId]);

  const payload = useMemo(
    () => ({
      ...formValues,
      nearbyLandmarks: splitTextRows(landmarksText),
      images,
    }),
    [formValues, landmarksText, images],
  );

  const setField = (
    field: keyof ListingFormValues,
    value: string | string[],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMulti = (field: "amenities" | "rules", value: string) => {
    setFormValues((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const authenticator = async () => {
    const response = await fetch(`${apiBaseUrl}/api/imagekit/auth`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Unable to authenticate image upload");
    }
    const data = await response.json();
    return {
      signature: data.signature as string,
      expire: data.expire as number,
      token: data.token as string,
    };
  };

  const onUploadError = () => {
    setUploadingImage(false);
    setError("Image upload failed. Try again.");
  };

  const onUploadSuccess = (result: { url: string }) => {
    setUploadingImage(false);
    setImages((prev) => [...prev, { url: result.url }]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (isEdit && listingId) {
        const response = await updateListing(listingId, payload);
        setStatus(response.listing.status);
        setSuccess("Listing updated successfully");
        onSuccess(response.listing.id);
      } else {
        const response = await createListing(payload);
        setStatus(response.listing.status);
        setSuccess("Draft listing created successfully");
        onSuccess(response.listing.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save listing");
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (
    nextStatus: "REVIEW" | "PUBLISHED" | "ARCHIVED",
  ) => {
    if (!listingId) {
      return;
    }
    try {
      setStatusLoading(true);
      setError("");
      const response = await updateListingStatus(listingId, nextStatus);
      setStatus(response.listing.status);
      setSuccess(`Listing moved to ${response.listing.status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-black flex items-center justify-center min-h-[400px] text-2xl animate-pulse">
        Loading listing...
      </div>
    );
  }

  const inputClass =
    "w-full border-2 border-black bg-white/40 backdrop-blur-md rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white/80 focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all";
  const selectClass =
    "w-full border-2 border-black bg-white/40 backdrop-blur-md rounded-xl p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white/80 transition-all cursor-pointer";
  const btnClass =
    "px-6 py-3 rounded-xl border-2 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all";

  return (
    <div className="bg-white/60 backdrop-blur-xl border-2 border-black/20 p-6 md:p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-[#ff00ff]/40 to-[#00e5ff]/40 backdrop-blur-md text-black inline-block px-5 py-2 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {isEdit ? "Edit Listing" : "Create Listing Draft"}
        </h2>
        <div className="text-sm font-black border-2 border-black px-4 py-2 bg-black/90 backdrop-blur-md text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,229,255,1)]">
          Status: {status}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {steps.map((step, idx) => (
          <button
            key={step}
            type="button"
            onClick={() => setCurrentStep(idx)}
            className={`flex-1 min-w-[140px] px-4 py-3 border-2 border-black rounded-xl font-black text-center text-sm transition-all ${
              currentStep === idx
                ? "bg-[#ff00ff]/90 text-white translate-y-[2px] translate-x-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : currentStep > idx
                  ? "bg-[#39ff14]/70 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#39ff14]/90 hover:-translate-y-[1px]"
                  : "bg-white/60 backdrop-blur-md text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white/90 hover:-translate-y-[1px]"
            }`}
          >
            {idx + 1}. {step}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-6 p-4 rounded-2xl border-2 border-black bg-[#ff00ff]/80 backdrop-blur-md text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mb-6 p-4 rounded-2xl border-2 border-black bg-[#39ff14]/80 backdrop-blur-md text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {success}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-10">
        {currentStep === 0 && (
          <div className="space-y-6 bg-white/30 p-6 md:p-8 rounded-3xl border border-white/50 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-black border-b-2 border-black/10 pb-2">
              Basic Details
            </h3>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <input
                  required
                  value={formValues.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Title"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <textarea
                  required
                  value={formValues.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Description"
                  rows={4}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <input
                  required
                  value={formValues.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Address"
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  required
                  value={formValues.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  required
                  value={formValues.state}
                  onChange={(e) => setField("state", e.target.value)}
                  placeholder="State"
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  required
                  value={formValues.pincode}
                  onChange={(e) => setField("pincode", e.target.value)}
                  placeholder="Pincode"
                  className={inputClass}
                />
              </div>
            </section>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 bg-white/30 p-6 md:p-8 rounded-3xl border border-white/50 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-black border-b-2 border-black/10 pb-2">
              Financials
            </h3>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Rent Amount
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formValues.rentAmount}
                  onChange={(e) => setField("rentAmount", e.target.value)}
                  placeholder="Rent"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">Deposit</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formValues.deposit}
                  onChange={(e) => setField("deposit", e.target.value)}
                  placeholder="Deposit"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Maintenance
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.maintenanceAmount}
                  onChange={(e) =>
                    setField("maintenanceAmount", e.target.value)
                  }
                  placeholder="Maintenance"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Brokerage
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.brokerageAmount}
                  onChange={(e) => setField("brokerageAmount", e.target.value)}
                  placeholder="Brokerage"
                  className={inputClass}
                />
              </div>
            </section>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 bg-white/30 p-6 md:p-8 rounded-3xl border border-white/50 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-black border-b-2 border-black/10 pb-2">
              Property Features
            </h3>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Property Type
                </label>
                <select
                  value={formValues.propertyType}
                  onChange={(e) => setField("propertyType", e.target.value)}
                  className={selectClass}
                >
                  {propertyTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Furnishing
                </label>
                <select
                  value={formValues.furnished}
                  onChange={(e) => setField("furnished", e.target.value)}
                  className={selectClass}
                >
                  {furnishedOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Preferred Tenant
                </label>
                <select
                  value={formValues.preferredTenantType}
                  onChange={(e) =>
                    setField("preferredTenantType", e.target.value)
                  }
                  className={selectClass}
                >
                  {preferredTenantOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">Parking</label>
                <select
                  value={formValues.parking}
                  onChange={(e) => setField("parking", e.target.value)}
                  className={selectClass}
                >
                  {parkingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block">Bedrooms</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formValues.bedrooms}
                  onChange={(e) => setField("bedrooms", e.target.value)}
                  placeholder="Bedrooms"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Bathrooms
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formValues.bathrooms}
                  onChange={(e) => setField("bathrooms", e.target.value)}
                  placeholder="Bathrooms"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Balconies
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.balconies}
                  onChange={(e) => setField("balconies", e.target.value)}
                  placeholder="Balconies"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Area (sqft)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formValues.area}
                  onChange={(e) => setField("area", e.target.value)}
                  placeholder="Area sqft"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block">
                  Floor Number
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.floorNumber}
                  onChange={(e) => setField("floorNumber", e.target.value)}
                  placeholder="Floor"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Total Floors
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.totalFloors}
                  onChange={(e) => setField("totalFloors", e.target.value)}
                  placeholder="Total Floors"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Age of Property (Yrs)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.ageOfProperty}
                  onChange={(e) => setField("ageOfProperty", e.target.value)}
                  placeholder="Age of Property"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">Facing</label>
                <select
                  value={formValues.facing}
                  onChange={(e) => setField("facing", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Facing</option>
                  {facingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 bg-white/30 p-6 md:p-8 rounded-3xl border border-white/50 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-black border-b-2 border-black/10 pb-2">
              Listing Terms & Resources
            </h3>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Listed By
                </label>
                <select
                  value={formValues.listedBy}
                  onChange={(e) => setField("listedBy", e.target.value)}
                  className={selectClass}
                >
                  {listedByOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Pet Policy
                </label>
                <select
                  value={formValues.petPolicy}
                  onChange={(e) => setField("petPolicy", e.target.value)}
                  className={selectClass}
                >
                  {petPolicyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Power Backup
                </label>
                <select
                  value={formValues.powerBackup}
                  onChange={(e) => setField("powerBackup", e.target.value)}
                  className={selectClass}
                >
                  {powerBackupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Water Supply
                </label>
                <select
                  value={formValues.waterSupply}
                  onChange={(e) => setField("waterSupply", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Water Supply</option>
                  {waterSupplyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Lease Duration (Months)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formValues.leaseDurationMonths}
                  onChange={(e) =>
                    setField("leaseDurationMonths", e.target.value)
                  }
                  placeholder="Lease months"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Notice Period (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formValues.noticePeriodDays}
                  onChange={(e) => setField("noticePeriodDays", e.target.value)}
                  placeholder="Notice days"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Available From
                </label>
                <input
                  type="date"
                  value={formValues.availableFrom}
                  onChange={(e) => setField("availableFrom", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold mb-1 block">
                  Video Tour URL
                </label>
                <input
                  value={formValues.videoTourUrl}
                  onChange={(e) => setField("videoTourUrl", e.target.value)}
                  placeholder="Video tour URL"
                  className={inputClass}
                />
              </div>
            </section>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="space-y-4">
                <p className="font-black uppercase text-lg border-b-2 border-black/10 pb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-3">
                  {amenityOptions.map((amenity) => (
                    <button
                      type="button"
                      key={amenity}
                      onClick={() => toggleMulti("amenities", amenity)}
                      className={`px-4 py-2 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        formValues.amenities.includes(amenity)
                          ? "bg-[#00e5ff] text-black"
                          : "bg-white/40 backdrop-blur-md hover:bg-white/80"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <p className="font-black uppercase text-lg border-b-2 border-black/10 pb-2">
                  Rules
                </p>
                <div className="flex flex-wrap gap-3">
                  {ruleOptions.map((rule) => (
                    <button
                      type="button"
                      key={rule}
                      onClick={() => toggleMulti("rules", rule)}
                      className={`px-4 py-2 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        formValues.rules.includes(rule)
                          ? "bg-[#39ff14] text-black"
                          : "bg-white/40 backdrop-blur-md hover:bg-white/80"
                      }`}
                    >
                      {rule}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <section className="space-y-4">
              <p className="font-black uppercase text-lg border-b-2 border-black/10 pb-2">
                Nearby Landmarks (one per line)
              </p>
              <textarea
                rows={4}
                value={landmarksText}
                onChange={(e) => setLandmarksText(e.target.value)}
                className={inputClass}
                placeholder="E.g. Nexus Mall, 2km away"
              />
            </section>

            <section className="space-y-4 bg-white/30 p-6 rounded-3xl border border-white/50 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black/10 pb-4">
                <p className="font-black uppercase text-lg">Media</p>
                <IKContext
                  publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || ""}
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || ""}
                  authenticator={authenticator}
                >
                  <label className="inline-flex items-center gap-2 px-5 py-2 border-2 border-black rounded-xl bg-[#ff00ff]/80 text-white font-black cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <Upload size={18} />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <IKUpload
                      className="hidden"
                      fileName="listing-image.jpg"
                      useUniqueFileName={true}
                      onUploadStart={() => setUploadingImage(true)}
                      onError={onUploadError}
                      onSuccess={onUploadSuccess}
                    />
                  </label>
                </IKContext>
              </div>

              {images.length === 0 ? (
                <div className="border-2 border-dashed border-black/30 rounded-2xl bg-white/40 backdrop-blur-md p-10 text-center text-sm font-bold text-black/60">
                  No images uploaded yet. Adding great photos helps rent faster!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className="relative group rounded-2xl border-2 border-black bg-white/40 backdrop-blur-md overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <img
                        src={image.url}
                        alt={`Listing media ${index + 1}`}
                        className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-3 right-3 p-2 rounded-xl border-2 border-black bg-white/80 backdrop-blur-md font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff00ff] hover:text-white transition-all"
                        aria-label={`Remove image ${index + 1}`}
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="flex flex-wrap gap-4 pt-8 border-t-4 border-black/10 justify-between items-center">
          <div className="flex gap-4">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
              className={`${btnClass} ${
                currentStep === 0
                  ? "opacity-50 cursor-not-allowed bg-black/5"
                  : "bg-white/60 backdrop-blur-md hover:bg-white"
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`${btnClass} bg-white/40 backdrop-blur-md hover:bg-white`}
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {isEdit && status === "DRAFT" && !isAdmin ? (
              <button
                type="button"
                disabled={statusLoading}
                onClick={() => void changeStatus("REVIEW")}
                className={`${btnClass} bg-[#00e5ff]/80 text-black hover:bg-[#00e5ff]`}
              >
                Submit For Review
              </button>
            ) : null}
            {isEdit && status === "REVIEW" && isAdmin ? (
              <button
                type="button"
                disabled={statusLoading}
                onClick={() => void changeStatus("PUBLISHED")}
                className={`${btnClass} bg-[#39ff14]/80 text-black hover:bg-[#39ff14]`}
              >
                Publish
              </button>
            ) : null}
            {isEdit && status === "PUBLISHED" && isAdmin ? (
              <button
                type="button"
                disabled={statusLoading}
                onClick={() => void changeStatus("ARCHIVED")}
                className={`${btnClass} bg-[#ff00ff]/80 text-white hover:bg-[#ff00ff]`}
              >
                Archive
              </button>
            ) : null}
            {isEdit ? (
              <Link
                to="/dashboard/listings"
                className={`${btnClass} bg-white/60 backdrop-blur-md hover:bg-white hidden sm:block`}
              >
                Back To Listings
              </Link>
            ) : null}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentStep((p) => Math.min(steps.length - 1, p + 1))
                }
                className={`${btnClass} bg-[#00e5ff]/90 text-black hover:bg-[#00e5ff]`}
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className={`${btnClass} bg-black text-white hover:bg-black/80`}
              >
                {submitting
                  ? "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : "Create Draft"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
