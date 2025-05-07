import "../Components/Footer.css";
import { Link } from "react-router-dom";
import logofooter from "../Components/Assets/Home-Header-Footer/hussme-sep-logo.png";
import mobile from "../Components/Assets/Home-Header-Footer/envelope (1).png";
import mail from "../Components/Assets/Home-Header-Footer/outgoing.png";
export function Footer() {
  return (
    <div className="footer">
      <div className="footer-col">
        <div className="col-1">
          <img src={logofooter} alt="" />
          <p className="footer-para">
            Streaming the business process for growth and bring in the out of
            the box solution to reduce expenses
          </p>
        </div>
        <div className="col-2">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/service">Services</Link>
            </li>

            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact US</Link>
            </li>
          </ul>
        </div>
        <div className="col-3">
          <ul>
            <li>
              <Link to="#">Privacy policy</Link>
            </li>
            <li>
              <Link to="#">Terms & Condition</Link>
            </li>
            <li>
              <Link to="#">Partners</Link>
            </li>
          </ul>
        </div>
        <div className="col-4">
          <Link to="/contact">
            <div className="contact-btn">Contact Us</div>
          </Link>

          <div className="cen-left">
            <div className="mobile">
              <img src={mobile} alt="Mobile" />
              <a href="tel:+18038039889" rel="noopener noreferrer">
                +1 803 803 9889
              </a>
            </div>
            <div className="mail">
              <img src={mail} alt="Mail" />
              <a href="mailto:support@hussme.com" rel="noopener noreferrer">
                support@hussme.com
              </a>
            </div>
          </div>

          <div className="social-media">
            <Link href="">
              <div className="x-icn"></div>
            </Link>
            <Link href="">
              <div className="insta-icn"></div>
            </Link>
            <Link href="">
              <div className="fb-icn"></div>
            </Link>
            <Link href="">
              <div className="linkedin-icn"></div>
            </Link>
          </div>
        </div>
      </div>
      <div className="copyright">
        <hr />
        <div className="copy-container">
          <h4>©All Copyrights {new Date().getFullYear()} by Husssme</h4>
        </div>
      </div>
    </div>
  );
}
