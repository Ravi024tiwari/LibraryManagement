import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setLateStudents,
  setIssueLoading,
  setIssueError
} from "@/store/issueSlice";
import {
  User,
  BookOpen,
  Calendar,
  AlertTriangle,
  IndianRupee
} from "lucide-react";
import { motion } from "framer-motion";

const LateStudents = () => {
  const dispatch = useDispatch();

  const { lateStudents } = useSelector(
    (state) => state.issue.admin
  );
  const { loading, error } = useSelector(
    (state) => state.issue
  );

  /* =====================
     FETCH LATE STUDENTS
  ===================== */
  useEffect(() => {
    const fetchLateStudents = async () => {
      try {
        dispatch(setIssueLoading(true));

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/issue/late/students`,
          { withCredentials: true }
        );

        dispatch(setLateStudents(res.data));
      } catch (err) {
        dispatch(
          setIssueError(
            err.response?.data?.message ||
              "Failed to load late students"
          )
        );
      } finally {
        dispatch(setIssueLoading(false));
      }
    };

    fetchLateStudents();
  }, [dispatch]);

  /* =====================
     UI STATES
  ===================== */
  if (loading)
    return (
      <p className="p-10 text-zinc-500">
        Loading late students...
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
          Late Students
        </h1>
        <p className="text-sm text-zinc-500">
          Students who have overdue books with unpaid fines
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
              <th className="px-5 py-4">Due Date</th>
              <th className="px-5 py-4">Late Days</th>
              <th className="px-5 py-4">Fine</th>
            </tr>
          </thead>

          <tbody>
            {lateStudents.map((issue) => (
              <motion.tr
                key={issue._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-zinc-100 hover:bg-rose-50/30"
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
                  {new Date(
                    issue.expectedReturnDate
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-center font-bold text-rose-600">
                  {issue.lateDays} days
                </td>

                <td className="px-5 py-4 text-center font-bold text-zinc-900">
                  ₹{issue.fineAmount}
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
        {lateStudents.map((issue) => (
          <motion.div
            key={issue._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-zinc-900">
                  {issue.student.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {issue.student.email}
                </p>
              </div>
              <span className="text-xs font-bold text-rose-600">
                ₹{issue.fineAmount}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-xs text-zinc-500">
              <p>
                <BookOpen size={12} className="inline mr-1" />
                {issue.book.title}
              </p>
              <p>
                <Calendar size={12} className="inline mr-1" />
                Due:{" "}
                {new Date(
                  issue.expectedReturnDate
                ).toLocaleDateString()}
              </p>
              <p className="font-bold text-rose-600">
                <AlertTriangle size={12} className="inline mr-1" />
                {issue.lateDays} days late
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {lateStudents.length === 0 && (
        <div className="py-20 text-center text-zinc-400">
          🎉 No late students found
        </div>
      )}
    </div>
  );
};

export default LateStudents;
