import { useState } from "react";
import axios from "axios";
import { X, Mail, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { addAdminCurrentIssue } from "@/store/issueSlice";

const IssueBookModal = ({ isOpen, onClose, bookId, onSuccess }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleIssueBook = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Student email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/issue/issue-book`,
        { email, bookId },
        { withCredentials: true }//here its store that issue book on the adin current issue
      );

      // ✅ Redux update
      dispatch(addAdminCurrentIssue(res.data.issue));

      // optional callback (refresh book, toast etc.)
      onSuccess && onSuccess();

      setEmail("");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to issue book"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-black text-zinc-900">
            Issue Book
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleIssueBook} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Student Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="email"
                placeholder="student@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm font-medium text-rose-500">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-black text-white hover:bg-amber-600 disabled:opacity-60"
            >
              {loading && (
                <Loader2 size={16} className="animate-spin" />
              )}
              Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBookModal;
