import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/freelancerdetails.css";
import { useTranslation } from "react-i18next";
import useAuth from "../../Hooks/UseAuth";
import PortfolioSlider from "../../assets/portfolio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload,faFileAlt  } from "@fortawesome/free-solid-svg-icons";
import AlertPopup from "../../assets/AlertPopup";

export default function Freelancerdetails() {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();

  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { userid } = location.state || {};

  const [readData, setreadData] = useState({
    Usertype: null,
    username: null,
    Fullname: null,
    Phonenumber: null,
    Email: null,
    Password: null,
    Gender: null,
    profilepic: null,
    title: null,
    freelancerprofile: {
      profilepic: null,
      title: null,
      skills: null,
      cv: null,
      additionaldoc: { educations: null, certifications: null },
      gudayhistory: null,
      workhistory: null,
      rating: null,
      description: null,
      portfolio: { link: null, title: null },
    },
  });
  const [inputValue, setinputValue] = useState({
    Description: "",
    PostedDate: "",
    price: "",
    freelancerid: "",
    employerid: "",
  });
  const [showWork, setshowWork] = useState(true);
  const [showPortfolio, setshowportfolio] = useState(false);
  const [showOther, setshowOther] = useState(false);

  const [filteredfile, setfilteredfile] = useState([]);
  const [filteredpic, setfilteredpic] = useState([]);
  const [filteredlink, setfilteredlink] = useState([]);

  const fileExtensions = ["pdf", "docx", "doc", "txt"];
  const fileExtensionsPic = ["jpg", "jpge", "png", "svg"];

  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };

  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employer/freelancerdetail/${userid}`
        );
        setreadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [userid]);

  useEffect(() => {
    const filtertype = (items, title) => {
      if (items && items.length > 0) {
        const filtered = items.reduce((acc, item, index) => {
          if (item.includes(".")) {
            const extension = getFileExtension(item);
            if (fileExtensions.includes(extension)) {
              acc.push({ item, title: title[index] }); // Add item and title
            }
          }
          return acc;
        }, []);
        
        const filteredpic = items.reduce((acc, item, index) => {
          if (item.includes(".")) {
            const extension = getFileExtension(item);
            if (fileExtensionsPic.includes(extension)) {
              acc.push({ item, title: title[index] });
            }
          }
          return acc;
        }, []);
        
        const filteredlink = items.reduce((acc, item, index) => {
          if (!item.includes(".")) {
            acc.push({ link: item, title: title[index] }); 
          }
          return acc;
        }, []);
        
   

        // Update state with filtered items
        setfilteredlink(filteredlink);
        setfilteredfile(filtered);
        setfilteredpic(filteredpic);
      }
    };

    filtertype(
      readData?.freelancerprofile?.portfolio?.link,
      readData?.freelancerprofile?.portfolio?.title
    );
  }, [readData]);


  const work = () => {
    if (!showWork) setshowWork(!showWork);
    if (showPortfolio) {
      setshowportfolio(!showPortfolio);
    }
    if (showOther) setshowOther(!showOther);
  };

  const portfolio = () => {
    if (!showPortfolio) setshowportfolio(!showPortfolio);
    if (showWork) setshowWork(!showWork);
    if (showOther) setshowOther(!showOther);
  };

  const other = () => {
    if (!showOther) setshowOther(!showOther);
    if (showPortfolio) {
      setshowportfolio(!showPortfolio);
    }
    if (showWork) setshowWork(!showWork);
  };

  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    if (!userData) {
      const redirectData = {
        pathname: "/employerpage/Freelancerdetails",
        state: location.state,
      };
      sessionStorage.setItem(
        "redirectDataEmployer",
        JSON.stringify(redirectData)
      );

      navigate("/login");
    } else {
      setPopup(!popup);
    }
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  const generateStars = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2;
    const stars = [];
    for (let i = 5; i >= 1; i--) {
      if (roundedRating >= i) {
        stars.push(
          <label key={i} className={`${i} full-stars`}>
            &#9733;
          </label>
        );
      } else if (roundedRating + 0.5 === i) {
        stars.push(
          <label key={i} className={`${i} half-stars`}>
            &#9733;
          </label>
        );
      } else {
        stars.push(
          <label key={i} className={`${i} no-stars`}>
            &#9734;
          </label>
        );
      }
    }
    stars.reverse();
    return stars;
  };
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    setCurrentDateTime({
      date: formattedDate,
      time: formattedTime,
    });
  }, []);

  const combinedDateTime = `${currentDateTime.date} ${currentDateTime.time}`;

  const saveOffer = async () => {
    try {
      await axios.post("http://localhost:4000/Offer/write", {
        ...inputValue,
        PostedDate: combinedDateTime,
        freelancerid: userid,
        employerid: userData.userID,
        status: "waiting",
      });
      console.log("data: ", inputValue);
      setIsPopupAlertVisible("offer posted");
    } catch (error) {
      console.log("error", error);
    }
  };

  const openDocument = (value) => {
    const file = `http://localhost:4000/${value}`;
    window.open(file, "_blank");
  };

  return (
    <>
      <div className="full-page">
        <div className="fdetails">
          {readData && (
            <div className="firstinfo">
              <img
                className="ppf-details"
                src={
                  readData.freelancerprofile.profilepic === "" ||
                  readData.freelancerprofile.profilepic === null
                    ? `/image/profile.jpg`
                    : getProfilePicUrl(readData.freelancerprofile.profilepic)
                }
                alt="Profile"
              />

              <h2>
                {" "}
                {t("Freelancer")}: {readData.Fullname}
              </h2>
              <p> {readData.freelancerprofile.description}</p>
              <div className="rating ">
                {generateStars(readData.freelancerprofile.rating)}
              </div>

              <p>
                {" "}
                {t("Gender")}: {readData.Gender}
              </p>
              <p>
                {t("Profession")}: {readData.freelancerprofile.title}
              </p>

              <br />
              {readData.freelancerprofile.skills?.map((skill) => (
                <div className="skills readData">
                  <p>{skill}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {!userData && (
          <button className="chat-btn" onClick={togglePopup}>
            offer
          </button>
        )}
        {userData && userData.UserType === "employer" ? (
          <button className="chat-btn" onClick={togglePopup}>
            offer
          </button>
        ) : null}

        <div className="full-info">
          <div className="radio-inputs">
            <label className="radio">
              <input type="radio" name="radio" />
              <span className="name h" onClick={work}>
                Work History
              </span>
            </label>
            <label className="radio">
              <input type="radio" name="radio" />
              <span className="name r" onClick={portfolio}>
                Porfolio Images
              </span>
            </label>

            <label className="radio">
              <input type="radio" name="radio" />
              <span className="name v" onClick={other}>
                Other Porfolio
              </span>
            </label>
          </div>

          {showWork &&
            (readData.freelancerprofile.workhistory?.length > 0 ? (
              <>
                <ol className="olcards ">
                  {readData.freelancerprofile.workhistory.map((data, index) => (
                    <>
                      <li className="workcard">
                        <div className="content">
                          <div className="title num ">{index + 1}</div>
                          <div className="text work">{data}</div>
                        </div>
                      </li>
                    </>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <ol className="olcards ">
                  <li className="workcard">
                    <div className="content">
                      <div className="text work">No work History</div>
                    </div>
                  </li>
                </ol>
              </>
            ))}

          {showPortfolio && (
            <>
              <PortfolioSlider pics={filteredpic} />
            </>
          )}

          {showOther && (
            <>
              <div className="whloefile">
                <section
                  class="overflow-x"
                  style={{
                    transform:
                      filteredfile.length <= 3
                        ? "translateX(50%)"
                        : filteredfile.length === 4
                        ? "translateX(30%)"
                        : "translateX(0%)",
                  }}
                >
                  <h2>{t("Portfolio Documents")}</h2>
                  <div class="horizontal-friends-list">
                    {filteredfile && filteredfile.length > 0 ? filteredfile.map((file, index) => (
                      <>
                        <figure key={index}>
                          <picture>
                            <FontAwesomeIcon
                              className="icon"
                              icon={faFileDownload}
                              size="6x"
                              style={{
                                color:
                                  filteredfile.length === 1
                                    ? "#ad5252"
                                    : filteredfile.length === 2
                                    ? "#9c8a4c"
                                    : filteredfile.length === 3
                                    ? "#63c99d"
                                    : filteredfile.length === 3
                                    ? "#509be1"
                                    : "#9d9a58" 
                                     ,
                                marginTop: "15px",
                              }}
                              onClick={() => openDocument(file)}
                            />
                          </picture>
                          <br/>
                          <figcaption>{file.title}</figcaption>
                        </figure>
                      </>
                    )):(
                      <>
                      <figure>
                        <picture>
                          <FontAwesomeIcon
                            className="icon"
                            icon={faFileAlt }
                            size="6x"
                            style={{
                              color: "#ad5252",
                              marginTop: "15px",
                              marginLeft:"6.5rem"
                            }}
                          />
                        </picture>
                        <br/>
                        <p   style={{
                             marginLeft:"7.5rem"
                            }}>{"No File"}</p>
                      </figure>
                    </>
                    )}
                  </div>
                </section>
               <section className="linklist">
                <h2>Link</h2>
                {filteredlink && filteredlink.length > 0 ? filteredlink.map((link, index) => (
                  <>
                  <ol>
                    <li> <a style={{color:"#458ef4", textDecoration:"underline"}} href={link.link} target="_blank">{link.title}</a></li>
                  </ol>
                  </>
                )):(
                  <p>No Link</p>
                )}
                </section> 
              </div>
            </>
          )}
        </div>

      
      </div>

      <div className="wrapper">
        {popup && (
          <div className={`form`}>
            <div
              style={{
                width: "450px",
                height: "28rem",
                paddingTop: "2rem",
                transform: "translatex(80%)",
              }}
              className="form-content"
            >
              Description <br />
              <textarea
                style={{ width: "400px", height: "8rem" }}
                className="input"
                type="text"
                placeholder="write a detailed description of the job"
                onChange={(e) =>
                  setinputValue({
                    ...inputValue,
                    Description: e.target.value,
                  })
                }
              />
              <br />
              Price
              <input
                className="input"
                type="text"
                placeholder="set your price"
                onChange={(e) =>
                  setinputValue({
                    ...inputValue,
                    price: e.target.value,
                  })
                }
              />
              <br />
              <br />
              <button
                style={{ color: "#fff" }}
                className="popup-btn"
                onClick={saveOffer}
              >
                Submit
              </button>
              <button
                style={{ color: "#fff" }}
                className="popup-btn"
                id="x"
                onClick={togglePopup}
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
      {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}

    </>
  );
}
