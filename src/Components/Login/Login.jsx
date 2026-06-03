import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../Config/Config";
import {signInWithEmailAndPassword,signInWithPopup } from "firebase/auth";

const AdminEmail = "palbiyas2021@gmail.com"; 

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  // Validation 

  const validate = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address.";
    if (!formData.password)
      errs.password = "Password is required.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Email/Password Login 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, formData.email, formData.password
      );
      
      // If admin email: go to admin, else :go to dashboard

      if (userCredential.user.email === AdminEmail) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setErrors({ api: "Invalid email or password. Please try again." });
      } else {
        setErrors({ api: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === AdminEmail) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setErrors({ api: "Google sign-in failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // UI

  return (
    <div className="flex min-h-screen bg-gray-700">

      {/* Left panel */}

      <div className="hidden lg:flex w-[420px] min-h-screen bg-[#1a1a18] flex-col justify-center px-12 py-16 flex-shrink-0">
        <h1 className="font-serif text-5xl font-semibold text-[#f5f0e8] tracking-tight mb-4">
          Aletheia
        </h1>
        <p className="text-white text-base italic leading-relaxed">
          Words that move. <br /> Stories that matter.
        </p>
      </div>

      {/* Right panel */}

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-serif font-medium text-white tracking-tight mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-white mb-7">
            Sign in to continue reading.
          </p>

          {errors.api && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {errors.api}
            </div>
          )}

          {/* Google button */}

           <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition mb-5 disabled:opacity-50"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          {/* Divider */}

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-white">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div> 

          <form onSubmit={handleSubmit} noValidate className="space-y-4">  

            {/* Email */}

            <div>
              <label className="block text-xs font-medium text-white  mb-1.5 tracking-wide">
                Email address
              </label>
              <input name="email"  type="email"  placeholder="biyas@example.com"
                  value={formData.email} onChange={handleChange}
                  className={`w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900 outline-none transition
                  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                  ${errors.email ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-white tracking-wide">Password</label>
                <button type="button" className="text-xs text-white hover:text-gray-900 transition">
                  Forgot password?
                </button>
              </div>
              <input name="password" type="password" placeholder="Your password"
                value={formData.password} onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900 outline-none transition
                  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                  ${errors.password ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 mt-2 bg-gray-900 text-[#f5f0e8] text-sm font-medium rounded-lg
                hover:opacity-85 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Signing in..." : "Log in"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-white">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white font-medium underline underline-offset-2">Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
