import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminCurrentIssues,
  removeAdminCurrentIssue,
  setIssueLoading,
  setIssueError
} from "@/store/issueSlice";
import {
  RefreshCcw,
  Calendar,
  User,
  BookOpen,
  AlertTriangle
} from "lucide-react";

const CurrentIssues = () => {

  const dispatch = useDispatch();
  

  /* =====================
     FETCH CURRENT ISSUES
  ===================== */
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        dispatch(setIssueLoading(true));
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/issue/active/issues`,
          { withCredentials: true }
        );
        console.log("The current issue of admin data is:",res.data.issues)
        dispatch(setAdminCurrentIssues(res.data.issues));//here its dispatch the current issue books into the redux page
      } catch (err) {
        dispatch(
          setIssueError(
            err.response?.data?.message ||
              "Failed to load current issues"
          )
        );
      } finally {
        dispatch(setIssueLoading(false));
      }
    };

    fetchIssues();
  }, [dispatch]);

  const {currentIssues} = useSelector(
    (state) => state.issue?.admin
  );
  const { loading, error } = useSelector(
    (state) => state.issue
  );
  /* =====================
     RETURN BOOK
  ===================== */
  const handleReturn = async (issueId) => { //here when the admin click on the retturn btn then its execution occur
    try {
      dispatch(setIssueLoading(true));

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/issue/return/${issueId}`,
        {},
        { withCredentials: true }
      );

      // 🔥 Redux update
      dispatch(removeAdminCurrentIssue(issueId));
    } catch (err) {
      dispatch(
        setIssueError(
          err.response?.data?.message ||
            "Failed to return book"
        )
      );
    } finally {
      dispatch(setIssueLoading(false));
    }
  };

  /* =====================
     UI STATES
  ===================== */
  if (loading)
    return (
      <p className="p-10 text-zinc-500">
        Loading current issues...
      </p>
    );

  if (error)
    return (
      <p className="p-10 text-rose-500 font-bold">
        {error}
      </p>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-zinc-900">
          Current Issued Books
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* Table */}
      {currentIssues.length === 0 ? (
        <div className="text-center text-zinc-400 py-20">
          No active issued books
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-100">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-4 text-left">Student</th>
                <th className="px-5 py-4 text-left">Book</th>
                <th className="px-5 py-4">Issued</th>
                <th className="px-5 py-4">Due</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentIssues.map((issue) => {
                const dueDate = new Date(
                  issue.expectedReturnDate
                );
                const isLate = new Date() > dueDate;

                return (
                  <tr
                    key={issue._id}
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

                    {/* Issue Date */}
                    <td className="px-5 py-4 text-center">
                      {new Date(
                        issue.issueDate
                      ).toLocaleDateString()}
                    </td>

                    {/* Due Date */}
                    <td className="px-5 py-4 text-center">
                      {dueDate.toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      {isLate ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                          <AlertTriangle size={14} /> Late
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs">
                          On Time
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          handleReturn(issue._id)
                        }
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrentIssues;
