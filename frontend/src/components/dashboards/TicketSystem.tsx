import { useEffect, useState } from "react";
import {
  Send,
  User as UserIcon,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
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
  const [error, setError] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const isAgent = user?.role === "SITE_AGENT" || user?.role === "ADMIN";

  const fetchTicketsData = async () => {
    try {
      const data = isAgent ? await fetchAgentTickets() : await fetchMyTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px] border-4 border-black rounded-3xl overflow-hidden shadow-brutal bg-white">
      {/* Sidebar */}
      <div className="lg:col-span-1 border-r-4 border-black flex flex-col overflow-hidden bg-gray-50">
        <div className="p-6 border-b-4 border-black bg-[#39ff14]">
          <h3 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-2">
            <MessageSquare strokeWidth={3} />
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
              className={`w-full text-left p-5 border-b-2 border-black/10 transition-all hover:bg-white ${
                selectedTicketId === t.id
                  ? "bg-white border-l-8 border-[#ff00ff]"
                  : "border-l-8 border-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    t.status === "OPEN"
                      ? "bg-red-400"
                      : t.status === "IN_PROGRESS"
                        ? "bg-blue-400"
                        : "bg-green-400"
                  }`}
                >
                  {t.status}
                </span>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-black leading-tight text-lg mb-1">
                {t.subject}
              </h4>
              <p className="text-xs font-bold opacity-60 truncate">
                {isAgent
                  ? `From: ${t.tenant?.name || t.tenant?.email}`
                  : `Property: ${t.listing?.title || "General"}`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-2 flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            <div className="p-6 border-b-4 border-black bg-white flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black mb-1">
                  {selectedTicket.subject}
                </h2>
                <div className="flex gap-4 text-xs font-black uppercase tracking-widest opacity-60">
                  <span>Priority: {selectedTicket.priority}</span>
                  {selectedTicket.listing && (
                    <span>Property: {selectedTicket.listing.title}</span>
                  )}
                </div>
              </div>
              {isAgent && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedTicket.id, "RESOLVED")
                    }
                    className="p-2 border-2 border-black bg-[#39ff14] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedTicket.id, "CLOSED")
                    }
                    className="p-2 border-2 border-black bg-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f0f0f0]">
              {selectedTicket.messages.map((m) => {
                const isMe = m.authorId === user?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 border-4 border-black shadow-brutal ${isMe ? "bg-[#00e5ff] rounded-2xl rounded-tr-none" : "bg-white rounded-2xl rounded-tl-none"}`}
                    >
                      <p className="font-bold whitespace-pre-wrap">
                        {m.content}
                      </p>
                      <div className="mt-2 flex justify-between items-center gap-4 border-t-2 border-black/10 pt-2">
                        <span className="text-[10px] font-black uppercase tracking-tighter truncate">
                          {m.author.name || m.author.role}
                        </span>
                        <span className="text-[10px] font-bold opacity-40">
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t-4 border-black bg-white">
              <form onSubmit={handleReplyRequest} className="flex gap-4">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Ask a question or provide an update..."
                  className="flex-1 border-4 border-black p-4 font-bold focus:shadow-brutal transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyContent.trim()}
                  className="bg-black text-white px-8 font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,229,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  {isReplying ? "..." : "Send"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <Clock size={64} className="opacity-10 mb-6" />
            <h2 className="text-3xl font-black mb-2 opacity-20 uppercase italic">
              Select a conversation
            </h2>
            <p className="font-bold opacity-40 max-w-xs">
              Click on any ticket to view details and reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
