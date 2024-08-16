import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuth from "../../Hooks/UseAuth";
import "./css/profile.css";
import Addprofile from "./Addprofile";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faQuestionCircle, faCommentDots,faWandSparkles,faQuoteLeft,faWarning } from "@fortawesome/free-solid-svg-icons";
import AlertPopup from "../../assets/AlertPopup";
import { Link } from 'react-router-dom';

export default function Frelancerprofile() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const [inputValue, setinputValue] = useState({ title: "" });
  const [ShowAddProfile, setShowAddProfile] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const inputref = useRef(null);
  const [freelancerData, setfreelancerData] = useState({
    Usertype: null,
    username: null,
    Fullname: null,
    Phonenumber: null,
    Email: null,
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

  
  const [addresses, setAddresses] = useState('');
  const [educations, setEducations] = useState(['']);
  const [isVisible, setIsVisible] = useState(false);
  const [CVpopup,setCVpopup] = useState(false)
  const [message,setmessage] = useState("")
  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  const [HaveSchedule, setHaveSchedule] = useState(false);
  const [ScheduleInfo, setScheduleInfo] = useState([]);
  const [CheckVerification, setCheckVerification] = useState(false);

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };

  const handleDismiss = () =>{
    setCheckVerification(false)
  }



  const handleImage = () => {
    inputref.current.click();
  };

  const uploadimg = async (e) => {
    const file = e.target.files[0];

    if (file) {
      await editpic(file);
    }
  };

  const addpro = () => {
    setShowAddProfile(!ShowAddProfile);
    setPopup(!popup);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/freelancer/freelancerapply/${userData.userID}`
        );
        setfreelancerData(response.data);
      } catch (error) {
        console.error("freelacer error", error);
      }
    };
    fetchData();
  }, []);

  const editpic = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.put(
        `http://localhost:4000/freelancer/picedit/${userData.userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setIsPopupAlertVisible(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        setIsPopupAlertVisible("Server error occurred. Please try again later.");
      } else {
        console.error("Error:", error);
        setIsPopupAlertVisible("An error occurred. Please try again later.");
      }
    }
  };

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  const editData = async () => {
    const formData = new FormData();

    formData.append("title", inputValue.title);
    try {
      await axios.put(
        `http://localhost:5000/freelanceredit/${userData._userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("errorr", error);
    }
  };

  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!popup);
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }

  const handleComplaintClick = () => {
    navigate("/Complaint");
  };
  const handleTestimonyClick = () => {
    navigate("/Testimony");
  };
  const handleClick = () => {
    navigate("/Interview");
  };

  const handleViewClick = () =>{
    navigate("/freelancerpage/Freelancerdetails", { state: { userid: userData.userID } });

  }

  
    const handleAddressChange = ( event) => {
      setAddresses(event.target.value);
    };
  
    const handleEducationChange = (index, event) => {
      const newEducations = [...educations];
      newEducations[index] = event.target.value;
      setEducations(newEducations);
    };
  
    const addAddress = () => {
      setAddresses([addresses, { address: '' }]);
    };
  
    const addEducation = () => {
      setEducations([...educations, { education: '' }]);
    };
  
    const handleSave = () => {
      GenerateCV()
    };
    const onClose = () =>{
      setIsVisible(false)
    }

    function validateFreelancerData(freelancerData) {
      const missingFields = [];
    
      if (!freelancerData.Fullname) missingFields.push("Fullname");
      if (!freelancerData.Phonenumber) missingFields.push("Phone number");
      if (!freelancerData.Email) missingFields.push("Email");
      if (!freelancerData.freelancerprofile || !freelancerData.freelancerprofile.title) missingFields.push("Profile title");
      if (!freelancerData.freelancerprofile || !freelancerData.freelancerprofile.skills || freelancerData.freelancerprofile.skills.length === 0) missingFields.push("Skills");
      if (!freelancerData.freelancerprofile || !freelancerData.freelancerprofile.workhistory || freelancerData.freelancerprofile.workhistory.length === 0) missingFields.push("Work history");
      if (!freelancerData.freelancerprofile || !freelancerData.freelancerprofile.description) missingFields.push("Professional description");
    
      return missingFields;
    }
    
    const handleGenerateCV = ()  =>{

      const missingFields = validateFreelancerData(freelancerData);
    
      if (missingFields.length === 0) {
        setIsVisible(true)
      } else {
        const alertMessage = `Please fill in the following fields: ${missingFields.join(', ')}.`;
        setIsPopupAlertVisible(alertMessage); 
      }
   
    }

    const GenerateCV = async () => {
      try {

        const response = await axios.post("http://localhost:4000/freelancer/generateCV", { 
          user: freelancerData,
          address: addresses,
          education: educations 
        });
        if (response.status === 200) {
          const { message, filePath } = response.data; 
          setIsVisible(false)
          setmessage(message)
          setCVpopup(true); 
        } else {
          console.log("Unexpected response:", response);
        }

      } catch (error) {
        console.error("Error generating CV:", error);
      }
    };
    

  const Download = async ()  =>{
    try {
      const response = await axios.get(`http://localhost:4000/freelancer/downloadCV/${freelancerData.username}CV.pdf`, {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${freelancerData.username}.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading CV:", error);
      setIsPopupAlertVisible("Error downloading CV. Please try again later.");
    }
  }
  const handleVerification = async () =>{
setCheckVerification(true)
      try {
          const response = await axios.get(`http://localhost:4000/user/schedule/${userData.userID}`);
          if(!response.data.message === "Schedule not found")
            {setHaveSchedule(true)
              setScheduleInfo(response.data)
            }

      } catch (error) {
          console.error('Error fetching schedule:', error);
          return null;
      }

  }

  
  const convertDate = (data) => {
    const date = new Date(data);
    return date.toISOString().split("T")[0];
  };


  return (
    <>
      <div className="holder start-0 interviewlogo">
        <img
          onClick={handleClick}
          className="profilepic "
          src={`/image/interview5.png`}
          alt="Profile"
        />
      </div>

      <div>
        {ShowAddProfile && <Addprofile prop={freelancerData} prop2={addpro} />}
      </div>
      <div>
        <div className="holder start-0">
          {freelancerData === null ? (
            <img
              onClick={togglePopup}
              className="profilepic "
              src={`/image/profile.jpg`}
              alt="Profile"
            />
          ) : (
            <img
              onClick={togglePopup}
              className="profilepic "
              src={
                freelancerData.freelancerprofile.profilepic === "" ||
                freelancerData.freelancerprofile.profilepic === null
                  ? `/image/profile.jpg`
                  : getProfilePicUrl(
                      freelancerData.freelancerprofile.profilepic
                    )
              }
              alt="Profile"
            />
          )}
        </div>

        <div className="wrapper ">
          {popup && (
            <div className={`profilebox`}>
              <div className="profile-content ">
                <div className="upperpro">
                  <div className="pholder " onClick={handleImage}>
                    <img
                      className="ppic "
                      src={
                        freelancerData.freelancerprofile.profilepic === "" ||
                        freelancerData.freelancerprofile.profilepic === null
                          ? `/image/profile.jpg`
                          : getProfilePicUrl(
                              freelancerData.freelancerprofile.profilepic
                            )
                      }
                      alt="Profile"
                    />
                    <input
                      onChange={uploadimg}
                      type="file"
                      ref={inputref}
                      style={{ display: "none" }}
                    />
                  </div>

                  <br />
                  <div className="infopro">
                    {freelancerData.username} <br />
                    {freelancerData.Email}
                  </div>
                </div>
               
                <div className="complaint "
                onClick={handleViewClick}>
                <FontAwesomeIcon
                      icon={faEye }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
                    <p style={{display:"inline"}}> View portfolio</p>
                </div>
                {freelancerData &&
                  (freelancerData.freelancerprofile?.title === null ||
                  freelancerData.freelancerprofile?.skills === null ||
                  freelancerData.freelancerprofile?.workhistory === null ||
                  freelancerData.freelancerprofile?.description === null ||
                  freelancerData.freelancerprofile.portfolio?.link === null ? (
                    <div className="finprofile" onClick={addpro}>
                       <FontAwesomeIcon
                      icon={faWarning }
                      size="1x"
                      color="rgb(186, 0, 0)"
                    />{" "}
                      <p style={{display:"inline"}}>{t("Finish creating your profile!!")} </p>
                      <h6>
                        {t(
                          "Not having a finished profile  might affect your cradiability!"
                        )}{" "}
                      </h6>
                    </div>
                  ) : null)}

                     <div className="complaint"
                  onClick={handleVerification}
              >
                    <FontAwesomeIcon
                      icon={faQuestionCircle }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
                    <p style={{display:"inline"}}> Verification Status</p>
                </div>

<div
                  className=" complaint"
                  onClick={handleGenerateCV}
                >
                   <FontAwesomeIcon
                      icon={faWandSparkles }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
                  <h6 style={{display:"inline"}}> {" "}{t("Generate CV")} </h6>
                </div>
               { isVisible && (
      <div className="CVpopup">
        <div className="popup-inner">
          <h2>Enter Address and Education</h2>
          
          <div className="address-section">
            <h3>Addresses</h3>
 
              <div >
                <input
                  type="text"
                  placeholder="Enter address e.x(Addis Ababa,Ethiopia)"
                  value={addresses}
                  onChange={(e) => handleAddressChange(e)}
                />
              </div>
            <button className="CV" onClick={addAddress}>Add Address</button>
          </div>
          <br/>
          <div className="education-section">
            <h3>Educations</h3>
            {educations.map((item, index) => (
              <div key={index}>
                <textarea
                  type="text"
                  placeholder="Enter education e.x(institutionName,degree,description)"
                  value={item.education}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </div>
            ))}
            <button className="CV CVEdu" onClick={addEducation}>Add Another Education</button>
          </div>
          
          <button className="popup-btn" onClick={handleSave}>Generate</button>
          <button className="popup-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
      )}


                <div
                  className="Viewpro complaint"
                  onClick={handleComplaintClick}
                >
                   <FontAwesomeIcon
                      icon={faCommentDots }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
                  <h6 style={{display:"inline"}}> {" "}{t("Complaint")} </h6>
                </div>
                <div
                  className=" complaint"
                  onClick={handleTestimonyClick}
                >
                   <FontAwesomeIcon
                      icon={faQuoteLeft }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
                  <h6 style={{display:"inline"}}> {" "}{t("Testimony")} </h6>
                </div>
                <br /> <br />
              </div>
            </div>
          )}
        </div>
      </div>
      {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}

{CheckVerification &&(

<div className="alert-popup-container show">            
<div className="bullet-section" 
style={{transform: "translate(-5%,30%)", backgroundColor:"white",width:"25rem",overflow:"hidden",height:"auto"}}>
  {!freelancerData.IsVerified || freelancerData.IsVerified === false ? (
    <>
    <div className="bubles app"
    style={{backgroundColor:"#d41e1e",marginLeft:"10px"}}><a href="#"><p>Not Verified</p></a></div>
            <p>Read more  <Link to="/verification">HERE</Link>.
         to verify your account.
        or contact us by this number: 123-456-789
      </p>

              <h2>Verification Progress</h2>
      
              <br/>
              {HaveSchedule &&(
                  <div className="list">
                  <div className="itemList">
                
                <img
                        src={`/image/wait.jpg`}
                        alt="waiting"
                      />
                      </div>
                      <div className="itemList">
                    {convertDate(ScheduleInfo.verificationDate)} at {" "}
                    {ScheduleInfo.verificationTime}
                    
                      </div>
                     
                     
                      
                </div>
              )}
              <button className="popup-btn" onClick={handleDismiss}>Okay</button>

    </>
  ):(
    <>
    <div className="bubles hire"
    style={{display:"inline-block",backgroundColor:"#1e8ed4"}}><a href="#"><p>Verified</p></a></div>
     <button className="popup-btn" onClick={handleDismiss}>Okay</button>
    </>
  )} 
            
          
        </div>
        </div> 

)}

{CVpopup && (
            <div className="popupc-container confirm CVdown">
            <div className="popupc ">
              <h2>Message</h2>
              <p>{message}</p>
              <div className="popup-buttons">
                <button id="confirm-button" onClick={Download}>
                  Download
                </button>
                <button id="cancel-button" onClick={()=>{setCVpopup(false)}}>
                  x
                </button>
              </div>
            </div>
          </div>
      )}

    </>
  );
}
