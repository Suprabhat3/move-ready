import { useEffect, useState } from "react";
import { Send, User as UserIcon, Calendar, MessageSquare } from "lucide-react";
import { API_BASE_URL } from "../../lib/api";

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
  tenant: {
    name: string | null;
    email: string;
  };
  messages: TicketMessage[];
};

export default function AgentTicketsView({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const API_URL = API_BASE_URL;

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/agent`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedTicketId) return;

    setIsReplying(true);
    try {
      const res = await fetch(
        `${API_URL}/api/tickets/${selectedTicketId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: replyContent }),
        },
      );

      if (!res.ok) throw new Error("Failed to send reply");

      const newMessage = await res.json();

      // Update local state to inject the new message
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === selectedTicketId
            ? {
                ...ticket,
                status:
                  ticket.status === "OPEN" ? "IN_PROGRESS" : ticket.status,
                messages: [...ticket.messages, newMessage],
              }
            : ticket,
        ),
      );

      setReplyContent("");
    } catch (err: any) {
      alert("Error sending reply: " + err.message);
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-12 h-12 border-4 border-black border-t-[#00e5ff] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border-4 border-black bg-[#ff00ff] text-white font-bold shadow-brutal">
        <p>Error: {error}</p>
        <button
          onClick={fetchTickets}
          className="mt-4 px-4 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-[700px] border border-gray-100 rounded-[2rem] overflow-hidden shadow-premium bg-white">
      {/* Sidebar: Ticket List */}
      <div className="lg:col-span-1 border-r border-gray-100 flex flex-col overflow-hidden bg-gray-50/50">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h3 className="font-black text-2xl text-[#1a1a1a] flex items-center gap-3">
            <MessageSquare
              size={24}
              className="text-[#0a5ea8]"
              strokeWidth={2.5}
            />
            Inbox
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="p-6 text-center text-text-muted font-bold">
              No tickets found.
            </div>
          ) : (
            <div className="">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left p-5 border-b border-gray-100/50 transition-all ${
                    selectedTicketId === ticket.id
                      ? "bg-blue-50/50 border-l-4 border-l-[#0a5ea8]"
                      : "bg-transparent border-l-4 border-l-transparent hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${
                        ticket.status === "OPEN"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : ticket.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span className="text-xs font-medium text-gray-400 flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#1a1a1a] truncate text-lg mb-1 leading-tight">
                    {ticket.subject}
                  </h4>
                  <p className="text-sm font-medium text-gray-500 truncate mt-2 flex items-center">
                    <UserIcon size={14} className="mr-1.5 text-gray-400" />
                    {ticket.tenant.name || ticket.tenant.email}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Area: Chat/Detail View */}
      <div className="lg:col-span-2 flex flex-col overflow-hidden relative">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="p-6 lg:p-8 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-2xl font-black text-[#1a1a1a] break-words mb-3">
                {selectedTicket.subject}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>{" "}
                  Priority: {selectedTicket.priority}
                </span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>{" "}
                  Tenant:{" "}
                  {selectedTicket.tenant.name || selectedTicket.tenant.email}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gray-50/30">
              {selectedTicket.messages.map((msg) => {
                const isMe = msg.authorId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-end gap-3 max-w-[85%]">
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0a5ea8] shrink-0 flex items-center justify-center font-bold text-sm">
                          {(msg.author.name || "T")[0]}
                        </div>
                      )}
                      <div
                        className={`p-5 shadow-sm ${
                          isMe
                            ? "bg-[#0a5ea8] text-white rounded-2xl rounded-tr-sm text-left"
                            : "bg-white border border-gray-100 rounded-2xl rounded-tl-sm text-left"
                        }`}
                      >
                        {/* If this is the first message from the tenant, treat it as the issue description */}
                        {!isMe && msg.id === selectedTicket.messages[0]?.id && (
                          <span className="text-xs uppercase font-bold tracking-wider bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 inline-block mb-3">
                            Original Request
                          </span>
                        )}
                        <p
                          className={`font-medium whitespace-pre-wrap break-words leading-relaxed ${isMe ? "text-white/90" : "text-gray-700"}`}
                        >
                          {msg.content}
                        </p>
                        <p
                          className={`text-xs font-medium mt-3 text-right ${isMe ? "text-blue-200" : "text-gray-400"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {isMe && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 shrink-0 flex items-center justify-center font-bold text-sm">
                          Me
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-white shrink-0">
              <form onSubmit={handleReply} className="flex gap-3">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border border-gray-200 p-4 rounded-xl font-medium focus-ring bg-gray-50 outline-none transition-colors hover:bg-gray-50/80"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyContent.trim()}
                  className="bg-[#0a5ea8] text-white px-6 md:px-8 font-bold rounded-xl shadow-sm hover:bg-[#084d8a] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
                >
                  <Send size={18} strokeWidth={2.5} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center bg-gray-50/30">
            <div className="w-24 h-24 mb-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-300">
              <MessageSquare size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-[#1a1a1a]">
              Select a Ticket
            </h3>
            <p className="mt-3 font-medium text-gray-500 max-w-sm">
              Choose a support ticket from the list on the left to view the
              conversation and reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
