import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  fetchBookStart,
  fetchBookSuccess,
  fetchBookFailure,
  clearSelectedBook
} from "@/store/bookSlice";

import IssueBookModal from "./IssueModel";

import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Edit3,
  Layers,
  Star,
  Hash
} from "lucide-react";

import { motion } from "framer-motion";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedBook, loading, error } = useSelector(
    (state) => state.books
  );
  const { user } = useSelector((state) => state.auth);

  const [openIssueModal, setOpenIssueModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      dispatch(fetchBookStart());
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/book/${id}`,
          { withCredentials: true }
        );
        dispatch(fetchBookSuccess(res.data.book));
      } catch (err) {
        dispatch(
          fetchBookFailure(
            err.response?.data?.message ||
              "Failed to load book"
          )
        );
      }
    };

    fetchBook();

    return () => {
      dispatch(clearSelectedBook());
    };
  }, [dispatch, id]);

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!selectedBook) return null;

  const isAvailable = selectedBook.availableCopies > 0;

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-12 lg:py-20 relative">
      
      {/* Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-50/40 rounded-full blur-[120px] -z-10" />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-amber-600 mb-10"
      >
        <ArrowLeft size={14} />
        Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
        
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-5 sticky top-28 flex justify-center"
        >
          <img
            src={
              selectedBook.coverImage ||
              "https://images.unsplash.com/photo-1543004629-ff569f872783"
            }
            alt={selectedBook.title}
            className="w-full max-w-[420px] aspect-[3/4] rounded-[2.5rem] object-cover shadow-2xl"
          />
        </motion.div>

        {/* Info */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600">
                <Layers size={12} />
                {selectedBook.category}
              </span>
              <div className="flex items-center gap-1 text-zinc-400">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-bold">Featured</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
              {selectedBook.title}
              <span className="text-amber-500">.</span>
            </h1>

            <p className="text-lg italic text-zinc-500 mt-3">
              by{" "}
              <span className="font-bold text-zinc-900 not-italic">
                {selectedBook.author}
              </span>
            </p>
          </div>

          {/* Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-6 rounded-3xl border ${
                isAvailable
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-rose-50 border-rose-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isAvailable ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : (
                  <AlertTriangle size={18} className="text-rose-500" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Status
                </span>
              </div>
              <p
                className={`text-xl font-black ${
                  isAvailable
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {isAvailable
                  ? `${selectedBook.availableCopies} Copies`
                  : "Out of Stock"}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-2 mb-1 text-zinc-400">
                <Hash size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Total Inventory
                </span>
              </div>
              <p className="text-xl font-black">
                {selectedBook.totalCopies}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-zinc-100 rounded-3xl p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4">
              Summary
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              {selectedBook.description ||
                "No description available for this volume."}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-zinc-100">
            {user?.role === "ADMIN" ? (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    navigate(`/admin/books/edit/${selectedBook._id}`)
                  }
                  className="flex-1 rounded-full bg-zinc-900 text-white px-8 py-4 text-xs font-black uppercase tracking-widest"
                >
                  <Edit3 size={16} /> Edit Volume
                </button>

                <button
                  onClick={() => setOpenIssueModal(true)}
                  disabled={!isAvailable}
                  className={`flex-1 rounded-full px-8 py-4 text-xs font-black uppercase tracking-widest ${
                    isAvailable
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  {isAvailable ? "Issue to Member" : "Out of Stock"}
                </button>

                <IssueBookModal
                  isOpen={openIssueModal}
                  onClose={() => setOpenIssueModal(false)}
                  bookId={selectedBook._id}
                  onSuccess={async () => {
                    // 🔁 Refresh book after issue
                    const res = await axios.get(
                      `${import.meta.env.VITE_BACKEND_URL}/book/${id}`,
                      { withCredentials: true }
                    );
                    dispatch(fetchBookSuccess(res.data.book));
                  }}
                />
              </div>
            ) : user?.role === "STUDENT" ? (
              <div className="p-5 rounded-2xl bg-zinc-900 text-white flex gap-4">
                <BookOpen size={20} className="text-amber-500" />
                <p className="text-sm">
                  Visit the library desk to request this book.
                </p>
              </div>
            ) : (
              <div className="p-6 border border-dashed rounded-2xl text-center text-zinc-400">
                Please login to check availability.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Helpers ---------- */

const DetailSkeleton = () => (
  <div className="mx-auto max-w-6xl px-10 py-20 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
      <div className="h-[520px] bg-zinc-100 rounded-3xl" />
      <div className="space-y-6">
        <div className="h-4 w-24 bg-zinc-100 rounded-full" />
        <div className="h-12 bg-zinc-100 rounded-xl" />
        <div className="h-6 w-1/2 bg-zinc-100 rounded-full" />
        <div className="h-32 bg-zinc-100 rounded-2xl" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="py-40 text-center">
    <AlertTriangle size={32} className="mx-auto text-rose-500 mb-4" />
    <h2 className="text-2xl font-black">Book Not Found</h2>
    <p className="text-zinc-500 mt-2">{message}</p>
  </div>
);

export default BookDetails;
