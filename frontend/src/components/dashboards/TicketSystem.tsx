import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, XCircle, Send } from "lucide-react";
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
      // Auto-select first ticket if none selected
      if (data.length > 0 && !selectedTicketId) {
        setSelectedTicketId(data[0].id);
      }
    } catch (err: any) {
      console.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTicketsData();
  }, [user?.id, isAgent]);

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
      <div className="p-12 text-center font-black animate-pulse">
        Loading Conversations...
      </div>
    );

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0 h-[750px] border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white animate-in fade-in duration-700">
      {/* Sidebar - Hidden on mobile if a ticket is selected */}
      <div
        className={`lg:col-span-1 border-r border-gray-100 flex flex-col overflow-hidden bg-gray-50/50 transition-all ${selectedTicketId ? "hidden lg:flex" : "flex"}`}
      >
        <div className="p-8 border-b border-gray-100 bg-white">
          <h3 className="font-black text-2xl text-[#1a1a1a] flex items-center justify-between">
            <span className="flex items-center gap-3">
              <MessageSquare
                size={24}
                className="text-[#0a5ea8]"
                strokeWidth={2.5}
              />
              Conversations
            </span>
            <span className="bg-blue-50 text-[#0a5ea8] text-xs px-2.5 py-1 rounded-lg">
              {tickets.length}
            </span>
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {tickets.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-50">
                <MessageSquare className="text-gray-200" />
              </div>
              <p className="font-bold text-gray-400 italic">No tickets yet.</p>
            </div>
          )}
          {tickets.map((t) => {
            const lastMessage = t.messages[t.messages.length - 1];
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`w-full text-left p-6 border-b border-gray-100/50 transition-all relative group ${
                  selectedTicketId === t.id
                    ? "bg-white border-l-4 border-l-[#0a5ea8] shadow-sm z-10"
                    : "bg-transparent border-l-4 border-l-transparent hover:bg-gray-100/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border tracking-tight ${
                      t.status === "OPEN"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : t.status === "IN_PROGRESS"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-green-50 text-green-700 border-green-100"
                    }`}
                  >
                    {t.status}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h4
                  className={`font-black tracking-tight leading-tight mb-1 truncate ${selectedTicketId === t.id ? "text-[#0a5ea8]" : "text-[#1a1a1a]"}`}
                >
                  {t.subject}
                </h4>
                <p className="text-xs font-bold text-gray-400 truncate mb-2">
                  {isAgent
                    ? `By: ${t.tenant?.name || t.tenant?.email}`
                    : `Property: ${t.listing?.title || "General"}`}
                </p>
                {lastMessage && (
                  <p className="text-xs text-gray-500 line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {lastMessage.author.name || lastMessage.author.role}:{" "}
                    {lastMessage.content}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`lg:col-span-2 flex flex-col overflow-hidden relative bg-white transition-all ${!selectedTicketId ? "hidden lg:flex" : "flex"}`}
      >
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-6 lg:px-8 lg:py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTicketId(null)}
                  className="lg:hidden p-2 -ml-2 hover:bg-gray-50 rounded-full text-gray-400"
                >
                  <XCircle size={24} />
                </button>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#1a1a1a] tracking-tight line-clamp-1">
                    {selectedTicket.subject}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${selectedTicket.status === "RESOLVED" ? "bg-green-500" : "bg-[#0a5ea8] animate-pulse"}`}
                    ></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {selectedTicket.status} • Priority{" "}
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>
              </div>

              {isAgent && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedTicket.id, "RESOLVED")
                    }
                    className="p-3 rounded-2xl bg-green-50 text-green-600 hover:bg-[#28a745] hover:text-white transition-all shadow-sm active:scale-95"
                    title="Mark Resolved"
                  >
                    <CheckCircle size={20} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedTicket.id, "CLOSED")
                    }
                    className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all shadow-sm active:scale-95"
                    title="Close Ticket"
                  >
                    <XCircle size={20} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-gray-50/20 scroll-smooth">
              {/* Timeline marker */}
              <div className="flex justify-center">
                <span className="px-4 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">
                  Conversation Started on{" "}
                  {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </span>
              </div>

              {selectedTicket.messages.map((m) => {
                const isMe = m.authorId === user?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[70%]`}
                    >
                      <div
                        className={`p-5 shadow-sm transition-all hover:shadow-md ${
                          isMe
                            ? "bg-[#1a1a1a] text-white rounded-[2rem] rounded-tr-sm"
                            : "bg-white border border-gray-100 rounded-[2rem] rounded-tl-sm"
                        }`}
                      >
                        <p
                          className={`text-sm md:text-base font-medium whitespace-pre-wrap leading-relaxed ${isMe ? "text-white/90" : "text-gray-700"}`}
                        >
                          {m.content}
                        </p>
                      </div>
                      <div
                        className={`mt-2 flex items-center gap-3 px-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                          {isMe
                            ? "Sent by You"
                            : m.author.name || m.author.role}
                        </span>
                        <span className="text-[10px] font-medium text-gray-300">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-8 border-t border-gray-100 bg-white">
              <form
                onSubmit={handleReplyRequest}
                className="relative flex items-center gap-4"
              >
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 border border-gray-200 p-5 pr-16 rounded-[1.5rem] font-bold text-[#1a1a1a] outline-none focus:border-[#0a5ea8] focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyContent.trim()}
                  className="absolute right-3 p-3 bg-[#0a5ea8] text-white rounded-xl shadow-lg hover:bg-[#084d8a] hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isReplying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} strokeWidth={2.5} />
                  )}
                </button>
              </form>
              <p className="mt-3 text-[10px] text-center font-bold text-gray-300 uppercase tracking-widest">
                Protected by MoveReady secure channel
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/20">
            <div className="w-32 h-32 mb-8 rounded-[2rem] bg-white flex items-center justify-center shadow-xl border border-gray-50 text-gray-100 animate-pulse">
              <MessageSquare size={64} strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-black mb-4 text-[#1a1a1a] tracking-tight">
              Select a conversation
            </h2>
            <p className="font-bold text-gray-400 max-w-sm leading-relaxed">
              Choose a message thread from the left to view the full dialogue
              and manage your inquiry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
