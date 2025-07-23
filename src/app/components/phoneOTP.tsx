import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function PhoneOTP() {
  const [phone, setPhone] = useState("+1"); // Default country code
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const recaptchaContainer = useRef<HTMLDivElement>(null);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!recaptchaContainer.current) return;

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      recaptchaContainer.current,
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved callback
          setMessage("reCAPTCHA verified");
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
        }
      }
    );

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const sendOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!phone) {
        throw new Error("Phone number is required");
      }

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent successfully");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError("");

    try {
      if (!confirmationResult || !otp) {
        throw new Error("Invalid verification attempt");
      }

      await confirmationResult.confirm(otp);
      setMessage("Phone number verified successfully!");
      // User is now signed in
      // You can redirect or update app state here
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Phone Verification</h2>
      
      {/* Phone Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (with country code)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+11234567890"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          disabled={!!confirmationResult}
        />
      </div>

      {/* OTP Input (shown after sending OTP) */}
      {confirmationResult && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter OTP
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {!confirmationResult ? (
          <button
            onClick={sendOTP}
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <button
            onClick={verifyOTP}
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}

        {confirmationResult && (
          <button
            onClick={() => {
              setConfirmationResult(null);
              setOtp("");
              setMessage("");
            }}
            className="w-full py-2 px-4 rounded bg-gray-200 hover:bg-gray-300"
          >
            Change Phone Number
          </button>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
      )}
      {message && (
        <p className="mt-4 text-green-600 text-sm text-center">{message}</p>
      )}

      {/* Hidden reCAPTCHA container */}
      <div ref={recaptchaContainer} id="recaptcha-container" className="hidden"></div>
    </div>
  );
}