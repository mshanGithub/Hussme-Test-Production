import { useNavigate } from "react-router-dom";
import "../Management/NewCompanyProfile.css";
import React, { useState } from "react";
// import { useUser } from "../Components/Context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export function NewCompanyProfile() {
  // const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    color1: "#ffffff", // Using the color you specified
    color2: "#ffffff",
    color3: "#ffffff",
    logoUrl: "", // Add this to store the logo URL
  });
  const [formErrors, setFormErrors] = useState({});
  const [wasValidated, setWasValidated] = useState(false);
  const [preview, setPreview] = useState(
    "https://i.ibb.co/4wrxz3pC/image-upload-icon.png"
  );
  const [logoFile, setLogoFile] = useState(null);
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(false);

  const usaCities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
  ];

  const filteredCities = usaCities.filter((city) =>
    city.toLowerCase().startsWith(input.toLowerCase())
  );

  const handleSelect = (city) => {
    setFormData({ ...formData, city });
    setInput(city);
    setShowList(false);
  };

  const previewFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLogoFile(file); // Save the file for submission
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Show a preview of the image
    };
    reader.readAsDataURL(file);

    try {
      const ext = file.name.split(".").pop();
      const newFileName = `company-logo.${ext}`;

      // Get a pre-signed upload URL from the server
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/get-upload-url`,
        {
          params: { fileName: newFileName },
        }
      );

      const uploadUrl = res.data.url;
      const imageUrlOnly = uploadUrl.split("?")[0];

      // Upload the file to Azure Blob Storage
      await axios.put(uploadUrl, file, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
      });

      setPreview(imageUrlOnly); // Set preview to uploaded URL
      setFormData((prev) => ({ ...prev, logoUrl: imageUrlOnly })); // Add to formData
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Logo upload failed.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldMapping = {
      "cmpy-name": "companyName",
      "cmpy-dba": "dba",
      "cmpy-fedraltaxid": "fedraltaxid",
      "cmpy-industry": "industry",
      "cmpy-email": "email",
      "cmpy-phone": "phone",
      "cmpy-website": "website",
      "cmpy-address1": "address1",
      "cmpy-address2": "address2",
      "cmpy-city": "city",
      "cmpy-zip": "zip",
      "cmpy-state": "state",
      "cmpy-country": "country",
      "cmpy-linkedin": "linkedin",
      "cmpy-facebook": "facebook",
      "cmpy-insta": "insta",
      "cmpy-x": "x",
      "cmpy-youtube": "youtube",
      "cmpy-fontfamily": "fontfamily",
      "cmpy-color1": "color1",
      "cmpy-color2": "color2",
      "cmpy-color3": "color3",
    };

    setFormData({
      ...formData,
      [fieldMapping[id]]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    setWasValidated(true);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create a company profile");
        navigate("/login");
        return;
      }

      // Prepare form data
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("companyName", formData.companyName);
      formDataToSubmit.append("dba", formData.dba);
      formDataToSubmit.append("fedraltaxid", formData.fedraltaxid);
      formDataToSubmit.append("industry", formData.industry);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("phone", formData.phone);
      formDataToSubmit.append("website", formData.website);
      formDataToSubmit.append("address1", formData.address1);
      formDataToSubmit.append("address2", formData.address2);
      formDataToSubmit.append("city", formData.city);
      formDataToSubmit.append("zip", formData.zip);
      formDataToSubmit.append("state", formData.state);
      formDataToSubmit.append("country", formData.country);
      formDataToSubmit.append("linkedin", formData.linkedin);
      formDataToSubmit.append("facebook", formData.facebook);
      formDataToSubmit.append("insta", formData.insta);
      formDataToSubmit.append("x", formData.x);
      formDataToSubmit.append("youtube", formData.youtube);
      formDataToSubmit.append("fontfamily", formData.fontfamily);
      formDataToSubmit.append("color1", formData.color1);
      formDataToSubmit.append("color2", formData.color2);
      formDataToSubmit.append("color3", formData.color3);

      // Add logo to the form data
      if (logoFile) {
        // If a file is uploaded, append it to the form data
        formDataToSubmit.append("logo", logoFile);
      } else if (formData.logoUrl) {
        // If a logo URL is provided, append it as a string
        formDataToSubmit.append("logoUrl", formData.logoUrl);
      }

      // Send the request to the server
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/company/update-company-profile`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      toast.success("Company profile created successfully!");
      setTimeout(() => navigate("/management"), 2000);
    } catch (err) {
      console.error("Profile submission error:", err);
      toast.error(
        err.response?.data?.message || "Failed to create company profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.companyName.trim())
      errors.companyName = "Company name is required";
    if (!formData.industry.trim()) errors.industry = "Industry is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.dba.trim()) errors.dba = "DBA is required";
    if (!formData.fedraltaxid.trim())
      errors.fedraltaxid = "Federal Tax ID is required";
    return errors;
  };

  // Function to get the right placeholder for each field
  const getPlaceholder = (fieldName, defaultText) => {
    // If field has been validated and has an error, show the error message
    if (wasValidated && formErrors[fieldName]) {
      return formErrors[fieldName];
    }
    // Otherwise show the default placeholder
    return defaultText;
  };

  return (
    <div className="new-cmpy">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="new-company-name">Create New Company Profile</div>
      <div className="new-cmpy-form-conatiner">
        <form className="new-cmpy-form" onSubmit={handleSubmit}>
          <div className="for-1st-row">
            <input
              type="text"
              id="cmpy-name"
              placeholder={getPlaceholder("companyName", "Company Name")}
              onChange={handleInputChange}
              value={formData.companyName}
              className={formErrors.companyName && wasValidated ? "error" : ""}
            />
            <div className="new-cmpny-input-logo-sec">
              <div className="col-img">
                <label htmlFor="cmpy-logo" className="logo-label">
                  Company Logo
                </label>
                <input
                  className="logo-input"
                  type="file"
                  onChange={previewFile}
                  accept="image/*"
                  id="cmpy-logo"
                />
              </div>
              <div className="logo-preview">
                <img src={preview} height="200" alt="Image preview..." />
              </div>
            </div>
          </div>
          <div className="new-cmpny-input-sec">
            <input
              type="text"
              id="cmpy-dba"
              placeholder={getPlaceholder("dba", "DBA")}
              onChange={handleInputChange}
              value={formData.dba}
              className={formErrors.dba && wasValidated ? "error" : ""}
            />

            <input
              type="text"
              id="cmpy-fedraltaxid"
              placeholder={getPlaceholder("fedraltaxid", "Federal Tax ID/EIN")}
              onChange={handleInputChange}
              value={formData.fedraltaxid}
              className={formErrors.fedraltaxid && wasValidated ? "error" : ""}
            />

            <input
              type="text"
              id="cmpy-industry"
              placeholder={getPlaceholder("industry", "Industry")}
              onChange={handleInputChange}
              value={formData.industry}
              className={formErrors.industry && wasValidated ? "error" : ""}
            />

            <input
              type="email"
              id="cmpy-email"
              placeholder={getPlaceholder("email", "Company Email")}
              onChange={handleInputChange}
              value={formData.email}
              className={formErrors.email && wasValidated ? "error" : ""}
            />

            <input
              type="tel"
              maxLength={13}
              id="cmpy-phone"
              placeholder={getPlaceholder("phone", "Company Phone")}
              onChange={handleInputChange}
              value={formData.phone}
              className={formErrors.phone && wasValidated ? "error" : ""}
            />

            <input
              type="url"
              id="cmpy-website"
              placeholder="Company Website"
              onChange={handleInputChange}
              value={formData.website}
            />

            <input
              type="text"
              id="cmpy-address1"
              placeholder="Company Address 1"
              onChange={handleInputChange}
              value={formData.address1}
            />
            <input
              type="text"
              id="cmpy-address2"
              placeholder="Company Address 2"
              onChange={handleInputChange}
              value={formData.address2}
            />
            <div className="city-list">
              <input
                type="text"
                id="cmpy-city"
                value={formData.city}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, city: value });
                  setInput(value);
                  setShowList(true);
                }}
                onFocus={() => setShowList(true)}
                onBlur={() => setTimeout(() => setShowList(false), 150)}
                placeholder="City"
                autoComplete="off"
              />

              {showList && filteredCities.length > 0 && (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    minWidth: "110%",
                    maxHeight: "220px",
                    overflowY: "auto",
                    border: "0.5px solid #ccc",
                    backgroundColor: "white",
                    zIndex: 1000,
                  }}
                >
                  {filteredCities.map((city) => (
                    <li
                      key={city}
                      onMouseDown={() => handleSelect(city)}
                      style={{ padding: "8px", cursor: "pointer" }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="text"
              id="cmpy-zip"
              placeholder="Zip Code"
              onChange={handleInputChange}
              value={formData.zip}
            />

            <input
              type="text"
              id="cmpy-state"
              placeholder="State"
              onChange={handleInputChange}
              value={formData.state}
            />
            <input
              type="text"
              id="cmpy-country"
              placeholder="Country"
              onChange={handleInputChange}
              value={formData.country}
            />
          </div>

          <div className="cmpy-brand-title">Social Platforms Details</div>

          <div className="new-cmpny-input-sec">
            <input
              type="text"
              id="cmpy-linkedin"
              placeholder="LinkedIn"
              onChange={handleInputChange}
              value={formData.linkedin}
            />
            <input
              type="text"
              id="cmpy-facebook"
              placeholder="Facebook"
              onChange={handleInputChange}
              value={formData.facebook}
            />
            <input
              type="text"
              id="cmpy-insta"
              placeholder="Instagram"
              onChange={handleInputChange}
              value={formData.insta}
            />
            <input
              type="text"
              id="cmpy-x"
              placeholder="X"
              onChange={handleInputChange}
              value={formData.x}
            />
            <input
              type="text"
              id="cmpy-youtube"
              placeholder="YouTube"
              onChange={handleInputChange}
              value={formData.youtube}
            />
          </div>

          <div className="cmpy-brand-title">Company Brand Details</div>
          <div className="new-cmpny-input-brand-sec">
            <div className="brand-row">
              <input
                type="text"
                id="cmpy-fontfamily"
                placeholder="Font Family"
                className="brand-input"
                onChange={handleInputChange}
                value={formData.fontfamily}
              />
            </div>
            <div className="brand-row">
              <label htmlFor="cmpy-color1">Color1</label>
              <input
                className="color-input"
                type="color"
                id="cmpy-color1"
                onChange={handleInputChange}
                value={formData.color1}
              />
            </div>
            <div className="brand-row">
              <label htmlFor="cmpy-color2">Color2</label>
              <input
                className="color-input"
                type="color"
                id="cmpy-color2"
                onChange={handleInputChange}
                value={formData.color2}
              />
            </div>
            <div className="brand-row">
              <label htmlFor="cmpy-color3">Color3</label>
              <input
                className="color-input"
                type="color"
                id="cmpy-color3"
                placeholder="Color Pallete Color 3 (Optional)"
                onChange={handleInputChange}
                value={formData.color3}
              />
            </div>
          </div>

          <div className="row-input-fields">
            <button
              type="submit"
              className="new-cmpy-button"
              disabled={isSubmitting}
              style={{ backgroundColor: formData.color1 }}
            >
              {isSubmitting ? "Creating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}