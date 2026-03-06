import { useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { Plus, X, Upload } from "lucide-react";

export default function AddPropertyForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    rentAmount: "",
    deposit: "",
    bedrooms: "1",
    bathrooms: "1",
    area: "",
    furnished: "UNFURNISHED",
    availableFrom: new Date().toISOString().split("T")[0],
  });

  const [images, setImages] = useState<{ url: string; fileId: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // ImageKit handlers
  const authenticator = async () => {
    try {
      const response = await fetch(`${API_URL}/api/imagekit/auth`, {
        // Provide any credentials if needed, though getAuthenticationParameters usually doesn't require strict auth
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onUploadError = (err: any) => {
    console.error("Image upload error", err);
    setError("Failed to upload image. Please try again.");
    setUploadingImage(false);
  };

  const onUploadSuccess = (res: any) => {
    setImages((prev) => [...prev, { url: res.url, fileId: res.fileId }]);
    setUploadingImage(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Note: We aren't deleting from ImageKit here to conserve API calls, just removing from payload.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        images: images.map((img) => img.url),
      };

      const res = await fetch(`${API_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to create property");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white border-4 border-black p-6 md:p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
      <h2 className="text-2xl font-black uppercase tracking-widest bg-[#ff00ff] text-black inline-block px-3 py-1 border-2 border-black mb-6 transform -rotate-1">
        Add New Property
      </h2>

      {error && (
        <div className="mb-6 p-4 border-4 border-black bg-white shadow-brutal text-black font-bold">
          <p className="flex items-center text-red-600">
            <span className="text-xl mr-2">!</span> {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-black text-black uppercase tracking-wide mb-2">
              Property Title
            </label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-4 border-black p-3 bg-[#fdfdfd] focus:bg-[#39ff14] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black"
              placeholder="e.g. Sunny 2BHK in Downtown"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-black text-black uppercase tracking-wide mb-2">
              Description
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border-4 border-black p-3 bg-[#fdfdfd] focus:bg-[#00e5ff] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black resize-none"
              placeholder="Describe the property..."
            />
          </div>

          <div>
            <label className="block text-sm font-black text-black uppercase tracking-wide mb-2">
              Rent Amount (₹)
            </label>
            <input
              required
              type="number"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              min="0"
              className="w-full border-4 border-black p-3 bg-[#fdfdfd] focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black"
              placeholder="e.g. 25000"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-black uppercase tracking-wide mb-2">
              Security Deposit (₹)
            </label>
            <input
              required
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
              min="0"
              className="w-full border-4 border-black p-3 bg-[#fdfdfd] focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black"
              placeholder="e.g. 50000"
            />
          </div>
        </div>

        {/* Location Info */}
        <div className="p-4 border-4 border-black bg-black/5 rounded-xl space-y-4">
          <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#00e5ff]">
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border-4 border-black p-3 bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold mb-2 text-black placeholder-gray-500"
                placeholder="Full Address / Street Name"
              />
            </div>
            <input
              required
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border-4 border-black p-3 bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black"
              placeholder="City"
            />
            <input
              required
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border-4 border-black p-3 bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black"
              placeholder="State"
            />
            <input
              required
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full border-4 border-black p-3 bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-black"
              placeholder="Pincode"
            />
          </div>
        </div>

        {/* Features Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wide mb-1">
              Bedrooms
            </label>
            <input
              required
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="1"
              className="w-full border-4 border-black p-2 bg-white font-bold focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wide mb-1">
              Bathrooms
            </label>
            <input
              required
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="1"
              className="w-full border-4 border-black p-2 bg-white font-bold focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wide mb-1">
              Area (sq ft)
            </label>
            <input
              required
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              min="0"
              className="w-full border-4 border-black p-2 bg-white font-bold focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wide mb-1">
              Furnishing
            </label>
            <select
              name="furnished"
              value={formData.furnished}
              onChange={handleChange}
              className="w-full border-4 border-black p-2 bg-white font-bold focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
            >
              <option value="UNFURNISHED">Unfurnished</option>
              <option value="SEMI_FURNISHED">Semi-Furnished</option>
              <option value="FULLY_FURNISHED">Fully Furnished</option>
            </select>
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="p-6 border-4 border-black border-dashed bg-white">
          <label className="block text-sm font-black text-black uppercase tracking-wide mb-4">
            Property Images
          </label>

          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((img, idx) => (
              <div
                key={img.fileId}
                className="relative w-24 h-24 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
              >
                <img
                  src={img.url}
                  alt={`Upload ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-3 -right-3 bg-[#ff00ff] text-white border-2 border-black rounded-full p-1 shadow-brutal opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} strokeWidth={4} />
                </button>
              </div>
            ))}
          </div>

          <IKContext
            publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || ""}
            urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || ""}
            authenticator={authenticator}
          >
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border-4 border-black bg-[#39ff14] text-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50">
              <Upload className="mr-2" size={18} strokeWidth={3} />
              {uploadingImage ? "Uploading..." : "Upload Image"}
              <IKUpload
                fileName="property-image.jpg"
                tags={["property"]}
                useUniqueFileName={true}
                isPrivateFile={false}
                onUploadStart={() => setUploadingImage(true)}
                onError={onUploadError}
                onSuccess={onUploadSuccess}
                className="hidden"
              />
            </label>
          </IKContext>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-lg border-2 border-transparent hover:bg-white hover:text-black hover:border-black shadow-[8px_8px_0px_0px_rgba(0,229,255,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,229,255,1)] hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Creating Property..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
