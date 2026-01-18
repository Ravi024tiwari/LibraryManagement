import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./Pages/auth/Registration.jsx";
import Login from "./Pages/auth/Login.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import EditProfile from "./Pages/EditProfile.jsx";

/* ================= MAIN ================= */
import MainLayout from "./layout/MainLayout.jsx";
import HomePage from "./Pages/HomePage.jsx";
import BooksPage from "./Pages/BookPage.jsx";
import BookDetails from "./Pages/BookDetail.jsx";
import AddBook from "./Pages/AddBook.jsx";

/* ================= ADMIN ================= */
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminDashboard from "./Pages/adminPages/AdminDashboard.jsx";
import CurrentIssues from "./Pages/adminPages/CurrentIssueBooks.jsx";
import IssueHistory from "./Pages/adminPages/IssueHistory.jsx";
import LateStudents from "./Pages/adminPages/LateStudents.jsx";

/* ================= STUDENT ================= */
import StudentLayout from "./layout/StudentLayout.jsx";
import StudentDashboard from "./Pages/studentPages/StudentDashboard.jsx";
import StudentCurrentIssues from "./Pages/studentPages/StudentCurrentIssue.jsx";
import StudentIssueHistory from "./Pages/studentPages/StudentIssueHistory.jsx";
import StudentFinePage from "./Pages/studentPages/StudentFinePage.jsx";

import ProfilePage from "./components/ProfilePage.jsx";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= MAIN LAYOUT ================= */}
        <Route element={<MainLayout />}>

          {/* Public */}
             <Route
            path="/profile"
            element={
            <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
               <ProfilePage />
            </ProtectedRoute>
            }
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          {/* Books */}
          <Route path="/all-book" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetails />} />

          {/* Admin: create book (standalone page) */}
          <Route
            path="/admin/books/create"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AddBook />
              </ProtectedRoute>
            }
          />
          <Route
         path="/edit/profile"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
      <EditProfile />
    </ProtectedRoute>
  }
/>


        </Route>

        {/* ================= ADMIN LAYOUT ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="current/issues" element={<CurrentIssues />} />
          <Route path="issue/history" element={<IssueHistory />} />
          <Route path="issue/late/student" element={<LateStudents />} />
        </Route>

        {/* ================= STUDENT LAYOUT ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="current-issues" element={<StudentCurrentIssues />} />
          <Route path="history" element={<StudentIssueHistory />} />
          <Route path="fines" element={<StudentFinePage />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center text-zinc-600">
              Page not found
            </div>
          }
        />
     


      </Routes>
    </Router>
  );
}

export default App;
