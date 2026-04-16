import React, { useState } from "react";
import { Input, InputOtp } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { useAuthStore } from "../store/authStore";
import { getUserFromDb, saveNewUserToFirestore } from "@/services/authService";
import { Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/Navbar";

const Register = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setUserDetails = useAuthStore((state) => state.setUserDetails);

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error("Invalid phone number"); setError("Invalid phone number"); return; }
    setError(""); setLoading(true);
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
      setConfirmationResult(result); setStep(2); toast.success("OTP sent");
    } catch (err) { toast.error("Failed to send OTP"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) { toast.error("Request OTP first"); return; }
    setError(""); setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const userDetails = await getUserFromDb(result.user.uid);
      if (userDetails) { setUser(result.user); setUserDetails(userDetails); toast.success("Welcome back!"); navigate("/"); }
      else setStep(3);
    } catch (err) { setError("Invalid OTP"); toast.error("Invalid OTP"); }
    finally { setLoading(false); }
  };

  const handleSaveNewUser = async () => {
    const { name, email } = formData;
    if (!name || !email) { toast.error("Fill in all fields"); return; }
    setLoading(true);
    try {
      const user = auth.currentUser;
      const newUser = { uid: user.uid, displayName: name, email, phoneNumber: user.phoneNumber, role: "customer", address: null };
      await saveNewUserToFirestore(newUser);
      setUser(user); setUserDetails(newUser); toast.success("Account created!"); navigate("/");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  const steps = ['Phone', 'Verify', 'Details'];

  return (
    <div className="min-h-svh bg-[var(--brand-dark)] flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[var(--brand-flame)]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <BrandLogo />
          <p className="font-mono text-xs text-[var(--brand-cream)]/30 uppercase tracking-widest mt-2">
            {step === 1 ? 'Create account' : step === 2 ? 'Verify phone' : 'Your details'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1.5 ${i + 1 <= step ? 'text-[var(--brand-flame)]' : 'text-[var(--brand-cream)]/20'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border ${i + 1 < step ? 'bg-[var(--brand-flame)] border-[var(--brand-flame)] text-white' : i + 1 === step ? 'border-[var(--brand-flame)] text-[var(--brand-flame)]' : 'border-[var(--brand-border)]'}`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i + 1 < step ? 'bg-[var(--brand-flame)]/40' : 'bg-[var(--brand-border)]'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[var(--brand-charcoal)] border border-[var(--brand-border)] rounded-2xl p-6 space-y-5">

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="font-mono text-xs text-[var(--brand-cream)]/40 uppercase tracking-widest block mb-2">Phone Number</label>
                <div className="relative flex items-center bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl overflow-hidden focus-within:border-[var(--brand-flame)]/50 transition-colors">
                  <div className="flex items-center gap-2 pl-4 text-[var(--brand-cream)]/30 font-mono text-sm shrink-0">
                    <Phone size={14} /> +91
                    <span className="w-px h-4 bg-[var(--brand-border)]" />
                  </div>
                  <input
                    type="tel"
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    placeholder="10-digit number"
                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/20 focus:outline-none font-body"
                  />
                </div>
                {error && <p className="font-mono text-xs text-red-400 mt-1.5">{error}</p>}
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold flex items-center justify-center gap-2 hover:bg-[#C94808] transition-colors disabled:opacity-50 active:scale-[0.97]"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Send OTP <ArrowRight size={16} /></>}
              </button>
              <p className="text-center font-mono text-xs text-[var(--brand-cream)]/25 leading-relaxed">
                By continuing you agree to our{' '}
                <Link to="/terms-and-conditions" className="text-[var(--brand-flame)]/70 hover:text-[var(--brand-flame)] transition-colors">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy-policy" className="text-[var(--brand-flame)]/70 hover:text-[var(--brand-flame)] transition-colors">Privacy Policy</Link>
              </p>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <p className="font-body text-[var(--brand-cream)]/60 text-sm mb-5">
                  OTP sent to <span className="font-mono text-[var(--brand-cream)]">+91 {phone}</span>
                </p>
                <InputOtp
                  value={otp}
                  onValueChange={setOtp}
                  length={6}
                  variant="faded"
                  size="lg"
                  isInvalid={error !== ""}
                  errorMessage={error}
                  autoFocus
                  classNames={{
                    input: 'bg-[var(--brand-dark)] border-[var(--brand-border)] text-[var(--brand-cream)]'
                  }}
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold flex items-center justify-center gap-2 hover:bg-[#C94808] transition-colors disabled:opacity-50"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify OTP'}
              </button>
              <button onClick={() => { setStep(1); setOtp(''); setError(''); }} className="w-full flex items-center justify-center gap-1.5 text-[var(--brand-cream)]/40 text-xs font-mono hover:text-[var(--brand-cream)] transition-colors">
                <ArrowLeft size={12} /> Change number
              </button>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-[var(--brand-cream)]/40 uppercase tracking-widest block mb-2">Full Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl px-4 py-3 text-sm text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/20 focus:outline-none focus:border-[var(--brand-flame)]/50 font-body transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-[var(--brand-cream)]/40 uppercase tracking-widest block mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl px-4 py-3 text-sm text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/20 focus:outline-none focus:border-[var(--brand-flame)]/50 font-body transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-[var(--brand-cream)]/40 uppercase tracking-widest block mb-2">Phone</label>
                  <input
                    disabled
                    value={phone}
                    className="w-full bg-[var(--brand-dark)]/50 border border-[var(--brand-border)] rounded-xl px-4 py-3 text-sm text-[var(--brand-cream)]/30 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveNewUser}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[var(--brand-flame)] text-white font-heading font-semibold flex items-center justify-center gap-2 hover:bg-[#C94808] transition-colors disabled:opacity-50"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </>
          )}
        </div>
      </div>

      <div id="recaptcha-container" />
    </div>
  );
};

export default Register;