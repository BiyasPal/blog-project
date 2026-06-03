import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "../Config/Config";
import {createUserWithEmailAndPassword,signInWithPopup,updateProfile,} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const ADMIN_EMAIL = "palbiyas@gmail.com"; // same as AuthContext

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirm: "",
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  // ── Password strength ──────────────────────────────────
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-emerald-500"];
    const text   = ["", "text-red-500", "text-amber-500", "text-lime-600", "text-emerald-600"];
    return { score, label: labels[score], barColor: colors[score], textColor: text[score] };
  };

  const strength = getStrength(formData.password);

  // ── Validation ─────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address.";
    if (formData.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirm)
      errs.confirm = "Passwords do not match.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Save user to Firestore 

  const saveUserToFirestore = async (user) => {
    await setDoc(doc(db, "users", user.uid), {
      uid:       user.uid,
      name:      user.displayName || formData.name,
      email:     user.email,
      role:      user.email === ADMIN_EMAIL ? "admin" : "user",
      createdAt: new Date(),
    });
  };

  // ── Email/Password Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, formData.email, formData.password
      );
      // Set display name in Firebase Auth

      await updateProfile(userCredential.user, { displayName: formData.name });
      // Save to Firestore

      await saveUserToFirestore(userCredential.user);
      // Navigate to dashboard
      
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setErrors({ api: "This email is already registered. Please log in." });
      } else {
        setErrors({ api: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  //  Google Signup
  
  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrors({ api: "Google sign-in failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── UI 
  return (
    <div className="flex min-h-screen bg-[#faf9f6]">

      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] min-h-screen bg-[#1a1a18] flex-col justify-center px-12 py-16 flex-shrink-0">
        <h1 className="font-serif text-5xl font-semibold text-[#f5f0e8] tracking-tight mb-4">
          The Blog.
        </h1>
        <p className="text-[#888880] text-base italic leading-relaxed">
          Words that move. <br /> Stories that matter.
        </p>
        
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-serif font-medium text-gray-900 tracking-tight mb-1">
            Create account
          </h2>
          <p className="text-sm text-gray-400 mb-7">
            Join thousands of readers and writers.
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
            <span className="text-xs text-gray-400">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">Full name</label>
              <input name="name" type="text" placeholder="Jane Doe"
                value={formData.name} onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900 outline-none transition
                  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                  ${errors.name ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">Email address</label>
              <input name="email" type="email" placeholder="jane@example.com"
                value={formData.email} onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900 outline-none transition
                  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                  ${errors.email ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">Password</label>
              <input name="password" type="password" placeholder="Min. 8 characters"
                value={formData.password} onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900 outline-none transition
                  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                  ${errors.password ? "border-red-400" : "border-gray-200"}`}
              />
              {formData.password && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.barColor}`}
                      style={{ width: `${strength.score * 25}%` }} />
                  </div>
                  <span className={`text-xs font-medium ${strength.textColor}`}>{strength.label}</span>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">Confirm password</label>
              <input name="confirm" type="password" placeholder="Repeat your password"
                value={formData.confirm} onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900 outline-none transition
                  focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                  ${errors.confirm ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.confirm && <p className="mt-1.5 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 mt-2 bg-gray-900 text-[#f5f0e8] text-sm font-medium rounded-lg
                hover:opacity-85 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-medium underline underline-offset-2">Log in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
