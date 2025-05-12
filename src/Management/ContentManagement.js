import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Components/Context/UserContext";
import "../Management/ContentManagement.css";
import { MdAddTask } from "react-icons/md";
import { VscTasklist } from "react-icons/vsc";
import nexticn from "../Components/Assets/svg/chevron-right-solid.svg";
import backicn from "../Components/Assets/svg/back-chevron-right-solid (1).svg";
import { LuNotepadText } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Add this helper function at the top of your component
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export function ContentManagement() {
  const navigate = useNavigate();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTaskStatus, setShowTaskStatus] = useState(true);
  const [buttonAction, setButtonAction] = useState(null);
  const scrollRef = useRef(null);
  const approvedScrollRef = useRef(null);
  const [topRowTitleSection, setTopRowTitleSection] = useState(true);
  const [NewTask, setNewTask] = useState(false);
  const [showFirstHalf, setShowFirstHalf] = useState(true);
  const [showSecondHalf, setShowSecondHalf] = useState(true);
  const [showCurrentTaskStatus, setShowCurrentTaskStatus] = useState(false);
  const [showCompletedTaskStatus, setShowCompletedTaskStatus] = useState(false);
  const [taskForm, setTaskForm] = useState({
    companyProfileId: "",
    title: "",
    tagline: "",
    taskpurpose: "",
    headline: "",
    offerormessage: "",
    calltoaction: "",
    guidlines: "",
    additionalinfo: "",
    description: "",
    targetPostingDate: "",
    submissionForReview: "",
    currentStatus: "Pending", // Optional: defaults to "Pending" on backend
  });

  const [tasks, setTasks] = useState([]);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedRolledBackTask, setSelectedRolledBackTask] = useState(null);
  const [tempRowStatus, setTempRowStatus] = useState(true);
  const [tempYetRowStatus, setYetTempRowStatus] = useState(false);

  const taskHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create a task");
        navigate("/login");
        return;
      }

      if (
        !taskForm.title ||
        !taskForm.description ||
        !taskForm.targetPostingDate ||
        !taskForm.submissionForReview
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("companyProfileId", companyProfile._id); // Override what's in taskForm
      formData.append("title", taskForm.title);
      formData.append("tagline", taskForm.tagline);
      formData.append("taskpurpose", taskForm.taskpurpose);
      formData.append("headline", taskForm.headline);
      formData.append("offerormessage", taskForm.offerormessage);
      formData.append("calltoaction", taskForm.calltoaction);
      formData.append("guidlines", taskForm.guidlines);
      formData.append("additionalinfo", taskForm.additionalinfo);
      formData.append("description", taskForm.description);
      formData.append("targetPostingDate", taskForm.targetPostingDate);
      formData.append("submissionForReview", taskForm.submissionForReview);

      // Add referenceImage to the form data if a file is selected
      const referenceImageInput = document.querySelector(
        'input[name="referenceimage"]'
      );
      if (referenceImageInput && referenceImageInput.files[0]) {
        formData.append("referenceImage", referenceImageInput.files[0]);
      }

      // Send the request to the server
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/task/create-task`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      if (response.data) {
        toast.success("Task created successfully!");
        clickAssignSubmitButton();
        setTaskForm({
          companyProfileId: "",
          title: "",
          tagline: "",
          taskpurpose: "",
          headline: "",
          offerormessage: "",
          calltoaction: "",
          guidlines: "",
          additionalinfo: "",
          description: "",
          targetPostingDate: "",
          submissionForReview: "",
        });

        setNewTask(false);
        await fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error creating task");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // For showing list of task
  const fetchTasks = async () => {
    try {
      if (!companyProfile?._id) {
        console.log("Company profile not loaded yet");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/tasks/${companyProfile._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter tasks that are not "Approved"
      const filteredTasks = response.data.filter(
        (task) => task.currentStatus !== "Approved"
      );
      setTasks(filteredTasks);

      // Update tempRowStatus based on whether there are tasks to show
      if (filteredTasks.length === 0) {
        setTempRowStatus(false); // No tasks to show
      } else {
        setTempRowStatus(true); // Tasks are available
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error loading tasks");
    }
  };

  const fetchRolledBackTasks = async () => {
    try {
      if (!companyProfile?._id) return;

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/tasks/${companyProfile._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.filter((task) => task.currentStatus === "Approved")) {
        setYetTempRowStatus(true);
        setApprovedTasks(
          response.data.filter((task) => task.currentStatus === "Approved")
        );
      }
      if (
        response.data.filter((task) => task.currentStatus === "Approved")
          .length === 0
      ) {
        setYetTempRowStatus(false);
      }
    } catch (error) {
      console.error("Error fetching rolled back tasks:", error);
      toast.error("Error loading rolled back tasks");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/company/get-company-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setCompanyProfile(response.data);
        } else {
          toast.error("Company profile not found");
          navigate("/new-company");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 404) {
          toast.error("Please create a company profile first");
          navigate("/new-company");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (companyProfile?._id) {
      console.log("Fetching tasks for company:", companyProfile._id);
      fetchTasks();
    }
  }, [companyProfile]);

  useEffect(() => {
    if (companyProfile?._id) {
      fetchRolledBackTasks();
    }
  }, [companyProfile]);

  useEffect(() => {
    // Log when showCurrentTaskStatus changes
    console.log("showCurrentTaskStatus:", showCurrentTaskStatus);
    console.log("selectedTask:", selectedTask);
  }, [showCurrentTaskStatus, selectedTask]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -350,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 350,
        behavior: "smooth",
      });
    }
  };
  const approvedScrollLeft = () => {
    if (approvedScrollRef.current) {
      approvedScrollRef.current.scrollBy({
        left: -350,
        behavior: "smooth",
      });
    }
  };

  const approvedScrollRight = () => {
    if (approvedScrollRef.current) {
      approvedScrollRef.current.scrollBy({
        left: 350,
        behavior: "smooth",
      });
    }
  };

  const taskStatus = async (taskId) => {
    try {
      if (taskId === false) {
        setTopRowTitleSection(true);
        setShowTaskStatus(true);
        setShowFirstHalf(true);
        setShowSecondHalf(true);
        setShowCurrentTaskStatus(false);
        setSelectedTask(null);
        await fetchTasks(); // Refresh tasks
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        toast.error("No task data received");
        return;
      }

      setSelectedTask(response.data);
      setTopRowTitleSection(false);

      setShowTaskStatus(false);
      setShowFirstHalf(false);
      setShowSecondHalf(false);
      setShowCurrentTaskStatus(true);
      await fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error("Error loading task details");
    }
  };

  const handleApprove = async () => {
    try {
      if (!selectedTask?._id) {
        toast.error("No task selected");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/task/update-task/${selectedTask._id}`,
        {
          currentStatus: "Approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success("Task approved successfully");
        await fetchTasks(); // Refresh tasks
        taskStatus(false); // Close detail view
      }
    } catch (error) {
      console.error("Error approving task:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Error approving task");
    }
  };

  const handleRollback = async () => {
    try {
      if (!selectedTask?._id) {
        toast.error("No task selected");
        return;
      }

      if (!feedbackText.trim()) {
        toast.error("Please provide feedback before rolling back");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/task/update-task/${selectedTask._id}`,
        {
          currentStatus: "Roll Back",
          referBackFeedback: feedbackText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success("Task rolled back with feedback");
        setFeedbackText("");
        setButtonAction("approve");
        setShowFeedback(false);
        await fetchTasks(); // Refresh tasks
        taskStatus(false); // Close detail view
      }
    } catch (error) {
      console.error("Error rolling back task:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Error rolling back task");
    }
  };

  const fetchTaskDetails = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const task = response.data;
      console.log("Task details:", task);

      // Display rollback feedback
      if (task.rollbackFeedback && task.rollbackFeedback.length > 0) {
        task.rollbackFeedback.forEach((feedback) => {
          console.log(
            `Feedback: ${feedback.feedback}, Timestamp: ${feedback.timestamp}`
          );
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const completedTask = async (taskId) => {
    try {
      if (taskId === false) {
        setTopRowTitleSection(true);
        setShowTaskStatus(true);
        setShowFirstHalf(true);
        setShowSecondHalf(true);
        setShowCompletedTaskStatus(false);
        setSelectedRolledBackTask(null);
        await fetchRolledBackTasks(); // Refresh rolled-back tasks
        return;
      }

      const task = approvedTasks.find((t) => t._id === taskId);
      if (task) {
        setTopRowTitleSection(false);
        setSelectedRolledBackTask(task);
        setShowTaskStatus(false);
        setShowFirstHalf(false);
        setShowSecondHalf(false);
        setShowCompletedTaskStatus(true);
        await fetchRolledBackTasks(); // Refresh rolled-back tasks
      }
    } catch (error) {
      console.error("Error loading task details:", error);
      toast.error("Error loading task details");
    }
  };

  // If still loading, show a loading message
  if (loading) {
    return (
      <div className="loader-container">
        <span className="loader"></span>
      </div>
    );
  }

  const assignTask = () => {
    if (showTaskStatus == true) {
      setNewTask(true);
      setShowFirstHalf(false);
      setShowSecondHalf(false);
      setShowTaskStatus(false);
      setShowCompletedTaskStatus(false);
    } else {
      setShowFirstHalf(true);
      setShowSecondHalf(true);
      setShowTaskStatus(true);
      setShowCompletedTaskStatus(false);
      setNewTask(false);
    }
  };
  const completedTaskView = () => {
    if (showTaskStatus == true) {
      setShowTaskStatus(false);
      setShowFirstHalf(false);
      setShowSecondHalf(false);
      setShowCompletedTaskStatus(true);
    } else {
      setShowTaskStatus(true);
      setShowFirstHalf(true);
      setShowSecondHalf(true);
      setShowCompletedTaskStatus(false);
    }
  };
  const clickAssignSubmitButton = () => {
    setNewTask(false);
    setShowTaskStatus(true);
    setShowFirstHalf(true);
    setShowSecondHalf(true);
    setShowCompletedTaskStatus(false);
  };

  //  For in tsak row rollback feedback
  const showFeedbackForm = () => {
    if (showFeedback == true) {
      setButtonAction("approve");
      setShowFeedback(false);
    } else {
      setShowFeedback(true);
      setShowFeedback(true);
      setButtonAction("disapprove");
    }
  };
  return (
    <div className="content-management-page">
      <div className="task-row">
        {topRowTitleSection && (
          <div className="task-title-and-new-task">
            <div className="task-title">Tasks</div>
            <div className="new-task-button" onClick={assignTask}>
              + Assign New Task
            </div>
            <div className="approved-list-container">
              <span className="tooltiptext">Launched Reports</span>
              <div className="appproved-list-btn">
                <LuNotepadText
                  style={{ height: "30px", width: "30px", color: "grey" }}
                />
              </div>
            </div>
          </div>
        )}
        {/* First Half */}
        <div className="task-boxes">
          {NewTask && (
            <div className="assign-new-task">
              <div className="assign-new-task-row">
                <div className="new-task-form-title">
                  Add New Task <MdAddTask style={{ marginLeft: "8px" }} />
                </div>
                <img
                  onClick={() => assignTask(false)}
                  width="25"
                  height="40"
                  src="https://i.ibb.co/MkR4grRn/close.png"
                  alt="delete-sign"
                  className="cross-symbol"
                />
              </div>

              <form className="new-task-form" onSubmit={taskHandleSubmit}>
                {/* <div className="new-task-row task-row-2"> </div> */}
                <div className="new-task-row">
                  <div className="new-task-row-input">
                    <label htmlFor="title">Task Title:</label>
                    <input
                      type="text"
                      name="title"
                      className="new-task-title"
                      value={taskForm.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="tagline">Tagline or Slogan:</label>
                    <input
                      type="text"
                      name="tagline"
                      className="new-task-title"
                      value={taskForm.tagline}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="taskpurpose">Task Purpose/Objective:</label>
                    <input
                      type="text"
                      name="taskpurpose"
                      className="new-task-title"
                      value={taskForm.taskpurpose}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="headline">Main Headline:</label>
                    <input
                      type="text"
                      name="headline"
                      className="new-task-title"
                      value={taskForm.headline}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="offerormessage">
                      Key Offer or Message:
                    </label>
                    <input
                      type="text"
                      name="offerormessage"
                      className="new-task-title"
                      value={taskForm.offerormessage}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="calltoaction">Call to Action:</label>
                    <input
                      type="text"
                      name="calltoaction"
                      className="new-task-title"
                      value={taskForm.calltoaction}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="guidlines">Branding Guidelines:</label>
                    <input
                      type="text"
                      name="guidlines"
                      className="new-task-title"
                      value={taskForm.guidlines}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      name="description"
                      className="new-task-des"
                      value={taskForm.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="additionlinfo">
                      Additional Information:
                    </label>
                    <input
                      type="text"
                      name="additionalinfo"
                      className="new-task-title"
                      value={taskForm.additionalinfo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-row-input">
                    <label htmlFor="referenceimage">
                      Reference Flyer or Product:
                    </label>
                    <input
                      type="file"
                      name="referenceimage"
                      className="img-input"
                      accept="image/*"
                    />
                  </div>

                  <div className="new-task-input-box">
                    <label
                      htmlFor="submissionForReview"
                      className="new-task-date-label"
                    >
                      Submission for Review:
                    </label>
                    <input
                      type="date"
                      name="submissionForReview"
                      className="new-task-date"
                      value={taskForm.submissionForReview}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="new-task-input-box">
                    <label
                      htmlFor="targetPostingDate"
                      className="new-task-date-label"
                    >
                      Target Posting Date:
                    </label>
                    <input
                      type="date"
                      name="targetPostingDate"
                      className="new-task-date"
                      value={taskForm.targetPostingDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="new-task-row-submit">
                  <button type="submit" className="new-task-row-submit-btn">
                    Submit Task
                    <VscTasklist
                      style={{
                        marginLeft: "8px",
                        height: "30px",
                        width: "30px",
                      }}
                    />
                  </button>
                </div>
              </form>
            </div>
          )}
          {showFirstHalf && (
            <div className="task-arrows">
              <img
                src={backicn}
                alt=""
                className="assign-task-btn back"
                onClick={scrollLeft}
              />
              {tempRowStatus ? (
                <div className="task-row-container" ref={scrollRef}>
                  {tasks.map((task) => (
                    <div className="box" key={task._id}>
                      {console.log("Rendering task:", task)}
                      <div
                        className="cart-task-box-wrapper"
                        onClick={() => taskStatus(task._id)}
                      >
                        <div className="cart-task-box">
                          <div className="top-id-card">
                            <div className="name-task">Task id:</div>
                            <div className="task-number">#{task.taskId}</div>
                          </div>
                          <div className="bottom-title-card">
                            <div className="task-box-title">{task.title}</div>
                            <button
                              className="cart-task-btn"
                              onClick={() => taskStatus(task._id)}
                            >
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="temp-row-container tsk">
                  <div className="temp-title">
                    Click above to add your task!
                  </div>
                  <div className="temp-img"> </div>
                </div>
              )}
              <img
                src={nexticn}
                alt=""
                className="assign-task-btn next"
                onClick={scrollRight}
              />
            </div>
          )}
          {showCurrentTaskStatus && (
            <div className="show-task-status-container">
              <div className="status-top-floor">
                <div className="status-top-floor-row-1">
                  <div className="status-col-1">
                    <div className="status-row">
                      <div className="status-task-id">
                        <div className="task-id for-gradient-font">Task ID</div>
                        <div className="task-id-number">
                          #{selectedTask?.taskId}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status">Task Title</div>
                        <div className="task-title-name-status">
                          {selectedTask?.title}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status">
                          Tagline or Slogan
                        </div>
                        <div className="task-title-name-status">
                          {selectedTask?.tagline}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status">
                          Purpose/Objective
                        </div>
                        <div className="task-title-name-status">
                          {selectedTask?.taskpurpose}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status">Main Headline</div>
                        <div className="task-title-name-status">
                          {selectedTask?.headline}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status">
                          Key Offer or Message
                        </div>
                        <div className="task-title-name-status">
                          {selectedTask?.offerormessage}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status ">
                          Call to Action (CTA)
                        </div>
                        <div className="task-title-name-status">
                          {selectedTask?.calltoaction}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status ">
                          Branding Guidelines
                        </div>
                        <div className="task-title-name-status">
                          {selectedTask?.guidlines}
                        </div>
                      </div>
                      <div className="status-task-title">
                        <div className="task-title-status  ">
                          Additional Information
                        </div>
                        <div className="task-title-name-status">
                          {selectedTask?.additionalinfo}
                        </div>
                      </div>
                      <div className="status-task-des">
                        <div className="task-title-status">
                          Task Description
                        </div>
                        <div className="task-des-name">
                          {selectedTask?.description}
                        </div>
                      </div>
                      <div className="status-task-dates">
                        <label className="task-title-status">Target Date</label>
                        <div className="status-target-date">
                          <input
                            type="date"
                            name="targetPostingDate"
                            value={formatDateForDisplay(
                              selectedTask?.submissionForReview
                            )}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="status-task-dates">
                        <label className="task-title-status">
                          Deadline Date
                        </label>
                        <div className="status-deadline-date">
                          <input
                            type="date"
                            name="submissionForReview"
                            value={formatDateForDisplay(
                              selectedTask?.targetPostingDate
                            )}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="status-col-2">
                    <div className="status-title-preview">Task Preview</div>
                    <div className="task-preview-img-container">
                      <img
                        src={
                          "https://i.ibb.co/1YsMLsWC/freepicdownloader-com-female-freelancer-working-home-vector-illustration-large.jpg"
                        }
                        className="task-preview-img"
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <div className="status-top-floor-row-2">
                  <img
                    onClick={() => taskStatus(false)}
                    width="48"
                    height="48"
                    src="https://img.icons8.com/fluency/48/delete-sign.png"
                    alt="delete-sign"
                    className="status-cross-symbol"
                  />
                </div>
              </div>

              <div className="status-col-3">
                <div className="status-task-btns">
                    {selectedTask.rollbackFeedback.length > 0 && (
                      <div className="past-rollback">
                        <h3>Rollback Feedback</h3>
                        <ul>
                          {selectedTask.rollbackFeedback.map(
                            (feedback, index) => (
                              <li key={index}>
                                <p className="feed-index">{index+1}.</p>
                                <p>{feedback.feedback}</p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  <div className="row-3-col-2-btn">

                    <button
                      className={
                        buttonAction && buttonAction !== "approve"
                          ? "custom-button-disable"
                          : "custom-button"
                      }
                      onClick={handleApprove}
                      disabled={buttonAction && buttonAction !== "approve"}
                    >
                      <span className="button-content">
                        <span className="button-text">Approve</span>
                        <span className="button-icon">✅</span>
                      </span>
                    </button>
                    <button
                      className="custom-button-2"
                      onClick={() => {
                        // setShowFeedback(true);
                        showFeedbackForm();
                      }}
                    >
                      <span className="button-content">
                        <span className="button-text">Refer Back</span>
                        <span className="button-icon">🔄️</span>
                      </span>
                    </button>
                    {showFeedback && (
                      <div className="status-feedback-form">
                        <textarea
                          className="feedback-textarea"
                          placeholder="Leave your feedback"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                        ></textarea>
                        <button
                          className="submit-feedback-btn"
                          onClick={handleRollback}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Second Half */}
      {showSecondHalf && (
        <div className="task-approved-row">
          <div className="approve-title"> Approved & Yet to launch 🚀</div>
          <div className="task-arrows">
            <img
              src={backicn}
              alt=""
              className="assign-task-btn back"
              onClick={approvedScrollLeft}
            />
            {tempYetRowStatus ? (
              <div
                className="task-approved-row-container"
                ref={approvedScrollRef}
              >
                {approvedTasks.map((task) => (
                  <div
                    className="yet-task-box-wrapper"
                    key={task._id}
                    onClick={() => completedTask(task._id)}
                  >
                    <div className="yet-task-box">
                      <div className="inner-triangle-container">
                        <div className="yet-task-id">
                          <div className="yet-id">#{task.taskId}</div>
                        </div>
                        <button
                          className="yet-preview-btn"
                          onClick={() => completedTask(task._id)}
                        >
                          Preview
                        </button>
                        <div className="yet-task-title">{task.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="temp-row-container yet">
                <div className="yet-temp-img"> </div>
                <div className="temp-title">
                  Task nearly complete? Let’s check it off!
                </div>
              </div>
            )}

            <img
              src={nexticn}
              alt=""
              className="assign-task-btn next"
              onClick={approvedScrollRight}
            />
          </div>
        </div>
      )}
      {showCompletedTaskStatus && (
        <div className="yet-show-task-status-container">
          <div className="status-top-floor">
            <div className="status-top-floor-row-1">
              <div className="status-col-1">
                <div className="status-row">
                  <div className="status-task-id">
                    <div className="task-id">Task ID</div>
                    <div className="task-id-number">
                      #{selectedRolledBackTask?.taskId}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">Task Title</div>
                    <div className="task-title-name-status task-h">
                      {selectedRolledBackTask?.title}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">Tagline or Slogan</div>
                    <div className="task-title-name-status task-h">
                      {selectedRolledBackTask?.tagline}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">Purpose/Objective</div>
                    <div className="task-title-name-status">
                      {selectedRolledBackTask?.taskpurpose}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">Main Headline</div>
                    <div className="task-title-name-status task-h">
                      {selectedRolledBackTask?.headline}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">
                      Key Offer or Message
                    </div>
                    <div className="task-title-name-status">
                      {selectedRolledBackTask?.offerormessage}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">
                      Call to Action (CTA)
                    </div>
                    <div className="task-title-name-status">
                      {selectedRolledBackTask?.calltoaction}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">Branding Guidelines</div>
                    <div className="task-title-name-status">
                      {selectedRolledBackTask?.guidlines}
                    </div>
                  </div>
                  <div className="status-task-title">
                    <div className="task-title-status">
                      Additional Information
                    </div>
                    <div className="task-title-name-status">
                      {selectedRolledBackTask?.additionalinfo}
                    </div>
                  </div>
                  <div className="status-task-des">
                    <div className="task-title-status">Task Description</div>
                    <div className="task-des-name">
                      {selectedRolledBackTask?.description}
                    </div>
                  </div>
                  <div className="status-task-dates">
                    <label className="for-gradient-font">Target Date</label>
                    <div className="status-target-date">
                      <input
                        type="date"
                        name="targetPostingDate"
                        value={formatDateForDisplay(
                          selectedRolledBackTask?.submissionForReview
                        )}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="status-task-dates">
                    <label className="for-gradient-font">Deadline Date</label>
                    <div className="status-deadline-date">
                      <input
                        type="date"
                        name="submissionForReview"
                        value={formatDateForDisplay(
                          selectedRolledBackTask?.targetPostingDate
                        )}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="status-col-2">
                <div className="status-title-preview">Task Preview</div>
                <div className="task-preview-img-container">
                  <img
                    src={selectedRolledBackTask?.referenceImage}
                    className="yet-task-preview-img"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div className="status-top-floor-row-2">
              <img
                onClick={() => completedTask(false)}
                width="48"
                height="48"
                src="https://img.icons8.com/fluency/48/delete-sign.png"
                alt="delete-sign"
                className="status-cross-symbol"
              />
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
