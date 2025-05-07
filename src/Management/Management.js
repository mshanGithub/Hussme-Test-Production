import "../Management/Management.css";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Components/Context/UserContext";
import { ContentManagement } from "./ContentManagement";
import { TrainingProcess } from "./TrainingProcess";
import { Hiring } from "./Hiring";
import { CompanyProfile } from "./CompanyProfile";
import logo from "../Components/Assets/Home-Header-Footer/hussme-sep-logo.png";

export function Management() {
  const { user, logout } = useUser();
  const [showLogout, setShowLogout] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [activeComponent, setActiveComponent] = useState(<ContentManagement />);
  const [activeIndex, setActiveIndex] = useState(0); // Track the active sidebar index
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to toggle the logout dropdown
  const toggleLogout = (e) => {
    e.stopPropagation();
    setShowLogout(!showLogout);
    setShowCompanyDropdown(false);
  };

  // Function to toggle the company logo dropdown
  const toggleCompanyDropdown = (e) => {
    e.stopPropagation();
    setShowCompanyDropdown(!showCompanyDropdown);
    setShowLogout(false);
  };

  // Function to handle logout and navigate to home
  const handleLogoutAndNavigate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate("/");
  };

  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setShowLogout(false);
    setShowCompanyDropdown(false);
  };

  // Function to navigate to change password page
  const handleChangePassword = (e) => {
    e.preventDefault();
    setShowLogout(false);
    setShowCompanyDropdown(false);
    navigate("/reset-password");
  };

  // Function to close dropdowns when clicking outside
  const closeDropdowns = () => {
    setShowLogout(false);
    setShowCompanyDropdown(false);
  };

  // Function to load components dynamically
  const loadComponent = (component, index) => {
    setActiveComponent(component);
    setActiveIndex(index);
  };

  // Fetch company profile data on component mount
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/company/get-company-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCompanyProfile(response.data);
      } catch (error) {
        console.error("Error fetching company profile:", error);

        // If profile not found, redirect to create profile
        if (error.response && error.response.status === 404) {
          navigate("/new-company");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [navigate]);

  // Add click handler to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeDropdowns();
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Helper function to get proper image URL
  const getImageUrl = (logoPath) => {
    if (!logoPath) return "https://i.ibb.co/4wrxz3pC/image-upload-icon.png";

    // If it's a full URL already (like a base64 string), return as is
    if (logoPath.startsWith("data:image")) return logoPath;

    // Otherwise, prepend the server URL
    // Remove /api from the URL when constructing image path since logo paths already include the correct structure
    const baseUrl = process.env.REACT_APP_API_URL.replace("/api", "");
    return baseUrl + logoPath;
  };

  if (loading) {
    return (
      <div className="loader-container">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <>
      <div className="mgmt-page" onClick={closeDropdowns}>
        {/* Start of navbar */}
        <div className="mgmt-navbar">
          {/* Left side - Company Logo */}
          <div
            className="company-logo-container"
            onClick={(e) => toggleCompanyDropdown(e)}
          >
            {companyProfile && companyProfile.logo ? (
              <img
                src={getImageUrl(companyProfile.logo)}
                alt="https://i.ibb.co/Tx7tzcQ6/freepicdownloader-com-square-p-letter-logo-medium.jpg"
                className="company-logo"
                title="Click for options"
              />
            ) : (
              <div className="logo-placeholder">Logo</div>
            )}

            {showCompanyDropdown && (
              <div className="company-dropdown">
                <div className="dropdown-header">
                  {companyProfile?.companyName}
                </div>

                <Link
                  className="dropdown-item"
                  onClick={(e) => loadComponent(<CompanyProfile />, 3)}
                >
                  Edit Profile
                </Link>
                <Link
                  className="dropdown-item logout-btn"
                  onClick={handleLogoutAndNavigate}
                >
                  Logout & Go Home
                </Link>
              </div>
            )}
          </div>

          {/* Center - Company Name */}
          <div className="center-company-name">
            {companyProfile ? companyProfile.companyName : "Company Name"}
          </div>

          {/* Right side - Website Logo */}
          <div className="website-logo-container">
            <Link to="/">
              <img className="website-logo" src={logo} alt="Hussme" />
            </Link>
          </div>
        </div>
        {/* End of navbar */}

        {/* Start of Sidebar */}
        <div className="management-section">
          <div className="mgmt-sidebar">
            <ul>
              <li
                onClick={() => loadComponent(<ContentManagement />, 0)}
                className={activeIndex === 0 ? "active-sidebar-item" : ""}
              >
                <NavLink>
                  <img
                    src="https://i.ibb.co/Mx9t19CT/document-gear.png"
                    className="mgmt-sidebar-icn"
                  />
                  <div className="mgmt-sidebar-title">Content Management</div>
                  <span className="mgmt-tooltiptext">Content Management</span>
                </NavLink>
              </li>
              <li
                onClick={() => loadComponent(<TrainingProcess />, 1)}
                className={activeIndex === 1 ? "active-sidebar-item" : ""}
              >
                <NavLink>
                  <img
                    src="https://i.ibb.co/WvzP2QgX/chart-user.png"
                    className="mgmt-sidebar-icn"
                  />
                  <span className="mgmt-sidebar-title">Process & Training</span>
                  <span className="mgmt-tooltiptext">Process & Training</span>
                </NavLink>
              </li>
              <li
                onClick={() => loadComponent(<Hiring />, 2)}
                className={activeIndex === 2 ? "active-sidebar-item" : ""}
              >
                <NavLink>
                  <img
                    src="https://i.ibb.co/s9sNfp8X/assign.png"
                    className="mgmt-sidebar-icn"
                  />
                  <span className="mgmt-sidebar-title">Hiring</span>
                  <span className="mgmt-tooltiptext">Hiring</span>
                </NavLink>
              </li>
              <li
                onClick={() => loadComponent(<CompanyProfile />, 3)}
                className={activeIndex === 3 ? "active-sidebar-item" : ""}
              >
                <NavLink>
                  <img
                    src="https://i.ibb.co/svcBG24t/user-gear.png"
                    className="mgmt-sidebar-icn"
                  />
                  <span className="mgmt-sidebar-title">Company Profile</span>
                  <span className="mgmt-tooltiptext">Company Profile</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Render Dynamic Component */}
          <div className="mgmt-content">{activeComponent}</div>
        </div>
      </div>
    </>
  );
}
