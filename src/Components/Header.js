import { Link, useNavigate } from "react-router-dom";
import logo from "../Components/Assets/Home-Header-Footer/hussme-sep-logo.png";
import "../Components/Header.css";
import cross from "../Components/Assets/Home-Header-Footer/cross.png";
import { useUser } from "../Components/Context/UserContext"; // Import UserContext
import { useState } from "react"; // Import useState

export function Header() {
  const { user, logout } = useUser(); // Get user and logout from context
  const [showLogout, setShowLogout] = useState(false); // State to toggle logout button visibility
  const navigate = useNavigate();

  function showSidebar(event) {
    event.preventDefault();
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "flex";
  }

  function hideSidebar(event) {
    event.preventDefault();
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "none";
  }

  // Function to toggle the logout dropdown
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  // Function to handle logout click
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setShowLogout(false); // Hide the logout button after logging out
  };

  // Function to navigate to change password page
  const handleChangePassword = (e) => {
    e.preventDefault();
    setShowLogout(false); // Hide the dropdown
    navigate("/reset-password");
  };

  // Function to close dropdown when clicking outside
  const closeDropdown = () => {
    setShowLogout(false);
  };

  return (
    <div className="nav-bar" onClick={closeDropdown}>
      <header>
        <nav>
          <ul className="sidebar">
            <li onClick={hideSidebar}>
              <img className="cross-icn" src={cross} alt="" />
            </li>
            <li onClick={hideSidebar}>
              <Link to="/">Home</Link>
            </li>
            <li onClick={hideSidebar}>
              <Link to="/service">Services</Link>
            </li>

            <li onClick={hideSidebar}>
              <Link to="/blog">Blog</Link>
            </li>
            <li onClick={hideSidebar}>
              <Link to="/contact">Contact US</Link>
            </li>
            <li onClick={hideSidebar}>
              <div className="username-logout-buttons">
                {user ? (
                  <div className="mobile-user-menu">
                    <span
                      className="mobile-username"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLogout();
                      }}
                    >
                      {user.username}
                    </span>
                    {showLogout && (
                      <div className="mobile-user-dropdown">
                        <Link
                          className="change-password-button"
                          onClick={handleChangePassword}
                        >
                          Change Password
                        </Link>
                        <Link className="logout-button" onClick={handleLogout}>
                          Logout
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link className="login-name" to="/login">
                      <div className="user-profile-1">
                        <p>Login</p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </li>
          </ul>

          <ul className="desk-navbar">
            <li>
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" />
                </Link>
              </div>
            </li>
            <li className="hideWhileMobileOn">
              <Link to="/" className="logo-link">
                Home
              </Link>
            </li>
            <li className="hideWhileMobileOn">
              <Link to="/service" className="logo-link">
                Services
              </Link>
            </li>
            <li className="hideWhileMobileOn">
              <Link to="/management" className="logo-link">
                Management
              </Link>
            </li>
           
            <li className="hideWhileMobileOn">
              <Link to="/blog" className="logo-link">
                Blog
              </Link>
            </li>
            <li className="hideWhileMobileOn">
              <Link to="/contact" className="logo-link">
                Contact US
              </Link>
            </li>
            {/* <li className="hideWhileMobileOn">
              {user ? (
                <div
                  className="user-dropdown-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="desk-username" onClick={toggleLogout}>
                    {user.username}
                  </span>
                  {showLogout && (
                    <div className="logout-dropdown">
                      <Link
                        className="change-password-button"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </Link>
                      <Link className="logout-button" onClick={handleLogout}>
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link className="login-name" to="/login">
                    <div
                      aria-label="User Login Button"
                      tabindex="0"
                      role="button"
                      className="user-profile-1"
                    >
                      <div className="user-profile-inner">
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g data-name="Layer 2" id="Layer_2">
                            <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"></path>
                          </g>
                        </svg>
                        <p>Log In</p>
                      </div>
                    </div>
                  </Link>
                </>
              )}
            </li> */}
            <li className="hideWhileMobileOn">
              {user ? (
                <div
                  className="user-dropdown-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="desk-username" onClick={toggleLogout}>
                    {user.username}
                  </span>
                  {showLogout && (
                    <div className="logout-dropdown">
                      <Link
                        className="change-password-button"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </Link>
                      <Link className="logout-button" onClick={handleLogout}>
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link className="login-name" to="/login">
                  <div className="user-profile-1">
                    <p>Login</p>
                  </div>
                </Link>
              )}
            </li>
            <li className="menu-button" onClick={showSidebar}>
              <Link to="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#FFFFFF"
                >
                  <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
