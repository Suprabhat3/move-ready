import { useEffect, useState } from "react";
import { Send, User as UserIcon, Calendar, MessageSquare } from "lucide-react";

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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* Sidebar: Ticket List */}
      <div className="lg:col-span-1 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        <div className="p-4 border-b-4 border-black bg-[#39ff14]">
          <h3 className="font-black text-xl uppercase tracking-widest text-black flex items-center">
            <MessageSquare className="mr-2" strokeWidth={3} />
            Inbox
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#fdfdfd]">
          {tickets.length === 0 ? (
            <div className="p-6 text-center text-text-muted font-bold">
              No tickets found.
            </div>
          ) : (
            <div className="divide-y-4 divide-black">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left p-4 hover:bg-[#00e5ff]/20 transition-colors ${
                    selectedTicketId === ticket.id
                      ? "bg-[#00e5ff]/30 border-l-8 border-[#00e5ff]"
                      : "border-l-8 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-black uppercase text-white bg-black px-2 py-0.5 border-2 border-black flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(255,0,255,1)]">
                      {ticket.status}
                    </span>
                    <span className="text-xs font-bold text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-black text-black truncate text-lg">
                    {ticket.subject}
                  </h4>
                  <p className="text-sm font-bold text-gray-600 truncate mt-1 flex items-center">
                    <UserIcon size={14} className="mr-1" />
                    {ticket.tenant.name || ticket.tenant.email}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Area: Chat/Detail View */}
      <div className="lg:col-span-2 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="p-4 border-b-4 border-black bg-[#fdfdfd] shrink-0">
              <h2 className="text-2xl font-black text-black break-words mb-2">
                {selectedTicket.subject}
              </h2>
              <div className="flex items-center gap-4 text-sm font-bold">
                <span className="bg-[#ff00ff]/20 text-black px-3 py-1 border-2 border-black">
                  Priority: {selectedTicket.priority}
                </span>
                <span className="text-text-muted">
                  Tenant:{" "}
                  {selectedTicket.tenant.name || selectedTicket.tenant.email}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwdjhIOFYwSDB6bTQgNC4xbS00IG0wIDEuNW0tMS41LTEuNW0tMS41LTEuNW0tMS41LTEuNW0tMS41LTEuNSIgc3Ryb2tlPSIjZTllOWU5IiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8L3N2Zz4=')]">
              {selectedTicket.messages.map((msg) => {
                const isMe = msg.authorId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-[#39ff14] shrink-0 flex items-center justify-center font-black text-sm uppercase">
                          {(msg.author.name || "T")[0]}
                        </div>
                      )}
                      <div
                        className={`p-4 border-4 border-black ${
                          isMe
                            ? "bg-[#00e5ff] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] text-right"
                            : "bg-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left"
                        }`}
                      >
                        {/* If this is the first message from the tenant, treat it as the issue description */}
                        {!isMe && msg.id === selectedTicket.messages[0]?.id && (
                          <span className="text-xs uppercase font-black tracking-widest bg-[#ff00ff] text-white px-2 py-0.5 border-2 border-black inline-block mb-2">
                            Original Request
                          </span>
                        )}
                        <p className="font-bold whitespace-pre-wrap break-words text-black">
                          {msg.content}
                        </p>
                        <p className="text-[10px] font-bold mt-2 text-black/60 uppercase tracking-widest">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {isMe && (
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-black shrink-0 flex items-center justify-center font-black text-sm uppercase text-[#00e5ff]">
                          Me
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t-4 border-black bg-white shrink-0">
              <form onSubmit={handleReply} className="flex gap-4">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border-4 border-black p-4 bg-[#fdfdfd] focus:bg-[#39ff14]/10 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyContent.trim()}
                  className="px-6 border-4 border-black bg-black text-white hover:bg-[#ff00ff] hover:text-black font-black uppercase tracking-widest disabled:opacity-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,229,255,1)] hover:shadow-[-2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center"
                >
                  <Send className="mr-2" size={20} strokeWidth={3} />
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-6 text-center">
            <MessageSquare
              size={64}
              className="opacity-20 mb-4 text-black"
              strokeWidth={1}
            />
            <h3 className="text-2xl font-black text-black">Select a Ticket</h3>
            <p className="mt-2 font-bold max-w-sm">
              Choose a support ticket from the list on the left to view the
              conversation and reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
