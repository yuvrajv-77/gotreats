import React, { useState } from "react";
import { Input, InputOtp } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthStore } from "../store/authStore";
import Button from "@/components/Button";
import { getUserFromDb, saveNewUserToFirestore } from "@/services/authService";
import { Phone } from "lucide-react";

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
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Invalid phone number");
      setError("Invalid phone number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
      setConfirmationResult(result);
      setStep(2);
      toast.success("OTP sent");
    } catch (error) {
      console.error("[sendOtp]", error);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      toast.error("Please request OTP first");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // 👇 Since getUserFromDb returns `data()` or undefined, just check truthiness
      const userDetails = await getUserFromDb(user.uid);

      if (userDetails) {
        // 🔐 Existing user
        setUser(user);
        setUserDetails(userDetails);
        toast.success("Login successful");
        navigate("/");
      } else {
        // New user
        console.log("[verifyOtp] New user detected. Moving to name/email input.");
        setStep(3);
      }
    } catch (err) {
      console.error("[verifyOtp]", err);
      setError("Invalid OTP");
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewUser = async () => {
    const { name, email } = formData;
    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const newUser = {
        uid: user.uid,
        displayName: name,
        email,
        phoneNumber: user.phoneNumber,
        role: "customer",
        address: null,
      };

      await saveNewUserToFirestore(newUser);
      setUser(user);
      setUserDetails(newUser);
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      console.error("[saveNewUser]", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-svh border">
      <div className="md:grid grid-cols-2 h-full px-7 md:px-0">
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {/* Step 1: Phone Number Input */}
          {step === 1 && (
            <div className="md:w-1/2">
              <p className="text-2xl md:text-3xl font-bold mb-15 flex item-center">Welcome to
                <div onClick={() => navigate('/')} className="cursor-pointer ml-3">
                  <p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
                    <span className='text-green-500'>go</span>treats
                  </p>
                </div></p>
              <p className="text-sm text-gray-600 mb-2">Enter your phone number to get started</p>
              <Input
                type="tel" autoFocus
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                // label="Phone Number"
                placeholder="Enter Phone Number"
                labelPlacement="outside"
                size="lg" isInvalid={error !== ""}
                errorMessage={error}
                isRequired maxLength={10}
                startContent={
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />|<p>+91</p>
                  </div>
                }
              />
              <Button
                variant="primary"
                size="lg"
                onClick={handleSendOtp}
                className="mt-4 w-full"
                isLoading={loading}
              >
                Send OTP
              </Button>
              <p className="text-sm text-gray-600 mt-4">By Clicking "Send OTP", you agree to our <Link to="/terms-and-conditions"><strong>Terms and Conditions</strong></Link> and <Link to="/privacy-policy"><strong>Privacy Policy</strong></Link></p>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <div className="md:w-1/2 flex flex-col items-start justify-center">

              <p className="text-2xl md:text-3xl font-bold mb-2 flex item-center">Enter OTP</p>
              <p className="text-sm text-gray-600 mb-10">We have sent an OTP to your Phone Number +91{phone}</p>
              <InputOtp
                value={otp}
                onValueChange={setOtp}
                length={6}
                variant="faded"
                size="lg" isInvalid={error !== ""}
                errorMessage={error}
                autoFocus
              />
              <Button
                variant="primary"
                onClick={handleVerifyOtp}
                className="mt-4"
                isLoading={loading}
              >
                Verify OTP
              </Button>
            </div>
          )}

          {/* Step 3: Name and Email Input for New Users */}
          {step === 3 && (
            <div className="md:w-1/2 space-y-6">
              <p className="text-2xl md:text-3xl font-bold flex item-center ">Enter Details</p>

              <div>
                <p className="text-sm text-gray-600 mb-2">Enter Name</p>
                <Input
                  // label="Enter Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  size="md"
                  autoFocus
                  variant="underlined"
                  isRequired
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Enter Phone</p>

                <Input
                  // label="Current Number"
                  value={phone}
                  disabled
                  // placeholder="Enter your name"
                  size="md"
                  variant="underlined"
                  className="text-"
                  isRequired
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Enter Email</p>

                <Input
                  // label="Enter Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  size="md"
                  variant="underlined"
                  type="email"
                  isRequired
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSaveNewUser}
                className="mt-4 w-full"
                isLoading={loading}
              >
                Save and Create Account
              </Button>
            </div>
          )}
        </div>
        <div className="bg-[url('/register.webp')]  bg-cover bg-center bg-no-repeat rotate-270 h-full hidden lg:block"></div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Register;