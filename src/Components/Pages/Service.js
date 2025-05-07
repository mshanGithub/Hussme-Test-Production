import "./Service.css";
// import blogImg from "../Assets/svg/Blog-img-1.svg";
import card1 from "../Assets/Business-page/card-1.png";
import card2 from "../Assets/Business-page/card-2.png";
import card3 from "../Assets/Business-page/card-3.png";
export function Service() {
  return (
    <div className="business-page">
      {/* Start of Business Front Detail Section */}

      <div className="service-starting-container">
        <div className="service-illu-section"></div>
        <div className="service-company-motive-slogan-section">
          <div className="service-slogan">
            <div className="service-slogan-part">
              <span className="service-slogan-word">
                <span className="service-slogan-1">L</span>everage
              </span>
              <span className="service-slogan-text">us for your</span>
              <span className="service-slogan-word">
                <span className="service-slogan-2">G</span>rowth
              </span>
            </div>
          </div>
          <div className="service-underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1729 149">
              <defs>
                <linearGradient
                  id="underlineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="8%" stopColor="#f08143" />
                  <stop offset="96%" stopColor="#9747ff" />
                </linearGradient>
              </defs>
              <path
                d="M1689.89 26.59a4479.17 4479.17 0 0 0-89.64-7.41C1354.1.45 1106.56-5.76 859.92 5.93c-227.31-4.25-454.79 8.96-681.36 27.95C121.94 38.9 65.1 40.2 8.38 42.12c-16.57 2.86-5.23 26.39 5.6 14.46 160.76-1.27 331.82-27.38 620.54-34.8A4574.9 4574.9 0 0 0 498.9 36.57C376.43 52.24 253.01 65.21 132.88 94.51c-36.16 8.94-71.67 20.31-106.69 32.95-7.14 4.4-27.74 3.63-24.98 15.62 1.99 7.19 13.63 7.05 18.04 2.59 143.67-54.58 297.49-70.64 448.88-90.24 129.01-16.82 258.61-28.01 388.46-34.27 285.02 6.07 570.13 38.15 848.22 100.65 3.84 1.09 8.24-1.32 9.23-5.24 1.98-7.31-5.66-9.96-11.42-10.6-48.05-10.76-96.18-21.26-144.56-30.43-160.68-28.2-322.86-46.78-485.4-60.19l-2.34-.16c161.55-1.33 323.21 4.35 484.31 15.71 37.11 2.65 125.06 8.85 164.97 13.96a7.58 7.58 0 0 0 8.45-6.41c.94-13.18-23.48-8.77-38.14-11.86Z"
                fill="url(#underlineGradient)"
              ></path>
            </svg>
          </div>

          <div className="service-des">
            We partner with you to understand your business needs, providing
            on-demand staffing and digital marketing solutions. <br />
          </div>
        </div>
      </div>

      {/* End of Business Front Detail Section */}
      {/* Start of Business Content Section */}
      <div className="bus-blog-card-back">
        <div className="bus-blog-card">
          <div className="bus-card-img">
            <div className="card-img">
              <img src={card1} alt="" />

              <p>
                Collaborate with business owners to lower operating expenses and
                boost sales through effective social media marketing strategies
              </p>
            </div>
          </div>
          <div className="static-card-title">Business Consultation</div>
        </div>
        <div className="bus-blog-card">
          <div className="bus-card-img">
            <div className="card-img">
              <img src={card2} alt="" />
              <p>
                Innovative on-demand staffing solutions through the Hussme
                Hiring platform, connecting businesses with part-time talent as
                needed
              </p>
            </div>
          </div>
          <div className="static-card-title">
            On Demanding Staffing Services
          </div>
        </div>
        <div className="bus-blog-card">
          <div className="bus-card-img">
            <div className="card-img">
              <img src={card3} alt="" />
              <p>
                Enhance your website and leverage social platforms (Facebook,
                Instagram, X) for branding and lead generation to drive business
                growth
              </p>
            </div>
          </div>
          <div className="static-card-title">Social Media Marketing</div>
        </div>
      </div>
      {/* End of Business Content Section */}
      {/* Start of Package and pricing */}
      <div className="package-pricing">
        <div className="b-package-title">Package and Pricing</div>
        <div className="package-cards">
          <div className="price-card-1">
            <div className="cat-tag">
              <div className="cat-label l-1"></div>
              <div className="cat-icn i-1"></div>
            </div>
            <div className="price-title">
              <h2>Free</h2>
            </div>
            <div className="consultation">
              Consultation
              <ul>
                <li>
                  <div className="tick-icn t-1"></div>Business Profiling
                </li>
                <li>
                  <div className="tick-icn-e"></div>Business plan
                </li>
                <li>
                  <div className="tick-icn-e"></div>Defining the business
                  process
                </li>
                <li>
                  <div className="tick-icn-e"></div>Social Media strategy
                </li>
              </ul>
            </div>
            <div className="staffing">
              Staffing
              <ul>
                <li>
                  <div className="tick-icn t-1"></div>Portal access for
                  on-demand hiring
                </li>
                <li>
                  <div className="tick-icn t-1"></div>Payment processing
                </li>
                <li>
                  <div className="tick-icn t-1"></div>Chat support for hiring
                </li>
                <li>
                  <div className="tick-icn-e"></div>Recruitment team
                </li>
                <li>
                  <div className="tick-icn-e"></div>Full time hiring
                </li>
                <li>
                  <div className="tick-icn-e"></div>Online Training for new hire
                </li>
                <li>
                  <div className="tick-icn-e"></div>Online Training portal
                </li>
              </ul>
            </div>
            <div className="digital-marketing">
              Digital Marketing
              <ul>
                <li>
                  <div className="tick-icn-e"></div>Website Hosting
                </li>
                <li>
                  <div className="tick-icn-e"></div>Website Maintenance
                </li>
                <li>
                  <div className="tick-icn-e"></div>Facebook Marketing (upto 3
                  post per week)
                </li>
                <li>
                  <div className="tick-icn-e"></div>Instagram Marketing (upto 3
                  post per week)
                </li>
                <li>
                  <div className="tick-icn-e"></div>X Marketing (upto 3 post per
                  week)
                </li>
                <li>
                  <div className="tick-icn-e"></div>Online review responses
                  (including Google)
                </li>
                <li>
                  <div className="tick-icn-e"></div>Analytics reports every week
                </li>
              </ul>
            </div>
          </div>

          <div className="price-card-2">
            <div className="cat-tag">
              <div className="cat-label l-2"></div>
              <div className="cat-icn i-2"></div>
            </div>
            <div className="price-title">
              <h2>$99</h2>
              <h5>/month</h5>
            </div>
            <div className="consultation">
              Consultation
              <ul>
                <li>
                  <div className="tick-icn t-2"></div>Business Profiling
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Business plan
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Defining the business
                  process
                </li>
                <li>
                  <div className="tick-icn-e"></div>Social Media strategy
                </li>
              </ul>
            </div>
            <div className="staffing">
              Staffing
              <ul>
                <li>
                  <div className="tick-icn t-2"></div>Portal access for
                  on-demand hiring
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Payment processing
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Chat support for hiring
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Recruitment team
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Full time hiring
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Online Training for new
                  hire
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Online Training portal
                </li>
              </ul>
            </div>
            <div className="digital-marketing">
              Digital Marketing
              <ul>
                <li>
                  <div className="tick-icn t-2"></div>Website Hosting
                </li>
                <li>
                  <div className="tick-icn t-2"></div>Website Maintenance
                </li>
                <li>
                  <div className="tick-icn-e"></div>Facebook Marketing (upto 3
                  post per week)
                </li>
                <li>
                  <div className="tick-icn-e"></div>Instagram Marketing (upto 3
                  post per week)
                </li>
                <li>
                  <div className="tick-icn-e"></div>X Marketing (upto 3 post per
                  week)
                </li>
                <li>
                  <div className="tick-icn-e"></div>Online review responses
                  (including Google)
                </li>
                <li>
                  <div className="tick-icn-e"></div>Analytics reports every week
                </li>
              </ul>
            </div>
          </div>
          <div className="price-card-3">
            <div className="cat-tag">
              <div className="cat-label l-3"></div>
              <div className="cat-icn i-3"></div>
            </div>
            <div className="price-title">
              <h2>$199</h2> <h5>/month</h5>
            </div>
            <div className="consultation">
              Consultation
              <ul>
                <li>
                  <div className="tick-icn t-3"></div>Business Profiling
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Business plan
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Defining the business
                  process
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Social Media strategy
                </li>
              </ul>
            </div>
            <div className="staffing">
              Staffing
              <ul>
                <li>
                  <div className="tick-icn t-3"></div>Portal access for
                  on-demand hiring
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Payment processing
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Chat support for hiring
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Recruitment team
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Full time hiring
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Online Training for new
                  hire
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Online Training portal
                </li>
              </ul>
            </div>
            <div className="digital-marketing">
              Digital Marketing
              <ul>
                <li>
                  <div className="tick-icn t-3"></div>Website Hosting
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Website Maintenance
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Facebook Marketing (upto 3
                  post per week)
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Instagram Marketing (upto
                  3 post per week)
                </li>
                <li>
                  <div className="tick-icn t-3"></div>X Marketing (upto 3 post
                  per week)
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Online review responses
                  (including Google)
                </li>
                <li>
                  <div className="tick-icn t-3"></div>Analytics reports every
                  week
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* End of Package and pricing */}
    </div>
  );
}
