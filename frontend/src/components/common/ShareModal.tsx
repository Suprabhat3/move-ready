import { X, Copy, Facebook, Twitter, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-6 h-6 text-blue-400" />,
      url: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-6 h-6 text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Email",
      icon: <Mail className="w-6 h-6 text-gray-600" />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <h3 className="text-2xl font-black text-[#1a1a1a] mb-6">
          Share Property
        </h3>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-all shadow-sm">
                {link.icon}
              </div>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                {link.name}
              </span>
            </a>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
            Or Copy Link
          </p>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent text-sm font-medium text-gray-600 outline-none truncate"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Copy
                className={`w-4 h-4 ${copied ? "text-green-500" : "text-gray-600"}`}
              />
              <span className="text-xs font-bold text-gray-700">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
