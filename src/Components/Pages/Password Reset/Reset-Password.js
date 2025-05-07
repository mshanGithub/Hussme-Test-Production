import { Link, useNavigate } from "react-router-dom";
import "../Password Reset/Reset-Password.css";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Reset() {
  const [email, setEmail] = useState("");
  const [showPage1, setShowPage1] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input
  const handleEmailInput = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  // Handle password reset request
  const handleResetRequest = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!isValidEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL +"/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store email in session storage for use in OTP verification
        sessionStorage.setItem("resetEmail", email);
        toast.success("Reset email sent successfully");
        // Toggle to page 2
        setShowPage1(false);
      } else {
        toast.error(data.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation to OTP page
  const handleNext = () => {
    navigate("/otp");
  };

  return (
    <>
      <div className="reset-page">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Page 1: Email Input */}
        <div className="reset-page-1" style={{ display: showPage1 ? "flex" : "none" }}>
          <div className="page-1-icn"></div>
          <div className="forgot-text">Forgot Password?</div>
          <form className="forgot-form" onSubmit={handleResetRequest}>
            <label htmlFor="email">Email</label>
            <div className="reset-input-box">
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailInput}
                placeholder="Enter your registered email"
                className={!isValidEmail ? "invalid-input" : ""}
                required
              />
            </div>
            <button 
              type="submit" 
              className="forgot-reset-button"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </button>
          </form>
          <Link className="back-page" to="/login">
            Back to login
          </Link>
        </div>
        
        {/* Page 2: Email Sent Confirmation */}
        <div className="reset-page-2" style={{ display: showPage1 ? "none" : "flex" }}>
          <div className="page-2-icn"></div>
          <div className="forgot-text">Check your email</div>
          <p>We sent a password reset OTP to your email: {email}</p>

          <button
            onClick={() => window.open("https://mail.google.com", "_blank")}
            className="forgot-reset-button"
          >
            Open email app
          </button>
          <Link to='/otp' className="next-button" onClick={handleNext}>Next</Link>

          <Link className="back-page" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
}
