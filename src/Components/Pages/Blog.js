import "./Blog.css";
import arrow from "../Assets/For-status/Arrow.svg";
import { Link } from "react-router-dom";
export function Blog() {
  return (
    <div className="blog-container">
      <div className="blog-frame">
      
        <div className="cards-container">
          <div className="blog-cards-container">
            <div className="blog-card">
              <div className="background-img cr-1">
                <div className="btm-card">
                  <div className="date-comment">
                    <div className="date">
                      <div className="date-icn"></div>
                      15,Feb, 2024
                    </div>
                    <div className="comment">
                      <div className="comment-icn"></div>
                      05, Comments
                    </div>
                  </div>
                  <div className="blog-title">
                    <Link to="/digital">
                      <h2>Digital Marketing</h2>
                    </Link>
                  </div>
                  <div className="last-box">
                    <div className="more-info">
                      <Link to="/digital">Get more info</Link>
                    </div>
                    <div className="arrow arrow-1">
                      <Link to="/digital">
                        <img src={arrow} alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="background-img cr-2">
                <div className="btm-card">
                  <div className="date-comment">
                    <div className="date">
                      <div className="date-icn"></div>
                      18,Feb, 2024
                    </div>
                    <div className="comment">
                      <div className="comment-icn"></div>
                      09 Comments
                    </div>
                  </div>
                  <div className="blog-title">
                    <Link to="/digital">
                      <h2>Hire easily HR candidates in few seconds</h2>
                    </Link>
                  </div>
                  <div className="last-box">
                    <div className="more-info">
                      <Link to="/digital">Get more info</Link>
                    </div>
                    <div className="arrow arrow-1">
                      <Link to="/digital">
                        <img src={arrow} alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="background-img cr-3">
                <div className="btm-card">
                  <div className="date-comment">
                    <div className="date">
                      <div className="date-icn"></div>
                      01,Aug, 2024
                    </div>
                    <div className="comment">
                      <div className="comment-icn"></div>
                      02 Comments
                    </div>
                  </div>
                  <div className="blog-title">
                    <Link to="/digital">
                      <h2>Get few solution to hire a best candidate </h2>
                    </Link>
                  </div>
                  <div className="last-box">
                    <div className="more-info">
                      <Link to="/digital">Get more info</Link>
                    </div>
                    <div className="arrow arrow-1">
                      <Link to="/digital">
                        <img src={arrow} alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="background-img cr-4">
                <div className="btm-card">
                  <div className="date-comment">
                    <div className="date">
                      <div className="date-icn"></div>
                      18,Mar, 2024
                    </div>
                    <div className="comment">
                      <div className="comment-icn"></div>
                      05 Comments
                    </div>
                  </div>
                  <div className="blog-title">
                    <Link to="/digital">
                      <h2>Capitalize on low hanging fruit</h2>
                    </Link>
                  </div>
                  <div className="last-box">
                    <div className="more-info">
                      <Link to="/digital">Get more info</Link>
                    </div>
                    <div className="arrow arrow-1">
                      <Link to="/digital">
                        <img src={arrow} alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="background-img cr-3">
                <div className="btm-card">
                  <div className="date-comment">
                    <div className="date">
                      <div className="date-icn"></div>
                      01,Aug, 2024
                    </div>
                    <div className="comment">
                      <div className="comment-icn"></div>
                      02 Comments
                    </div>
                  </div>
                  <div className="blog-title">
                    <Link to="/digital">
                      <h2>Get few solution to hire a best candidate </h2>
                    </Link>
                  </div>
                  <div className="last-box">
                    <div className="more-info">
                      <Link to="/digital">Get more info</Link>
                    </div>
                    <div className="arrow arrow-1">
                      <Link to="/digital">
                        <img src={arrow} alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="background-img cr-1">
                <div className="btm-card">
                  <div className="date-comment">
                    <div className="date">
                      <div className="date-icn"></div>
                      15,Feb, 2024
                    </div>
                    <div className="comment">
                      <div className="comment-icn"></div>
                      05, Comments
                    </div>
                  </div>
                  <div className="blog-title">
                    <Link to="/digital">
                      <h2>Digital Marketing</h2>
                    </Link>
                  </div>
                  <div className="last-box">
                    <div className="more-info">
                      <Link to="/digital">Get more info</Link>
                    </div>
                    <div className="arrow arrow-1">
                      <Link to="/digital">
                        <img src={arrow} alt="" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
