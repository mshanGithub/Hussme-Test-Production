import "../Password Reset/Otp.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "react-otp-input";
import { useUser } from "../../Context/UserContext";

export function Otp() {
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUser();

  // Password validation criteria
  const minLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  // Validate password
  useEffect(() => {
    setPasswordValid(
      minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && passwordsMatch
    );
  }, [newPassword, confirmPassword, minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar, passwordsMatch]);

  useEffect(() => {
    // Get email from session storage
    const email = sessionStorage.getItem("resetEmail");
    if (!email) {
      // Redirect to reset page if no email is found
      toast.error("Please start the password reset process first");
      navigate("/reset-password");
    } else {
      setResetEmail(email);
    }
  }, [navigate]);

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      // Store the OTP for the next step (using it as the token)
      sessionStorage.setItem("resetToken", otp);
      
      // Show success message and move to password reset screen
      toast.success("OTP verified successfully");
      setShowOtpBox(false);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Password validation
    if (!passwordValid) {
      toast.error("Password does not meet security requirements");
      return;
    }

    setIsLoading(true);

    try {
      // Get token from session storage
      const token = sessionStorage.getItem("resetToken");

      const response = await fetch(process.env.REACT_APP_API_URL +`/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful!");
        
        // Clear session storage
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");
        
        // Log the user out
        logout();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* OTP Verification Box */}
      <div className="otp-input-box" style={{ display: showOtpBox ? "flex" : "none" }}>
        <div className="otp-icn"></div>
        <div className="otp-text">Enter Verification Code</div>
        <p>We sent a verification code to {resetEmail}</p>
        <form onSubmit={handleVerifyOtp} className="otp-form">
          <div className="otp-input">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={5}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <button 
            type="submit" 
            className="otp-reset-button"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
      
      {/* New Password Box */}
      <div className="new-pass-box" style={{ display: showOtpBox ? "none" : "flex" }}>
        <div className="new-pass-icn"></div>
        <div className="new-pass-text">Create New Password</div>
        <form onSubmit={handlePasswordReset} className="new-pass-form">
          <label htmlFor="new-pass">New Password</label>
          <input 
            type="password" 
            id="new-pass"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            placeholder="Minimum 8 characters"
            required
          />
          {passwordFocused && (
            <div className="reset-password-requirements">
              <p>Password must:</p>
              <ul>
                <li className={minLength ? "valid" : "invalid"}>
                  <i className={`bx ${minLength ? "bxs-check-circle" : "bxs-x-circle"}`}></i>
                  Be at least 8 characters long
                </li>
                <li className={hasUppercase ? "valid" : "invalid"}>
                  <i className={`bx ${hasUppercase ? "bxs-check-circle" : "bxs-x-circle"}`}></i>
                  Include at least one uppercase letter (A-Z)
                </li>
                <li className={hasLowercase ? "valid" : "invalid"}>
                  <i className={`bx ${hasLowercase ? "bxs-check-circle" : "bxs-x-circle"}`}></i>
                  Include at least one lowercase letter (a-z)
                </li>
                <li className={hasNumber ? "valid" : "invalid"}>
                  <i className={`bx ${hasNumber ? "bxs-check-circle" : "bxs-x-circle"}`}></i>
                  Include at least one number (0-9)
                </li>
                <li className={hasSpecialChar ? "valid" : "invalid"}>
                  <i className={`bx ${hasSpecialChar ? "bxs-check-circle" : "bxs-x-circle"}`}></i>
                  Include at least one special character (!@#$%^&amp;*(),.?&quot;:{}|&lt;&gt;)
                </li>
              </ul>
            </div>
          )}
          <label htmlFor="confirm-pass">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-pass"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />
          {confirmPassword && newPassword && !passwordsMatch && (
            <div className="password-error">
              <p className="invalid">Passwords do not match</p>
            </div>
          )}
          <button 
            type="submit" 
            className="new-pass-button"
            disabled={isLoading || !passwordValid}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
          <Link className="back-page" to="/login">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}
