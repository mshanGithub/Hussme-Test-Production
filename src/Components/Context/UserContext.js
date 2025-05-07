import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in localStorage on component mount or refresh
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user data using the token
      fetch(process.env.REACT_APP_API_URL +"/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          return res.json();
        })
        .then((data) => {
          if (data.email) {
            // Store complete user data including username
            setUser(data);
            console.log("User data loaded:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    // Fetch user data after login
    fetch(process.env.REACT_APP_API_URL +"/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        console.log("User logged in:", data);
      })
      .catch((error) => {
        console.error("Error during login:", error);
        localStorage.removeItem("token");
        setUser(null);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("User logged out");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
