import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../components/employer/css/freelancerdetails.css";
import useAuth from "../Hooks/UseAuth";
import { AuthContext } from "../Hooks/AuthContext";
import PortfolioSlider from "../assets/portfolio";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload,faFileAlt  } from "@fortawesome/free-solid-svg-icons";
import AlertPopup from "../assets/AlertPopup";
import Popup from "../assets/popup";


export default function Hire() {
  const { getUserData, getUserToken } = useAuth();
  const { setCurrentChat } = useContext(AuthContext);
  const { t } = useTranslation();

  const userData = getUserData();
  const token = getUserToken();
  const location = useLocation();
  const navigate = useNavigate();

  const { userid, applicaionid, check } = location.state || {};

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

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setinterviewType] = useState("");
  const [interviewinfo, setInterviewinfo] = useState("");

  const [showWork, setshowWork] = useState(true);
  const [showPortfolio, setshowportfolio] = useState(false);
  const [showOther, setshowOther] = useState(false);

  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");
  const [isPopupRAlertVisible, setIsPopupRAlertVisible] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState("");
  const [isPopupHVisible, setisPopupHVisible] = useState("")

  const handleConfirm =  () => {
    changestatus("closed")
    handleCancel()
    
  };

  const handleCancel = () => {
    setIsPopupVisible("");
  };

  const handleHConfirm =  () => {
    hiredapp("hire")
    handleHCancel()
    
  };

  const handleHCancel = () => {
    setisPopupHVisible("");
  };



  const handleClose = () => {
    setIsPopupAlertVisible("");
  };

  const handleRClose = () => {
    setIsPopupRAlertVisible("");
  };

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

  const [filteredfile, setfilteredfile] = useState([]);
  const [filteredpic, setfilteredpic] = useState([]);
  const [filteredlink, setfilteredlink] = useState([]);


  const fileExtensions = ["pdf", "docx", "doc", "txt"];
  const fileExtensionsPic = ["jpg", "jpge", "png", "svg"];

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



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/applicant/setinterviewdate", {
        applicantid: applicaionid,
        interviewdate: interviewDate,
        interviewTime: interviewTime,
        interviewInfo: interviewinfo,
        interviewType: interviewType,
      });
      setIsPopupAlertVisible("Interview date and time set successfully");
    } catch (error) {
      console.error("Error setting interview date:", error);
    }
  };

  const changestatus = async (status) => {
    try {
      await axios.put(`http://localhost:4000/applicant/changestatus`, null, {
        params: { status: status, applicantid: applicaionid },
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const [application, setapplication] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/applicant/searchapplicant/${applicaionid}`
        );
        setapplication(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();

    if (application && application.status === "waiting")
      changestatus("application opened");
  },[applicaionid]);



  const hiredapp = async (status) => {
    try {
      if (!applicaionid) {
        throw new Error('Application ID is missing');
      }
  
      await axios.put('http://localhost:4000/applicant/changestatus', null, {
        params: { status: status, applicantid: applicaionid },
      });


      await axios.post('http://localhost:4000/hired/addhired', {
        appId: applicaionid,
      });

  
      // Show success popup
      setIsPopupAlertVisible('Applicant hired');
      setIsPopupVisible('Do you wish to close this job opening?');
    } catch (error) {
      console.error('Error adding hired:', error);
      setIsPopupAlertVisible('An error occurred while hiring the applicant');
    }
  };
  

  // Toggle the popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setInterviewDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setInterviewTime(e.target.value);
  };

  const handleTypeChange = (e) => {
    setinterviewType(e.target.value);
  };

  const handleLocationChange = (e) => {
    setInterviewinfo(e.target.value);
  };

  const openDocument = (value) => {
    const file = `http://localhost:4000/${value}`;
    window.open(file, "_blank");
  };

  const [rating, setRating] = useState(0);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };
  
  const handleratingSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/user/addrating/${userid}`,
        { rating }
      );
      setIsPopupRAlertVisible("Rating submitted successfully");
      response.data;
    } catch (error) {
      console.error("Error submitting rating", error);
    }
  };

  const startConvo = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/conversations/`,
        {
          senderId: userData.userID,
          receiverId: userid,
        }
      );
      console.log("convo started successfully");
      const converation = response.data;
      setCurrentChat(converation);
      navigate("/Messenger");
    } catch (error) {
      console.error("Error starting convo", error);
    }
  };

  const handleHide = () => {
    setisPopupHVisible("Do you wish to Hire this applicant?");
  }


  return (
    <>
      <div className="full-page">
        <div className="fdetails">
          {readData && (
            <div style={{ transform: "translateX(25%)" }}>
              <h2>Freelancer: {readData.username}</h2>
              <p style={{ color: "#fff" }}>FullName: {readData.Fullname}</p>
              <p style={{ color: "#fff" }}>
  Skills:{" "}
  {readData.freelancerprofile.skills
    ? readData.freelancerprofile.skills.map((skill, index) => (
        <span key={index}>
          {skill}
          {(index + 1) % 3 === 0 && index !== readData.freelancerprofile.skills.length - 1 ? (
            <><br /></>
          ) : index !== readData.freelancerprofile.skills.length - 1 ? (
            ", "
          ) : null}
        </span>
      ))
    : "No skills listed"}
</p>


              <p style={{ color: "#fff" }}>
                PhoneNumber: {readData.Phonenumber}
              </p>
              <p style={{ color: "#fff" }}>Email: {readData.Email}</p>
              <p style={{ color: "#fff" }}>Gender: {readData.Gender}</p>
              <p style={{ color: "#fff" }}>
                Profession:{readData.freelancerprofile.title}
              </p>
              <p style={{ color: "#fff" }}>CV</p>

              <div
                className="cv1"
                style={{
                  display: "inline",
                  borderRight: "none",
                  marginRight: "-10rem",
                }}
              >
                {readData.freelancerprofile.cv ? (
                  
                <img
                  src={`/image/cv.png`}
                  onClick={() => {
                    openDocument(readData.freelancerprofile.cv);
                  }}
                />
              ): (
                <p>No CV</p>
              )}
              </div>

              <div className="ratings ">
                <input
                  value="5"
                  name="rate"
                  id="star5"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star5"></label>
                <input
                  value="4"
                  name="rate"
                  id="star4"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star4"></label>
                <input
                  value="3"
                  name="rate"
                  id="star3"
                  type="radio"
                  checked=""
                  onChange={handleRatingChange}
                />
                <label title="text" for="star3"></label>
                <input
                  value="2"
                  name="rate"
                  id="star2"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star2"></label>
                <input
                  value="1"
                  name="rate"
                  id="star1"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star1"></label>
              </div>

              <div className="checkbox-wrapper-56">
                <label className="rating-container">
                  <input
                    checked="checked"
                    type="checkbox"
                    onClick={handleratingSubmit}
                  />
                  <div className="checkmark"></div>
                </label>
              </div>

              <button className="chat-btn txtme" onClick={startConvo}>
                Text Me
              </button>
              {check !== "hired" && (
                <>
                  <button className="chat-btn interview" onClick={togglePopup}>
                    Set interview
                  </button>
                  <button
                    className="chat-btn hire"
                    onClick={handleHide}
                  >
                    Hire
                  </button>
                </>
              )}
            </div>
          )}
        </div>

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
              <input type="radio" name="radio" onClick={other}/>
              <span className="name v">Other Porfolio</span>
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
      {isPopupOpen && (
        <div className="popupi">
          <div className="popup-contenti">
            <h2>Set Interview Details</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="interviewType">Interview Type:</label>
              <select
                id="interviewType"
                value={interviewType}
                onChange={handleTypeChange}
              >
                <option value="video">Video Interview</option>
                <option value="onsite">Onsite Interview</option>
              </select>

              {interviewType === "onsite" && (
                <div>
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id="location"
                    value={interviewinfo}
                    onChange={handleLocationChange}
                  />
                </div>
              )}

              <label htmlFor="interviewDate">Interview Date:</label>
              <input
                type="date"
                id="interviewDate"
                value={interviewDate}
                onChange={handleDateChange}
              />
              <label htmlFor="interviewTime">Interview Time:</label>
              <input
                type="time"
                id="interviewTime"
                value={interviewTime}
                onChange={handleTimeChange}
              />
              <button type="submit">Set Date</button>
              <button type="button" onClick={togglePopup}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
                 {isPopupVisible != "" && (
        <Popup
          message = {isPopupVisible}
          onConfirm={()=>{handleConfirm()}}
          onCancel={handleCancel}
        />
      )}
                       {isPopupHVisible != "" && (
        <Popup
          message = {isPopupHVisible}
          onConfirm={()=>{handleHConfirm()}}
          onCancel={handleHCancel}
        />
      )}
           {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}

{isPopupRAlertVisible != "" && (
        <AlertPopup
          message = {isPopupRAlertVisible}
          onClose={handleRClose}
        />
      )}
    </>
  );
}
