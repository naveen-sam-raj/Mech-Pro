import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "./api/axios";
import { GoTools } from "react-icons/go";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const devOtp = location.state?.devOtp || null;

  const [otp, setOtp] = useState(devOtp ? devOtp.split("") : ["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    devOtp ? `⚠️ Dev mode: OTP auto-filled (${devOtp}). Set EMAIL_USER & EMAIL_PASS in .env to send real emails.` : ""
  );
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes countdown
  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Handle OTP digit input
  const handleInput = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/verify-otp", { email, otp: otpString });
      // Save token + user on successful verification
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccess(res.data.message);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/resend-otp", { email });
      setSuccess(res.data.message);
      setTimer(600);
      setOtp(["" ,"", "", "", "", ""]);

      // Dev mode: auto-fill OTP if email not configured
      if (res.data.devOtp) {
        const digits = res.data.devOtp.split("");
        setOtp(digits);
        setSuccess(`⚠️ Dev mode: OTP auto-filled (${res.data.devOtp}). Set EMAIL_USER & EMAIL_PASS in .env for real emails.`);
      } else {
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-2xl">
              <GoTools size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-emerald-100 text-sm mt-1">
            We sent a 6-digit OTP to
          </p>
          <p className="text-white font-semibold text-sm mt-0.5">{email}</p>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          {/* Timer */}
          <div className="flex justify-center mb-6">
            <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${timer > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-500 border border-red-200"}`}>
              {timer > 0 ? `⏱ Expires in ${formatTimer(timer)}` : "⚠️ OTP Expired"}
            </span>
          </div>

          {/* OTP Boxes */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200
                  ${digit ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-800"}
                  focus:border-emerald-500 focus:bg-white focus:shadow-md`}
              />
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
              <span className="text-red-500 text-lg">❌</span>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
              <span className="text-green-500 text-lg">✅</span>
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       shadow-lg shadow-emerald-600/30 hover:shadow-xl active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Verifying...
              </span>
            ) : "Verify & Continue →"}
          </button>

          {/* Resend */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500 mb-2">Didn't receive the OTP?</p>
            <button
              onClick={handleResend}
              disabled={resendLoading || timer > 540} // allow resend after 1 min
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2
                         disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition-colors"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
            {timer > 540 && (
              <p className="text-xs text-gray-400 mt-1">Wait {formatTimer(timer - 540)} before resending</p>
            )}
          </div>

          {/* Back to Signup */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/signup")}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
