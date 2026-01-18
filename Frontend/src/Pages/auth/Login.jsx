import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { authStart, authSuccess, authFailure } from "@/store/authSlice";
import { useNavigate, Link } from "react-router-dom";
// Optional: Using Lucide icons for a better UI experience
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        formData,
        { withCredentials: true }
      );

      const user = res.data.user;
      dispatch(authSuccess(user));

      if (user.role === "ADMIN") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      dispatch(
        authFailure(err.response?.data?.message || "Login failed")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-amber-50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-8">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-200">
              <Lock className="text-white h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Please enter your details to sign in
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-amber-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-zinc-700">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-amber-600 hover:text-amber-700">
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-amber-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-zinc-200"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-sm text-zinc-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
              >
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;