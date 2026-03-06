import { useState } from "react";
import { X, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { createInquiry } from "../../lib/api";
import type { ListingDetail, ListingSummary, SessionUser } from "../../types/listings";

const ContactAgentModal = ({
  isOpen,
  onClose,
  listing,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingSummary | ListingDetail;
  user: SessionUser | null;
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to contact the agent.");
      return;
    }

    try {
      setSending(true);
      setError(null);

      await createInquiry({
        subject: `Inquiry for ${listing.title}`,
        message,
        listingId: listing.id,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setMessage("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border-4 border-black rounded-[32px] w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className="w-16 h-16 bg-primary-blue/10 border-2 border-black rounded-2xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Send className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-black mb-2 leading-tight">
            CONTACT AGENT
          </h2>
          <p className="text-text-muted">
            Interested in{" "}
            <span className="font-bold text-black">{listing.title}</span>? Send
            a message to the agent.
          </p>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-16 h-16 text-[#39ff14] mb-4" />
            <h3 className="text-2xl font-black mb-2">Message Sent!</h3>
            <p className="text-text-muted">
              The site agent will get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!user && (
              <div className="p-4 bg-yellow-100 border-2 border-black rounded-2xl flex gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>You need to be logged in to send a message.</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wider">
                Your Message
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this property. Is it still available?"
                className="w-full h-40 p-5 bg-white border-2 border-black rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 p-3 rounded-xl border-2 border-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              disabled={sending || !user}
              type="submit"
              className="w-full bg-black text-white font-black py-4 rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,0,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(255,0,255,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3"
            >
              {sending ? (
                "SENDING..."
              ) : (
                <>
                  SEND MESSAGE
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactAgentModal;
