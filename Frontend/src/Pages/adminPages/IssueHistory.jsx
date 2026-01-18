import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminIssueHistory,
  setIssueLoading,
  setIssueError
} from "@/store/issueSlice";
import {
  BookOpen,
  User,
  Calendar,
  IndianRupee,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const IssueHistory = () => {
  const dispatch = useDispatch();
  const { issueHistory } = useSelector(
    (state) => state.issue.admin
  );
  const { loading, error } = useSelector(
    (state) => state.issue
  );

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  /* =====================
     FETCH HISTORY
  ===================== */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        dispatch(setIssueLoading(true));
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/issue/history?page=${page}`,
          { withCredentials: true }
        );

        dispatch(setAdminIssueHistory(res.data.issues));
        setTotal(res.data.total);
      } catch (err) {
        dispatch(
          setIssueError(
            err.response?.data?.message ||
              "Failed to load issue history"
          )
        );
      } finally {
        dispatch(setIssueLoading(false));
      }
    };

    fetchHistory();
  }, [dispatch, page]);

  /* =====================
     UI STATES
  ===================== */
  if (loading)
    return (
      <p className="p-10 text-zinc-500">
        Loading issue history...
      </p>
    );

  if (error)
    return (
      <p className="p-10 text-rose-500 font-bold">
        {error}
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900">
          Issue History
        </h1>
        <p className="text-sm text-zinc-500">
          Complete record of issued & returned books
        </p>
      </div>

      {/* =====================
          DESKTOP TABLE
      ===================== */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-100">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-4 text-left">Student</th>
              <th className="px-5 py-4 text-left">Book</th>
              <th className="px-5 py-4">Issued</th>
              <th className="px-5 py-4">Returned</th>
              <th className="px-5 py-4">Fine</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {issueHistory.map((issue) => (
              <motion.tr
                key={issue._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-zinc-100 hover:bg-zinc-50"
              >
                {/* Student */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <div>
                      <p className="font-semibold">
                        {issue.student.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {issue.student.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Book */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    <div>
                      <p className="font-semibold">
                        {issue.book.title}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {issue.book.author}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-center">
                  {new Date(issue.issueDate).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-center">
                  {issue.actualReturnDate
                    ? new Date(
                        issue.actualReturnDate
                      ).toLocaleDateString()
                    : "—"}
                </td>

                <td className="px-5 py-4 text-center">
                  ₹{issue.fineAmount}
                </td>

                <td className="px-5 py-4 text-center">
                  {issue.fineAmount > 0 ? (
                    issue.fineStatus === "PAID" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle size={14} /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                        <AlertTriangle size={14} /> Unpaid
                      </span>
                    )
                  ) : (
                    <span className="text-zinc-400 text-xs">
                      No Fine
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================
          MOBILE CARDS
      ===================== */}
      <div className="md:hidden space-y-4">
        {issueHistory.map((issue) => (
          <motion.div
            key={issue._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-zinc-100 p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-zinc-900">
                  {issue.book.title}
                </p>
                <p className="text-xs text-zinc-400">
                  {issue.book.author}
                </p>
              </div>

              {issue.fineAmount > 0 && (
                <span className="text-xs font-bold text-rose-600">
                  ₹{issue.fineAmount}
                </span>
              )}
            </div>

            <div className="mt-3 text-xs text-zinc-500 space-y-1">
              <p>
                <User size={12} className="inline mr-1" />
                {issue.student.name}
              </p>
              <p>
                <Calendar size={12} className="inline mr-1" />
                Issued:{" "}
                {new Date(issue.issueDate).toLocaleDateString()}
              </p>
              {issue.actualReturnDate && (
                <p>
                  Returned:{" "}
                  {new Date(
                    issue.actualReturnDate
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* =====================
          PAGINATION
      ===================== */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border border-zinc-200 disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <span className="text-sm font-bold text-zinc-600">
          Page {page}
        </span>

        <button
          disabled={page * 10 >= total}
          onClick={() => setPage(page + 1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border border-zinc-200 disabled:opacity-40"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default IssueHistory;
