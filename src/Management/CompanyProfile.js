import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Components/Context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Management/CompanyProfile.css";

export function CompanyProfile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    dba: "",
    fedraltaxid: "",
    industry: "",
    email: "",
    phone: "",
    website: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    state: "",
    country: "",
    linkedin: "",
    facebook: "",
    insta: "",
    x: "",
    youtube: "",
    fontfamily: "",
    color1: "#ffffff",
    color2: "#ffffff",
    color3: "#ffffff",
  });

  const [formErrors, setFormErrors] = useState({});

  // Function to toggle the logout dropdown
  const toggleLogout = () => setShowLogout(!showLogout);

  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setShowLogout(false);
  };

  // Function to navigate to change password page
  const handleChangePassword = (e) => {
    e.preventDefault();
    setShowLogout(false);
    navigate("/reset-password");
  };

  // Fetch company profile data
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
        setFormData({
          companyName: response.data.companyName || "",
          dba: response.data.dba || "",
          fedraltaxid: response.data.fedraltaxid || "",
          industry: response.data.industry || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          website: response.data.website || "",
          address1: response.data.address1 || "",
          address2: response.data.address2 || "",
          city: response.data.city || "",
          zip: response.data.zip || "",
          state: response.data.state || "",
          country: response.data.country || "",
          linkedin: response.data.linkedin || "",
          facebook: response.data.facebook || "",
          insta: response.data.insta || "",
          x: response.data.x || "",
          youtube: response.data.youtube || "",
          fontfamily: response.data.fontfamily || "",
          color1: response.data.color1 || "#ffffff",
          color2: response.data.color2 || "#ffffff",
          color3: response.data.color3 || "#ffffff",
        });

        setPreview(
          response.data.logo ||
            "https://i.ibb.co/4wrxz3pC/image-upload-icon.png"
        );
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Map form field IDs to formData property names
    const fieldMapping = {
      "cmpy-name": "companyName",
      "cmpy-dba": "dba",
      "cmpy-taxid": "fedraltaxid",
      "cmpy-industry": "industry",
      "cmpy-email": "email",
      "cmpy-phone": "phone",
      "cmpy-website": "website",
      "cmpy-address1": "address1",
      "cmpy-address2": "address2",
      "cmpy-city": "city",
      "cmpy-state": "state",
      "cmpy-zip": "zip",
      "cmpy-country": "country",
      "cmpy-linkedin": "linkedin",
      "cmpy-facebook": "facebook",
      "cmpy-insta": "insta",
      "cmpy-twitter": "x",
      "cmpy-youtube": "youtube",
      "cmpy-fontfamily": "fontfamily",
      "cmpy-color1": "color1",
      "cmpy-color2": "color2",
      "cmpy-color3": "color3",
    };

    setFormData({
      ...formData,
      [fieldMapping[id] || id]: value,
    });
  };

  const previewFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.companyName.trim())
      errors.companyName = "Company name is required";
    if (!formData.industry.trim()) errors.industry = "Industry is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    setFormErrors(errors);

    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to update company profile");
        navigate("/login");
        return;
      }

      // Create a FormData object for multipart/form-data submission
      const formDataToSubmit = new FormData();

      // Add all text fields
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      // Add the logo file if it exists
      if (logoFile) {
        formDataToSubmit.append("logo", logoFile);
      }

      // Make API request
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/company/update-company-profile",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      toast.success("Company profile updated successfully!");
      setEditMode(false);

      // Update local state with the latest data
      setCompanyProfile(response.data.companyProfile);
      setLogoFile(null); // Reset file input
    } catch (error) {
      // Handle error
      console.error("Error updating company profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update company profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    // Reset any form errors when toggling edit mode
    setFormErrors({});
  };

  // If still loading, show a loading message
  if (loading) {
    return (
      <div className="loader-container">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="company-profile-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="profile-management-content">
        <div className="info-row"></div>
        <div className="profile-header">
          <h1>Company Profile</h1>
          <button
            className={`edit-toggle-button ${
              editMode ? "save-mode" : "edit-mode"
            }`}
            onClick={toggleEditMode}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {!editMode ? (
          // View Mode
          <div className="company-details-view">
            <div className="company-info-section">
              <img
                src={companyProfile.logo}
                // src={getImageUrl(companyProfile.logo)}
                alt={companyProfile.companyName}
                className="profile-logo"
              />
              <div className="info-group">
                <h3>Company Name</h3>
                <p>{companyProfile.companyName || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Doing Business As (DBA)</h3>
                <p>{companyProfile.dba || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Federal Tax ID</h3>
                <p>{companyProfile.fedraltaxid || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Industry</h3>
                <p>{companyProfile.industry || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Email</h3>
                <p>{companyProfile.email || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Phone</h3>
                <p>{companyProfile.phone || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Website</h3>
                <p>{companyProfile.website || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Address Line 1</h3>
                <p>{companyProfile.address1 || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Address Line 2</h3>
                <p>{companyProfile.address2 || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>City</h3>
                <p>{companyProfile.city || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>State</h3>
                <p>{companyProfile.state || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>ZIP Code</h3>
                <p>{companyProfile.zip || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Country</h3>
                <p>{companyProfile.country || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>LinkedIn</h3>
                <p>{companyProfile.linkedin || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Facebook</h3>
                <p>{companyProfile.facebook || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Instagram</h3>
                <p>{companyProfile.insta || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>X (Twitter)</h3>
                <p>{companyProfile.x || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>YouTube</h3>
                <p>{companyProfile.youtube || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Font Family</h3>
                <p>{companyProfile.fontfamily || "N/A"}</p>
              </div>
              <div className="info-group">
                <h3>Primary Color</h3>
                <p
                  style={{
                    backgroundColor: companyProfile.color1 || "#ffffff",
                    borderRadius: "3px",
                    padding: "5px",
                  }}
                >
                  {companyProfile.color1 || "N/A"}
                </p>
              </div>
              <div className="info-group">
                <h3>Secondary Color</h3>
                <p
                  style={{
                    backgroundColor: companyProfile.color2 || "#ffffff",
                    borderRadius: "3px",
                    padding: "5px",
                  }}
                >
                  {companyProfile.color2 || "N/A"}
                </p>
              </div>
              <div className="info-group">
                <h3>Tertiary Color</h3>
                <p
                  style={{
                    backgroundColor: companyProfile.color3 || "#ffffff",
                    borderRadius: "3px",
                    padding: "5px",
                  }}
                >
                  {companyProfile.color3 || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="company-details-edit">
            <form className="edit-company-form" onSubmit={handleSubmit}>
              <div className="company-logo-section edit-logo">
                <div className="logo-upload">
                  <label htmlFor="company-logo" className="logo-label">
                    Company Logo
                  </label>
                  <input
                    id="company-logo"
                    className="logo-input"
                    type="file"
                    onChange={previewFile}
                  />
                </div>
                <img
                  src={preview}
                  alt="Company logo preview"
                  className="profile-logo-preview"
                />
              </div>

              <div className="edit-form-input-container">
                <div className="form-group">
                  <label htmlFor="cmpy-name">Company Name</label>
                  <input
                    type="text"
                    id="cmpy-name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-dba">DBA</label>
                  <input
                    type="text"
                    id="cmpy-dba"
                    value={formData.dba}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-taxid">Federal Tax ID</label>
                  <input
                    type="text"
                    id="cmpy-taxid"
                    value={formData.fedraltaxid}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-industry">Industry</label>
                  <input
                    type="text"
                    id="cmpy-industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-email">Email</label>
                  <input
                    type="email"
                    id="cmpy-email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-phone">Phone</label>
                  <input
                    type="tel"
                    id="cmpy-phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-website">Website</label>
                  <input
                    type="url"
                    id="cmpy-website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-address1">Address Line 1</label>
                  <input
                    type="text"
                    id="cmpy-address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-address2">Address Line 2</label>
                  <input
                    type="text"
                    id="cmpy-address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-city">City</label>
                  <input
                    type="text"
                    id="cmpy-city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-state">State</label>
                  <input
                    type="text"
                    id="cmpy-state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-zip">ZIP Code</label>
                  <input
                    type="text"
                    id="cmpy-zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-country">Country</label>
                  <input
                    type="text"
                    id="cmpy-country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-linkedin">LinkedIn</label>
                  <input
                    type="url"
                    id="cmpy-linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-facebook">Facebook</label>
                  <input
                    type="url"
                    id="cmpy-facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-insta">Instagram</label>
                  <input
                    type="url"
                    id="cmpy-insta"
                    value={formData.insta}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-twitter">X (Twitter)</label>
                  <input
                    type="url"
                    id="cmpy-twitter"
                    value={formData.x}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-youtube">YouTube</label>
                  <input
                    type="url"
                    id="cmpy-youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-fontfamily">Font Family</label>
                  <input
                    type="text"
                    id="cmpy-fontfamily"
                    value={formData.fontfamily}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-color1">Primary Color</label>
                  <input
                    type="color"
                    id="cmpy-color1"
                    className="edit-color-input"
                    value={formData.color1}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-color2">Secondary Color</label>
                  <input
                    type="color"
                    id="cmpy-color2"
                    className="edit-color-input"
                    value={formData.color2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cmpy-color3">Tertiary Color</label>
                  <input
                    type="color"
                    id="cmpy-color3"
                    className="edit-color-input"
                    value={formData.color3}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="save-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
