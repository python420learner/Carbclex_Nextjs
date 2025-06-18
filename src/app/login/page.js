'use client'
import { React, useState, useEffect } from "react";
import "./page.css"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from '../firebase';
import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Navbar from "../components/Navbar";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = getAuth(app);
  const [resetEmail, setResetEmail] = useState(""); // For forgot password
  const [showResetPassword, setShowResetPassword] = useState(false); // Toggle forgot password UI
  const [formState, setFormState] = useState('login');
  const [hasScrolled_market, setHasScrolled_market] = useState(false);

  useEffect(() => {
    fetch(`/api/auth/check-session`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          window.location.href = "/dashboard";
        }
      })
      .catch((err) => {
        console.error("Session check failed", err);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled vertically
      if (window.scrollY > 0) {
        setHasScrolled_market(true);
      } else {
        setHasScrolled_market(false);
      }
    };

    // Add the event listener inside the effect
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleForgotPasswordClick = () => {
    setFormState('forgotPassword'); // Switch to "forgot password" mode
  };

  const handleBackToLogin = () => {
    setFormState('login'); // Switch back to "login" mode
  };

  const handlePasswordResetSubmit = () => {
    setFormState('resetPassword'); // Switch to "reset password" mode
  };

  const handlePasswordChange = () => {
    console.log("Password changed successfully!");
    // Add logic to update the password
    setFormState('final'); // Redirect back to login after resetting the password
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user && user.emailVerified) {
        console.log("User is verified");
        const idToken = await user.getIdToken();

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`
          },
          credentials: "include", // VERY IMPORTANT for session cookie
        }).then(res => res.text())
          .then(data => console.log(data))
          .catch(err => console.error(err));

        if (user && user.emailVerified) {
          // ✅ Redirect only if login and session are successful
          router.push("/dashboard");
        }
      } else {
        alert("Please verify your email before logging in.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result);
        const idToken = await result.user.getIdToken();

        // Send this token to your Spring Boot backend
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          // Login and session successful
          router.push("/dashboard");
          // window.location.href = "/dashboard";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loginWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        router.push("/Content");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendPasswordReset = () => {
    if (!resetEmail) {
      alert("Please enter your email address.");
      return;
    }
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        alert("Password reset email sent. Please check your inbox.");
        setShowResetPassword(false); // Close reset password UI
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error.message);
        alert("Error: Unable to send password reset email.");
      });
  };

  return (
    <>
      <div style={{ marginTop: '1.3rem' }} id='navbar' >
        <Navbar />
      </div>
      <div
        className="logincontainer" >
        <div className="small-container">
          <div className="left">
            <div style={{ width: '70%' }}>
              <h1 style={{ fontWeight: '800' }}>Welcome Back !</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam,
                sed. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet
                consectetur adipisicing elit.
              </p>

            </div>
          </div>
          <div className="right">
            {formState === 'login' && (
              <form onSubmit={submitHandler}>
                <div className="inputsField">
                  <label htmlFor="email">e-mail <span style={{ color: 'red' }}>*</span></label>
                  <input onChange={(e) => setEmail(e.target.value)} className="inputField" type="email" name="email" placeholder="john@example.email" required
                  />
                  <label htmlFor="password">Password <span style={{ color: 'red' }}>*</span></label>
                  <input onChange={(e) => setPassword(e.target.value)} className="inputField" type="password" name="password" placeholder="password*"
                    required />
                </div>


                <button className="btn" type="submit">
                  LogIn{" "}
                </button>
                <div className="forgotPassword" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBlock: '4px', gap: '5px' }}>
                  <div>
                    <button type="button" style={{ backgroundColor: 'transparent', border: 'none', color: 'white' }} onClick={handleForgotPasswordClick}>
                      Forgot password </button>

                  </div>
                  <div style={{ color: '#B6C9C8', fontWeight: 'bold', margin: '2px' }}> Don&apos;t have an account? <Link href="/signup" style={{ color: 'white', fontWeight: 'light' }}>SignUp</Link> </div>
                  <div className="others">
                    <div className="line-login"></div>
                    <div className="or">
                      <p style={{ color: 'white', fontSize: 'x-large' }}>OR</p>
                    </div>
                    <div className="line-login"></div>
                  </div>
                  <p style={{ color: '#B6C9C8', fontWeight: 'bold' }}>Continue with</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    <button onClick={loginWithGoogle} id="googleBtn" className="btn-m" type="button"
                    >
                      <FontAwesomeIcon icon={faGoogle} color='white' size='1x' style={{ marginRight: '8px' }} />Google{" "}
                    </button>
                    <button onClick={loginWithFacebook} id="facebookBtn" className="btn-m" type="button"
                    >
                      <FontAwesomeIcon icon={faFacebook} color='white' size='1x' style={{ marginRight: '8px' }} /> Facebook{" "}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 'small', textAlign: 'center', color: 'white' }}>By registering you agree with our <span style={{ color: '#033614' }}> Terms and Conditions</span></p>
              </form>
            )}
            {formState === 'forgotPassword' && (

              // Forgot Password Form

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '80%', marginTop: '40%' }}>
                <div>
                  <p>Registered e-mail <span style={{ color: 'red' }}>*</span></p>
                  <input type="text" placeholder="john@gmail.com" style={{ display: 'block', width: '100%', padding: '0.4rem 1rem', borderRadius: '40px' }} required />

                </div>
                <button className="btn" onClick={handlePasswordResetSubmit}>
                  Continue
                </button>
                <button
                  style={{ margin: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              </div>
            )}
            {formState === 'resetPassword' && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '80%', marginTop: '40%', gap: '1rem' }}>
                <div>
                  <label>Enter New Password <span style={{ color: 'red' }}>*</span></label>
                  <input type="password" placeholder="New Password" style={{ width: '100%', padding: '0.4rem 1rem', borderRadius: '40px' }} aria-required />

                </div>
                <div>
                  <label>Confirm New Password <span style={{ color: 'red' }}>*</span></label>
                  <input type="password" placeholder="Confirm Password" style={{ width: '100%', padding: '0.4rem 1rem', borderRadius: '40px' }} required />

                </div>
                <button className="btn" onClick={handlePasswordChange} style={{ fontSize: 'medium', fontWeight: 'bold' }}>
                  Set New Password
                </button>
              </div>
            )}
            {formState === 'final' && (
              <div style={{ display: 'flex', flexDirection: 'column', width: '80%', marginTop: '40%', gap: '0.5rem', marginBottom: '0', textAlign: 'center', color: 'white' }}>
                <p>Dear User,</p>
                <h2 style={{ fontWeight: 'bolder' }}>Your Password has been Reset.</h2>
                <FontAwesomeIcon icon={faCheck} color='white' size='6x' />
                <button
                  style={{ margin: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                  onClick={handleBackToLogin}
                >
                  Click here to <u>Login</u>
                </button>
              </div>

            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
