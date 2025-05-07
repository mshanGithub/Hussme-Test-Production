import "./App.css";
import ScrollToTop from "./ScrollToTop";
import { UserProvider } from "./Components/Context/UserContext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Footer } from "./Components/Footer";
import { Header } from "./Components/Header";
import { Home } from "./Components/Home";
import { Service } from "./Components/Pages/Service";
import { Blog } from "./Components/Pages/Blog";
import { ContactUs } from "./Components/Pages/Contactus";
import { Digital } from "./Components/Pages/Blogs/Digital-Detail";
import { Login } from "./Components/Login";
import { Reset } from "./Components/Pages/Password Reset/Reset-Password";
import { Otp } from "./Components/Pages/Password Reset/Otp";
import { Management } from "./Management/Management";
import { NewCompanyProfile } from "./Management/NewCompanyProfile";
import { Admin } from "./Components/Admin";

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith("/management") || location.pathname.startsWith("/new-company")||location.pathname.startsWith("/admin");;

  return (
    <div className="container">
      {!hideHeaderFooter && <Header />}
      <ScrollToTop />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/service" element={<Service />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/digital" element={<Digital />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/management" element={<Management />} />
        <Route path="/new-company" element={<NewCompanyProfile/>} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
