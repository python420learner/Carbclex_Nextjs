"use client"
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Leaf, Mail, Lock, User, Phone, Building, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Clock, Shield, Globe, TrendingUp } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import svgPaths from '../imports/svg-um3gc8kbv5';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { getAuth, createUserWithEmailAndPassword, verifyPasswordResetCode, confirmPasswordReset, sendPasswordResetEmail, updateProfile, sendEmailVerification, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { app } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Link from 'next/link';

interface UserData {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  userType: 'individual' | 'business';
  emailVerified?: boolean;
}

type AuthFlow = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verify-email';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<AuthFlow>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const auth = getAuth(app);

  const [email, setEmail] = useState<string>("");
  const [codeValid, setCodeValid] = useState(false);
  const [actionCode, setActionCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Check URL parameters for reset token or verification code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('reset_token');
    const verification = urlParams.get('verify');

    if (token) {
      setResetToken(token);
      setCurrentFlow('reset-password');
    } else if (verification) {
      setVerificationCode(verification);
      setCurrentFlow('verify-email');
    }
  }, []);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    userType: 'individual' as 'individual' | 'business',
    acceptTerms: false
  });

  // Forgot password state
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  // Reset password state
  const [resetPasswordData, setResetPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  useEffect(() => {
    // Get reset code from URL
    const oobCode = getQueryParam("oobCode");
    setActionCode(oobCode || "");

    if (!oobCode) {
      setError("No password reset code found in the URL.");
      return;
    }
    setCurrentFlow('reset-password')
    // Verify the reset code is valid and get user's email
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setCodeValid(true);
      })
      .catch(() => {
        setError("Invalid or expired password reset code.");
      });
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };


  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const auth = getAuth();

      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;

      // Refresh user data to get latest verification status
      await user.reload();

      // 2. Check email verification
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }

      // ✅ 3. Get extra details from localStorage (set during signup)
      let extraDetails: any = null;
      const storedData = localStorage.getItem(`pendingUser_${loginData.email.toLowerCase()}`);
      if (storedData) {
        extraDetails = JSON.parse(storedData);
        console.log("Fetched extra signup details:", extraDetails);
      }

      // 4. Get Firebase ID token
      const idToken = await user.getIdToken();

      // 5. Prepare user payload — merge Firebase & localStorage details if available
      const userPayload = {
        name: extraDetails?.name || user.displayName,
        email: extraDetails?.email || user.email,
        uid: user.uid,
        organization: extraDetails?.company || null,
        phone: extraDetails?.phone || null,
      };

      console.log(idToken)

      // 6. Send user to backend for registration/update
      const registerResponse = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(userPayload)
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "User registration failed");
      }

      // ❌ 7. Remove localStorage copy once saved in backend
      localStorage.removeItem(`pendingUser_${loginData.email.toLowerCase()}`);

      // 8. Create Spring session
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`
        },
        credentials: "include"
      });

      if (!loginResponse.ok) {
        throw new Error("Session creation failed");
      }

      // 9. Redirect to dashboard
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please try again.");
    }
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};

    // ===== Validation =====
    if (!signupData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!signupData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(signupData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (signupData.userType === 'business' && !signupData.company.trim()) {
      newErrors.company = 'Company name is required for business accounts';
    }
    if (!signupData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // ===== Firebase Auth Signup =====
    const auth = getAuth();
    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );

      const user = userCredential.user;

      // Update display name in Auth
      await updateProfile(user, {
        displayName: signupData.name.trim()
      });

      // ✅ Store signupData to localStorage BEFORE sending verification email
      localStorage.setItem(
        `pendingUser_${signupData.email.toLowerCase()}`,
        JSON.stringify(signupData)
      );

      // Send email verification
      await sendEmailVerification(user, {
        url: 'http://localhost:3000/auth' // Change in production
      });

      setSuccessMessage('Account created successfully! Please check your email for verification instructions.');
      toast.success('Verification email sent! Please check your inbox.');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'An account with this email already exists' });
      } else {
        toast.error('Signup failed. Please try again.');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        console.log(user);
        const idToken = await result.user.getIdToken();

        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0], // Fallback to email prefix if no display name
        };

        // First register the user (or update if exists)
        const registerRes = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify(userData)
        });

        if (!registerRes.ok) {
          throw new Error("User registration failed");
        }

        // Send this token to your Spring Boot backend
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`
          },
          credentials: "include"
        });
        if (loginResponse.ok) {
          // Login and session successful
          router.push("/dashboard");
          // window.location.href = "/dashboard";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLoginFromFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        console.log(user);

        const idToken = await user.getIdToken();

        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || (user.email ? user.email.split('@')[0] : 'FacebookUser'), // Fallback to email prefix or default
        };

        // Register the user or update if exists
        const registerRes = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify(userData)
        });

        if (!registerRes.ok) {
          throw new Error("User registration failed");
        }

        // Send the token to Spring Boot backend for session creation
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`
          },
          credentials: "include"
        });

        if (loginResponse.ok) {
          // Login and session successful - redirect to dashboard
          router.push("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Facebook login error:", err);
      });
  };


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!forgotPasswordData.email) {
      setErrors({ email: 'Email is required' });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(forgotPasswordData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotPasswordData.email);

      alert("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      alert(error.message || "Failed to send password reset email.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!resetPasswordData.password) {
      newErrors.password = 'New password is required';
    } else if (!validatePassword(resetPasswordData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!resetPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Confirm password reset with new password
      await confirmPasswordReset(auth, actionCode, resetPasswordData.password);
      setIsLoading(false)
      router.push('/auth')
      setCurrentFlow('login')
      setMessage("Password reset successful! You can now log in.");
    } catch (err: any) {
      setIsLoading(false)
      setError("Failed to reset password: " + err.message);
    }
  };

  const handleEmailVerification = async () => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!verificationCode) {
        setSuccessMessage('Invalid verification code');
        setIsLoading(false);
        return;
      }

      const email = localStorage.getItem(`verification_${verificationCode}`);
      if (!email) {
        setSuccessMessage('Verification code has expired or is invalid');
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(localStorage.getItem(`user_${email}`) || '{}');
      userData.emailVerified = true;
      localStorage.setItem(`user_${email}`, JSON.stringify(userData));

      // Clean up verification token
      localStorage.removeItem(`verification_${verificationCode}`);

      setSuccessMessage('Email verified successfully! You can now log in to your account.');
      toast.success('Email verified! Welcome to CarbClex! 🌱');
      setTimeout(() => setCurrentFlow('login'), 2000);

    } catch (error) {
      toast.error('Email verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentFlow === 'verify-email' && verificationCode) {
      handleEmailVerification();
    }
  }, [currentFlow, verificationCode]);

  const GoogleIcon = () => (
    <div className="w-5 h-5 relative">
      <svg className="w-full h-full" viewBox="0 0 19 20" fill="none">
        <path d={svgPaths.p2952de80} fill="#FFC107" />
        <path d={svgPaths.p1802c900} fill="#4CAF50" />
        <path d={svgPaths.pc118100} fill="#1976D2" />
        <path d={svgPaths.p21781300} fill="#FF3D00" />
      </svg>
    </div>
  );

  const FacebookIcon = () => (
    <div className="w-5 h-5 bg-[#0A66C2] rounded-full flex items-center justify-center">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
        <path d={svgPaths.p1dc7c480} fill="white" />
      </svg>
    </div>
  );

  const getWelcomeContent = () => {
    switch (currentFlow) {
      case 'signup':
        return {
          title: "Join the Climate Revolution",
          subtitle: "Be part of the world's largest verified carbon marketplace. Every credit you purchase helps build a sustainable future for our planet.",
          features: [
            { icon: <Shield className="w-5 h-5" />, text: "100% Verified Projects" },
            { icon: <Globe className="w-5 h-5" />, text: "Global Impact Network" },
            { icon: <TrendingUp className="w-5 h-5" />, text: "Real-time Impact Tracking" }
          ]
        };
      case 'forgot-password':
        return {
          title: "Secure Account Recovery",
          subtitle: "We'll help you regain access to your carbon portfolio and continue your sustainability journey.",
          features: [
            { icon: <Shield className="w-5 h-5" />, text: "Bank-level Security" },
            { icon: <Clock className="w-5 h-5" />, text: "Quick Recovery Process" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "Email Verification" }
          ]
        };
      case 'reset-password':
        return {
          title: "Create New Password",
          subtitle: "Set a secure password to protect your carbon credits and environmental impact data.",
          features: [
            { icon: <Lock className="w-5 h-5" />, text: "Encrypted Storage" },
            { icon: <Shield className="w-5 h-5" />, text: "Secure Authentication" },
            { icon: <CheckCircle className="w-5 h-5" />, text: "Verified Recovery" }
          ]
        };
      case 'verify-email':
        return {
          title: "Email Verification",
          subtitle: "Verifying your email to secure your account and enable full access to our carbon marketplace.",
          features: [
            { icon: <CheckCircle className="w-5 h-5" />, text: "Account Verification" },
            { icon: <Shield className="w-5 h-5" />, text: "Enhanced Security" },
            { icon: <Globe className="w-5 h-5" />, text: "Full Marketplace Access" }
          ]
        };
      default:
        return {
          title: "Welcome Back, Climate Champion!",
          subtitle: "Continue your mission to offset carbon emissions and drive positive environmental change worldwide.",
          features: [
            { icon: <TrendingUp className="w-5 h-5" />, text: "Track Your Impact" },
            { icon: <Globe className="w-5 h-5" />, text: "50+ Countries" },
            { icon: <Shield className="w-5 h-5" />, text: "Verified Credits" }
          ]
        };
    }
  };

  const welcomeContent = getWelcomeContent();

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1655091834941-4e4cfd699a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmb3Jlc3QlMjByb2FkJTIwbmF0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzU0NTcxNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
      }}>
        <div>
          <Navbar activePage="" />

        </div>


      {/* Back Button */}
      {/* <Link href="/marketplace"><Button
        variant="ghost"
        className="absolute top-18 left-4 md:top-6 md:left-6 z-500 flex items-center gap-2 text-white hover:text-green-200 hover:bg-black/20 backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Marketplace</span>
      </Button></Link> */}

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 text-white relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">CarbClex</span>
            </div>

            <h1 className="text-3xl font-semibold mb-4 leading-tight">
              {welcomeContent.title}
            </h1>

            <p className="text-lg text-white/90 mb-6">
              {welcomeContent.subtitle}
            </p>

            <div className="space-y-3">
              {welcomeContent.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center gap-3 text-white/80">
                  {feature.icon}
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Form */}
        <div className="bg-gradient-to-br from-green-400 to-teal-500 p-6">
          {renderFormContent()}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Left Side - Welcome Section */}
        <div className="w-1/2 flex flex-col justify-center px-12 lg:px-20 text-white z-10">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold">CarbClex</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
              {welcomeContent.title}
            </h1>

            <p className="text-xl text-white/90 leading-relaxed max-w-lg">
              {welcomeContent.subtitle}
            </p>

            <div className="space-y-4 pt-4">
              {welcomeContent.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 text-white/80">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {feature.icon}
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Area */}
        <div className="w-1/2">
          <div className="h-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              {renderFormContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderFormContent() {
    if (currentFlow === 'verify-email') {
      return (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-8 h-8 text-white" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-white">
            {isLoading ? 'Verifying Email...' : 'Email Verification'}
          </h2>

          {successMessage && (
            <Alert className="bg-green-100 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !successMessage && (
            <p className="text-white/80">
              Processing your email verification...
            </p>
          )}
        </div>
      );
    }

    if (currentFlow === 'forgot-password') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-white/80">Enter your email to receive reset instructions</p>
          </div>

          {successMessage && (
            <Alert className="bg-green-100 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-white text-base tracking-wide">
                Email Address<span className="text-red-400">*</span>
              </Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your registered email"
                value={forgotPasswordData.email}
                onChange={(e) => setForgotPasswordData({ email: e.target.value })}
                className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 text-black placeholder:text-black/40 ${errors.email ? 'border-2 border-red-500' : ''}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-200">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 md:h-14 bg-green-800 hover:bg-green-900 text-white rounded-full text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Reset Email...' : 'Continue'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setCurrentFlow('login')}
                className="text-green-100 hover:text-white text-base underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (currentFlow === 'reset-password') {
      if (!codeValid) {
        return <div>Verifying password reset code...</div>;
      }
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
            <p className="text-white/80">Create a secure password for your account</p>
          </div>

          {errors.general && (
            <Alert className="bg-red-100 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-green-100 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white text-base tracking-wide">
                New Password<span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={resetPasswordData.password}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })}
                  className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 pr-14 text-black placeholder:text-black/40 ${errors.password ? 'border-2 border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-black/60" /> : <Eye className="w-4 h-4 text-black/60" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-200">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-new-password" className="text-white text-base tracking-wide">
                Confirm New Password<span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 pr-14 text-black placeholder:text-black/40 ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 text-black/60" /> : <Eye className="w-4 h-4 text-black/60" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-200">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 md:h-14 bg-green-800 hover:bg-green-900 text-white rounded-full text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      );
    }

    // Main Login/Signup Forms
    return (
      <div className="space-y-8">
        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-green-100 border-green-300">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" value={currentFlow === 'signup' ? 'signup' : 'login'} onValueChange={(value) => setCurrentFlow(value as AuthFlow)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm border-0 rounded-full p-1">
            <TabsTrigger
              value="login"
              className="rounded-full text-white data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=inactive]:text-white/70 data-[state=inactive]:hover:text-white transition-all font-bold"
              // className="rounded-full text-white transition-all"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-full text-white data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=inactive]:text-white/70 data-[state=inactive]:hover:text-white transition-all font-bold"
            > 
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/80">Sign in to continue your climate journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-white text-base tracking-wide">
                  Email Address<span className="text-red-400">*</span>
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 text-black placeholder:text-black/40 ${errors.email ? 'border-2 border-red-500' : ''}`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-200">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-white text-base tracking-wide">
                  Password<span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 pr-14 text-black placeholder:text-black/40 ${errors.password ? 'border-2 border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-black/60" /> : <Eye className="w-4 h-4 text-black/60" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-200">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setCurrentFlow('forgot-password')}
                  className="text-green-100 hover:text-white text-sm underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 md:h-14 bg-green-800 hover:bg-green-900 text-white rounded-full text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-br from-green-400 to-teal-500 px-2 text-white/70">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={loginWithGoogle} variant="outline" className="h-12 bg-white/80 border-0 rounded-xl hover:bg-white">
                <GoogleIcon />
                <span className="ml-2 text-black">Google</span>
              </Button>
              <Button onClick={handleLoginFromFacebook} variant="outline" className="h-12 bg-white/80 border-0 rounded-xl hover:bg-white">
                <FacebookIcon />
                <span className="ml-2 text-black">Facebook</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-white/80">Join the climate action community</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-white text-base tracking-wide">
                  Full Name<span className="text-red-400">*</span>
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 text-black placeholder:text-black/40 ${errors.name ? 'border-2 border-red-500' : ''}`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-200">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white text-base tracking-wide">
                  Email Address<span className="text-red-400">*</span>
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 text-black placeholder:text-black/40 ${errors.email ? 'border-2 border-red-500' : ''}`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-200">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white text-base tracking-wide">
                  Password<span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (8+ characters)"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 pr-14 text-black placeholder:text-black/40 ${errors.password ? 'border-2 border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-black/60" /> : <Eye className="w-4 h-4 text-black/60" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-200">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password" className="text-white text-base tracking-wide">
                  Confirm Password<span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 pr-14 text-black placeholder:text-black/40 ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-black/60" /> : <Eye className="w-4 h-4 text-black/60" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-200">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-white text-base tracking-wide">Account Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={signupData.userType === 'individual' ? 'default' : 'outline'}
                    className={`h-12 rounded-xl ${signupData.userType === 'individual'
                      ? 'bg-green-600 text-white'
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                    onClick={() => setSignupData({ ...signupData, userType: 'individual' })}
                    disabled={isLoading}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Individual
                  </Button>
                  <Button
                    type="button"
                    variant={signupData.userType === 'business' ? 'default' : 'outline'}
                    className={`h-12 rounded-xl ${signupData.userType === 'business'
                      ? 'bg-green-600 text-white'
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                    onClick={() => setSignupData({ ...signupData, userType: 'business' })}
                    disabled={isLoading}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Business
                  </Button>
                </div>
              </div>

              {signupData.userType === 'business' && (
                <div className="space-y-2">
                  <Label htmlFor="signup-company" className="text-white text-base tracking-wide">
                    Company Name<span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="signup-company"
                    type="text"
                    placeholder="Enter your company name"
                    value={signupData.company}
                    onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                    className={`h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 text-black placeholder:text-black/40 ${errors.company ? 'border-2 border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.company && (
                    <p className="text-sm text-red-200">{errors.company}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-phone" className="text-white text-base tracking-wide">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  className="h-12 md:h-14 bg-gray-200 border-0 rounded-full px-6 text-black placeholder:text-black/40"
                  disabled={isLoading}
                />
              </div>

              {/* Fixed Checkbox with Proper Text Wrapping */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="signup-terms"
                    checked={signupData.acceptTerms}
                    onCheckedChange={(checked) => setSignupData({ ...signupData, acceptTerms: !!checked })}
                    className="mt-1 flex-shrink-0"
                    disabled={isLoading}
                  />
                  <div className="flex flex-col">
                    <Label
                      htmlFor="signup-terms"
                      className="text-white text-sm leading-relaxed cursor-pointer"
                    >
                      I agree to the{' '}
                      <span className="underline hover:text-green-200">Terms of Service</span>
                      {' '}and{' '}
                      <span className="underline hover:text-green-200">Privacy Policy</span>
                    </Label>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-200 mt-1">{errors.acceptTerms}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 md:h-14 bg-green-800 hover:bg-green-900 text-white rounded-full text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-br from-green-400 to-teal-500 px-2 text-white/70">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={loginWithGoogle} variant="outline" className="h-12 bg-white border-0 rounded-xl hover:bg-white">
                <GoogleIcon />
                <span className="ml-2 text-black">Google</span>
              </Button>
              <Button onClick={handleLoginFromFacebook} variant="outline" className="h-12 bg-white border-0 rounded-xl hover:bg-white">
                <FacebookIcon />
                <span className="ml-2 text-black">Facebook</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
}