import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, XCircle } from "lucide-react";
import {
  fetchMyTickets,
  fetchAgentTickets,
  replyToTicket,
  updateTicketStatus,
} from "../../lib/api";
import type { SessionUser } from "../../types/listings";

type Author = {
  name: string | null;
  role: string;
  image: string | null;
};

type TicketMessage = {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  authorId: string;
};

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    name: string | null;
    email: string;
  };
  listing?: {
    id: string;
    title: string;
  };
  messages: TicketMessage[];
};

export default function TicketSystem({ user }: { user: SessionUser | null }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const isAgent = user?.role === "SITE_AGENT" || user?.role === "ADMIN";

  const fetchTicketsData = async () => {
    try {
      const data = isAgent ? await fetchAgentTickets() : await fetchMyTickets();
      setTickets(data);
    } catch (err: any) {
      console.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTicketsData();
  }, [user, isAgent]);

  const handleReplyRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedTicketId) return;

    setIsReplying(true);
    try {
      const newMessage = (await replyToTicket(
        selectedTicketId,
        replyContent,
      )) as TicketMessage;

      setTickets((prev) =>
        prev.map(
          (ticket): Ticket =>
            ticket.id === selectedTicketId
              ? {
                  ...ticket,
                  status: isAgent ? "IN_PROGRESS" : "OPEN",
                  messages: [...ticket.messages, newMessage],
                }
              : ticket,
        ),
      );
      setReplyContent("");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    try {
      await updateTicketStatus(ticketId, status);
      fetchTicketsData();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  if (loading)
    return (
      <div className="p-12 text-center font-black">Loading Tickets...</div>
    );

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-[700px] border border-gray-100 rounded-[2rem] overflow-hidden shadow-premium bg-white">
      {/* Sidebar */}
      <div className="lg:col-span-1 border-r border-gray-100 flex flex-col overflow-hidden bg-gray-50/50">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h3 className="font-black text-2xl text-[#1a1a1a] flex items-center gap-3">
            <MessageSquare
              size={24}
              className="text-[#0a5ea8]"
              strokeWidth={2.5}
            />
            Support
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 && (
            <div className="p-10 text-center font-bold italic opacity-40">
              No tickets yet.
            </div>
          )}
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTicketId(t.id)}
              className={`w-full text-left p-5 border-b border-gray-100/50 transition-all ${
                selectedTicketId === t.id
                  ? "bg-blue-50/50 border-l-4 border-l-[#0a5ea8]"
                  : "bg-transparent border-l-4 border-l-transparent hover:bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${
                    t.status === "OPEN"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : t.status === "IN_PROGRESS"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }`}
                >
                  {t.status}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-[#1a1a1a] leading-tight text-lg mb-1 truncate">
                {t.subject}
              </h4>
              <p className="text-sm font-medium text-gray-500 truncate">
                {isAgent
                  ? `From: ${t.tenant?.name || t.tenant?.email}`
                  : `Property: ${t.listing?.title || "General"}`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-2 flex flex-col overflow-hidden relative">
        {selectedTicket ? (
          <>
            <div className="p-6 lg:p-8 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-black mb-2 text-[#1a1a1a]">
                  {selectedTicket.subject}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>{" "}
                    Priority: {selectedTicket.priority}
                  </span>
                  {selectedTicket.listing && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>{" "}
                      Property: {selectedTicket.listing.title}
                    </span>
                  )}
                </div>
              </div>
              {isAgent && (
                <div className="flex gap-2 sm:shrink-0">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedTicket.id, "RESOLVED")
                    }
                    className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors shadow-sm"
                    title="Mark Resolved"
                  >
                    <CheckCircle size={22} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedTicket.id, "CLOSED")
                    }
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer"
                    title="Close Ticket"
                  >
                    <XCircle size={22} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gray-50/30">
              {selectedTicket.messages.map((m) => {
                const isMe = m.authorId === user?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-5 shadow-sm ${isMe ? "bg-[#0a5ea8] text-white rounded-2xl rounded-tr-sm" : "bg-white border border-gray-100 rounded-2xl rounded-tl-sm"}`}
                    >
                      <p
                        className={`font-medium whitespace-pre-wrap leading-relaxed ${isMe ? "text-white/90" : "text-gray-700"}`}
                      >
                        {m.content}
                      </p>
                      <div
                        className={`mt-3 flex justify-between items-center gap-6 pt-3 border-t max-w-full ${isMe ? "border-white/10" : "border-gray-50"}`}
                      >
                        <span
                          className={`text-xs font-bold uppercase tracking-wider truncate ${isMe ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {m.author.name || m.author.role}
                        </span>
                        <span
                          className={`text-xs font-medium whitespace-nowrap ${isMe ? "text-blue-200" : "text-gray-400"}`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 md:p-6 border-t border-gray-100 bg-white">
              <form onSubmit={handleReplyRequest} className="flex gap-3">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Ask a question or provide an update..."
                  className="flex-1 border border-gray-200 p-4 rounded-xl font-medium focus-ring bg-gray-50 outline-none transition-colors hover:bg-gray-50/80"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyContent.trim()}
                  className="bg-[#0a5ea8] text-white px-6 md:px-8 font-bold rounded-xl shadow-sm hover:bg-[#084d8a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isReplying ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
            <div className="w-24 h-24 mb-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-300">
              <MessageSquare size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black mb-3 text-[#1a1a1a]">
              Select a conversation
            </h2>
            <p className="font-medium text-gray-500 max-w-sm">
              Click on any ticket in the sidebar to view details and reply to
              messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
