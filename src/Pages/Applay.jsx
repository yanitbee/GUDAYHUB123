import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import { format } from "timeago.js";
import "./css/apply.css";
import Popup from "../assets/popup";
import AlertPopup from "../assets/AlertPopup";
import Frelancerprofile from "../components/Freelancer/FrelancerProfile";

export default function Apply() {
  const { getUserData, getUserToken } = useAuth();
  const navigate = useNavigate();

  const userData = getUserData();
  const token = getUserToken();

  const location = useLocation();
  const { postid } = location.state || {};

  const [readData, setReadData] = useState([]);
  const [freelancerData, setFreelancerData] = useState([]);
  const [applied, setApplied] = useState("");
  const [file, setFile] = useState("");
  const [inputValue, setInputValue] = useState({
    Freelancerid: "",
    postid: "",
    Coverletter: "",
    status: "",
  });

  const [HaveSchedule, setHaveSchedule] = useState(false);
  const [ScheduleInfo, setScheduleInfo] = useState([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [verificationDate, setverificationDate] = useState("");
  const [verificationTime, setverificationTime] = useState("");
  const [notes , setnotes ] = useState("");


  const [popup, setPopup] = useState(false);

  const [isPopupVisible, setIsPopupVisible] = useState("");
  const [isPopupRVisible, setIsPopupRVisible] = useState("");
  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };
  const handleCancel = () => {
    setIsPopupVisible("");
  };

  const handleRCancel = () => {
    setIsPopupRVisible("");
  };


  useEffect(() => {
    const fetchFreelancerData = async () => {
      if (userData && userData.userID) {
        try {
          const response = await axios.get(
            `http://localhost:4000/freelancer/apply/${userData.userID}`
          );
          setFreelancerData(response.data);
        } catch (error) {
          console.error("freelancer error", error);
        }
      }
    };
    fetchFreelancerData();
  }, [userData]);

  const uploadcv = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const alreadyApplied = (applied) => {
    if (applied === "applied") {
      setIsPopupAlertVisible("You have already applied");
    }
    if (applied === "hired") {
      setIsPopupAlertVisible("You have already been hired");
    }
  };

  const saveData = async () => {
    try {
      editData(file);
      if (readData.coverletter && !inputValue.Coverletter) {
        setIsPopupAlertVisible("Cover letter is a requirement for this job");
        return;
      }
      if (
        readData.cv &&
        (!freelancerData.freelancerprofile.cv ||
          freelancerData.freelancerprofile.cv === "")
      ) {
        setIsPopupAlertVisible("CV is a requirement for this job");
        return;
      }
      await axios.post("http://localhost:4000/applicant/writeapplicant", {
        Freelancerid: userData.userID,
        postid: readData._id,
        Coverletter: inputValue.Coverletter,
        status: "waiting",
      });
      console.log("data: ", inputValue);
      setPopup(!popup);
      setIsPopupAlertVisible("Application sent");
      fetchData();
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchData = async () => {
    if (userData && userData.userID) {
      try {
        const response = await axios.get(
          "http://localhost:4000/applicant/searchapplied",
          {
            params: { postid: postid, freelancerid: userData.userID },
          }
        );
        const data = response.data;

        if (data.message === "have applied") {
          setApplied("applied");
        }
        if (data.message === "have been hired") {
          setApplied("hired");
        }
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [postid, userData]);

  function isFormDataEmpty(formData) {
    for (let pair of formData.entries()) {
      return false;
    }
    return true;
  }

  const editData = async (cv) => {
    const formData = new FormData();
    if (cv) {
      formData.append("cv", cv);
    }

    if (!isFormDataEmpty(formData)) {
      try {
        await axios.put(
          `http://localhost:4000/freelancer/edit/${userData.userID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (error) {
        console.error("error", error);
      }
    }
  };


  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/post/searchpost/${postid}`
        );
        setReadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchPostData();
  }, [postid]);

  const convertDate = (data) => {
    const date = new Date(data);
    return date.toISOString().split("T")[0];
  };

  const togglePopup = () => {
    if (!userData) {
      const redirectData = {
        pathname: "/freelancerpage/Apply",
        state: location.state,
      };
      sessionStorage.setItem("redirectDataFreelancer", JSON.stringify(redirectData));
      navigate("/login");
    }else if(!freelancerData.IsVerified || freelancerData.IsVerified === false){
      if(HaveSchedule === true){
        setIsPopupRVisible(`Your account have not been verified yet. you have a scheduled verification on ${convertDate(ScheduleInfo.schedule.verificationDate)} at ${ScheduleInfo.schedule.verificationTime}. Do you wish to reschedule?`);
      }else{
      setIsPopupVisible("Your account have not been verified yet Click yes if you want to Schedule Your verification");
    }
    }
     else {
      setPopup(!popup);
    }
  };

  const handleDateChange = (e) => {
    setverificationDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setverificationTime(e.target.value);
  };




    const handleConfirm =  () => {
      setIsPopupOpen(!isPopupOpen);
      handleCancel()
      
    };
    const handleRConfirm =  () => {
      setIsPopupOpen(!isPopupOpen);
      setnotes("Reschedule")
      handleRCancel()
      

    };

    const handleClosePop = () => {
      setIsPopupOpen(false)
      setnotes("")
    }
    
    const scheduleVerification = async (e) => {
      e.preventDefault();
      const formData = {
        freelancerId: userData.userID,
        freelanerName: freelancerData.Fullname,
        freelancerEmail: freelancerData.Email,
        verificationDate: verificationDate, 
        verificationTime: verificationTime, 
        notes: notes ? notes : "New schedule",
      };
    setnotes("")
      try {
        const response = await axios.post('http://localhost:4000/user/schedule-verification', formData)
        setIsPopupOpen(false)
        setIsPopupAlertVisible(response.data.message)
        console.log('Verification scheduled:', response.data);
      } catch (error) {
        console.error('Error scheduling verification:', error);
      }
    };
    


  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  useEffect(() => {
    const fetchScheduleById = async () => {
      try {
          const response = await axios.get(`http://localhost:4000/user/schedule/${userData.userID}`);
          if(response.data.message === "Schedule found")
            {
              setHaveSchedule(true)
              setScheduleInfo(response.data)
            }
      } catch (error) {
          console.error('Error fetching schedule:', error);
          return null;
      }
  };
  fetchScheduleById()
  },[userData])


  return (
    <>
    {userData &&    <Frelancerprofile />}
   
      <div className="applaywhole ">
        {readData && (
          <div>
            <h1 className="title">{readData.Jobtitle}</h1>
            <br />
            <div className=" row">
              <div className=" leftone col-5">
                <h2> {readData.JobTask}</h2>
                <h2>{readData.Jobtype}</h2>
                <div className="onebyone">
                  <h3>Description</h3>
                  <p>{readData.Description}</p>
                </div>

                <div className="oneby"></div>
                <h3>Qualification</h3>
                {readData.Qualification && (
                  <ul>
                    {readData.Qualification.split(",").map((item, index) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                  </ul>
                )}

                <p>Salary: {readData.Salary}</p>
                <p>Location: {readData.location}</p>
                <p>Contact: {readData.Contact}</p>
                <p>Posted Date: {format(readData.PostedDate)}</p>
                <p>Deadline: {readData.Deadline}</p>
              </div>

              <div className="sideline col-3">
           <h4>Requirements to apply</h4><br/>
                <div className="by"></div><br/>
                <div className="typewhole">
                <h5>CV:</h5>

                {readData.cv ? 
                <p style={{marginTop:".5rem", marginLeft:"1rem",color:"#830000"}}>Required</p>
              :<p style={{marginTop:".5rem", marginLeft:"1rem",color:"#1c8300"}}> Not Required</p>}
                </div>
                <div className="typewhole">
                <h5>Cover Letter:</h5>

                {readData.coverletter ? 
                <p style={{marginTop:".5rem", marginLeft:"1rem",color:"#830000"}}>Required</p>
              :<p style={{marginTop:".5rem", marginLeft:"1rem",color:"#1c8300"}}> Not Required</p>}
                </div>

                {readData.urgency ? 
                <p style={{marginTop:".5rem", marginLeft:"1rem",color:"#830000"}}>Urgent</p>
              :null}
              </div>

            </div>
            {applied === "applied" || applied === "hired" ? (
              <button
                className="apply-btn applied"
                onClick={() => alreadyApplied(applied)}
              >
                Apply Now
              </button>
            ) : (
              <button className="apply-btn" onClick={togglePopup}>
                Apply Now
              </button>
            )}

            <div className="wrapper">
            {isPopupVisible != "" && (
        <Popup
          message = {isPopupVisible}
          onConfirm={()=>{handleConfirm()}}
          onCancel={handleCancel}
        />
      )}
           {isPopupRVisible != "" && (
        <Popup
          message = {isPopupRVisible}
          onConfirm={()=>{handleRConfirm()}}
          onCancel={handleRCancel}
        />
      )}

      {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}

{isPopupOpen && (
        <div className="popupi">
          <div className="popup-contenti">
            <h2>schedule Your Verification</h2>
            <form onSubmit={scheduleVerification}>
              
          
          
              <label htmlFor="interviewDate">Verification Date:</label>
              <input
                type="date"
                id="interviewDate"
                value={verificationDate}
                onChange={handleDateChange}
              />
              <label htmlFor="interviewTime">Verification Time:</label>
              <input
                type="time"
                id="interviewTime"
                value={verificationTime}
                onChange={handleTimeChange}
              />
              <button type="submit">Schedule</button>
              <button type="button" onClick={handleClosePop}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

              {popup && (

                <div className={`form`}>
                  <div className="form-content">
                    <h3 className="">
                 
                      Application for {readData.Jobtitle} position
                    </h3>
                    Fullname
                    <input
                      className="input"
                      type="text"
                      placeholder={freelancerData.Fullname}
                    />
                    <br />
                    Phonenumber
                    <input
                      className="input"
                      type="text"
                      placeholder={freelancerData.Phonenumber}
                    />
                    <br />
                    Email
                    <input
                      className="input"
                      type="email"
                      placeholder={freelancerData.Email}
                    />{" "}
                    <br />
                    Address
                    <input
                      className="input"
                      type="text"
                      placeholder="Address"
                    />{" "}
                    <br />
                    Your CV
                    {freelancerData.freelancerprofile.cv ? (
                      <div className="">
                        <a
                          href={getProfilePicUrl(
                            freelancerData.freelancerprofile.cv
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`/image/cv.png`}
                            style={{ width: "5rem" }}
                          />
                        </a>
                      </div>
                    ) : null}
                    Change CV
                    <input type="file" onChange={uploadcv} /> <br />
                    Cover Letter
                    <input
                      className="input"
                      type="text"
                      placeholder="coverletter"
                      value={inputValue.Coverletter}
                      onChange={(e) =>
                        setInputValue({
                          ...inputValue,
                          Coverletter: e.target.value,
                        })
                      }
                    />{" "}
                    <br />
                    <br /> <br />
                    <button className="popup-btn" onClick={saveData}>
                      Submit
                    </button>
                    <button className="popup-btn" id="x" onClick={togglePopup}>
                      X
                    </button>
                
                  </div>
                </div>
              )}
            </div>
            
          </div>
          
        )}
        
      </div>
    </>
  );
}
