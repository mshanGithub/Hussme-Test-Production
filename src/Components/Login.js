import { Link, useNavigate } from "react-router-dom";
import "../Components/Login.css";
import { useEffect, useState } from "react";
import { useUser } from "../Components/Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  // Password validation criteria
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password
  useEffect(() => {
    setPasswordValid(
      minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
    );
  }, [
    password,
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!passwordValid) {
      toast.error("Password does not meet security requirements");
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Account created successfully!");
        // Switch to login form after successful signup
        document.querySelector(".login-container").classList.remove("active");
      } else {
        toast.error(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL +"/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        login(result.Token);
        toast.success("Login Successful!");
        
        // Check if user has a company profile
        try {
          const profileResponse = await fetch(process.env.REACT_APP_API_URL +"/company/get-company-profile", {
            headers: {
              'Authorization': `Bearer ${result.Token}`
            }
          });
          
          // If profile exists, redirect to management page
          if (profileResponse.ok) {
            setTimeout(() => {
              // navigate("/management");
              navigate("/management");
            }, 1500);
          } else {
            // If profile doesn't exist, redirect to create profile page
            setTimeout(() => {
              // navigate("/");
              navigate("/new-company");
            }, 1500);
          }
        } catch (profileError) {
          console.error("Error checking profile:", profileError);
          // Default fallback - redirect to new company profile
          setTimeout(() => {
            navigate("/new-company");
          }, 1500);
        }
      } else {
        toast.error(
          result.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  useEffect(() => {
    const container = document.querySelector(".login-container");
    const registerBtn = document.querySelector(".toggle-signup-btn");
    const loginBtn = document.querySelector(".toggle-login-btn");

    if (registerBtn && loginBtn && container) {
      const handleRegisterClick = () => container.classList.add("active");
      const handleLoginClick = () => container.classList.remove("active");

      registerBtn.addEventListener("click", handleRegisterClick);
      loginBtn.addEventListener("click", handleLoginClick);

      return () => {
        registerBtn.removeEventListener("click", handleRegisterClick);
        loginBtn.removeEventListener("click", handleLoginClick);
      };
    }
  }, []);

  return (
    <>
      <div className="login-page">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="login-container">
          {/* Login Form */}
          <div className="form-box login">
            <form onSubmit={handleLoginSubmit}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <div className="forgot-link">
                <Link to="/reset-password">Forgot the password?</Link>
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </div>

          {/* Signup Form */}
          <div className="form-box signup">
            <form onSubmit={handleSubmit}>
              <h1>Signup</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="bx bxs-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              {/* Password Requirements */}
              {passwordFocused && (
                <div className="password-requirements">
                  <p>Password must:</p>
                  <ul>
                    <li className={minLength ? "valid" : "invalid"}>
                      <i
                        className={`bx ${
                          minLength ? "bxs-check-circle" : "bxs-x-circle"
                        }`}
                      ></i>
                      Must 8 chars
                    </li>
                    <li className={hasUppercase ? "valid" : "invalid"}>
                      <i
                        className={`bx ${
                          hasUppercase ? "bxs-check-circle" : "bxs-x-circle"
                        }`}
                      ></i>
                      A-Z
                    </li>
                    <li className={hasLowercase ? "valid" : "invalid"}>
                      <i
                        className={`bx ${
                          hasLowercase ? "bxs-check-circle" : "bxs-x-circle"
                        }`}
                      ></i>
                      a-z
                    </li>
                    <li className={hasNumber ? "valid" : "invalid"}>
                      <i
                        className={`bx ${
                          hasNumber ? "bxs-check-circle" : "bxs-x-circle"
                        }`}
                      ></i>
                      0-9
                    </li>
                    <li className={hasSpecialChar ? "valid" : "invalid"}>
                      <i
                        className={`bx ${
                          hasSpecialChar ? "bxs-check-circle" : "bxs-x-circle"
                        }`}
                      ></i>
                      !@#
                    </li>
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className={`signup-btn ${passwordValid ? "" : "disabled"}`}
                disabled={!passwordValid}
              >
                Signup
              </button>
            </form>
          </div>

          {/* Toggle Box */}
          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Hello! Welcome</h1>
              <p>Don't have an account?</p>
              <button className="toggle-signup-btn">Signup</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome Back</h1>
              <p>Already have an account?</p>
              <button className="toggle-login-btn">Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
