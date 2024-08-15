import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import "./css/interview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import PhoneIcon from "@mui/icons-material/Phone";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();


  const navigate = useNavigate()
  const [readData, setReadData] = useState([]);
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [employerInfo, setEmployerInfo] = useState([]);
  const [postInfo, setPostInfo] = useState([]);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null);

  const showDetails = (index) => {
    setSelectedConversationIndex(index);
  };

  useEffect(() => {
    setArrayIsEmpty(readData.length === 0);
  }, [readData]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        if(userData.UserType === "freelancer"){
        const appliedResponse = await axios.get(
          "http://localhost:4000/applicant/searchappliedposts",
          {
            params: { freelancerid: userData.userID },
          }
        );

        const filteredData = appliedResponse.data.filter(
          (post) => post.status === "Interview Set"
        );
        setReadData(filteredData);



        const appliedEmployer = await Promise.all(
          filteredData.map((data) =>
            axios
              .get(`http://localhost:4000/post/searchemployer/${data.postid}`)
              .then((response) => response.data)
              .catch(() => null)
          )
        );


        const posts = appliedEmployer.map((item) => item.post);
        const employers = appliedEmployer.map((item) => item.employer);

        setPostInfo(posts);
        setEmployerInfo(employers);
          }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      }

    fetchData();
  }, [userData.userID, token]);

  useEffect(()=>{
    const fetchData = async () => {
      if(userData.UserType === "employer"){  
        try{
         const applicaion = await axios.get(
           `http://localhost:4000/applicant/applicationInterview/${userData.userID} `,
         );
     setReadData(applicaion.data)

     const appliedFreelancer = await Promise.all(
      applicaion.data.map((data) =>
        axios
          .get(`http://localhost:4000/applicant/searchfreelancer/${data.Freelancerid}`)
          .then((response) => response.data)
          .catch(() => null)
      )
    );


    setEmployerInfo(appliedFreelancer);
       
        }catch (error) {
         console.error("Error fetching data:", error);
       }
              
       
     };
    }
    fetchData();
  }, [userData.userID, token])

  const convertDate = (data) => {
    const date = new Date(data);
    return date.toISOString().split("T")[0];
  };

  const isInterviewPassed = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const interviewDate = new Date(date);
    interviewDate.setHours(hours);
    interviewDate.setMinutes(minutes);
    return interviewDate < new Date();
  };

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="search" className="chatMenuInput" />
            {arrayIsEmpty ? (
              <div className="conversationName">No interview history</div>
            ) : (
              <>
                {readData.map((data, index) => (
                  <div
                    className="conversation interviewbox"
                    key={data.postid}
                    onClick={() => showDetails(index)}
                  >
                    {employerInfo[index] && employerInfo[index].status !== "deleted" && (
                      <>
                        <img
                          className="conversationImg"
                          src={
                            employerInfo[index].freelancerprofile.profilepic
                              ? `/uploads/${employerInfo[index].freelancerprofile.profilepic}`
                              : `/image/profile.jpg`
                          }
                          alt="profile"
                        />
                        <span className="conversationName">
                          {employerInfo[index].Fullname}
                        </span>
                      </>
                    )}
                        {employerInfo[index] && employerInfo[index].status === "deleted" && (
                      <>
                        <img
                          className="conversationImg"
                          src={ `/image/deletedUser.png`}
                          alt="profile"
                        />
                        <span className="conversationName"
                        style={{color:"red"}}>
                        Account <br/> Deleted
                        </span>
                      </>
                    )}
                    <span className="intdate end-0">
                      <div>
                        {data.interviewType === "onsite" && (
                          <img
                            className="interviewlogo1"
                            src={`/image/onsiteInterview.png`}
                            alt="Onsite Interview"
                          />
                        )}
                        {data.interviewType === "video" && (
                          <img
                            className="interviewlogo1"
                            src={`/image/interview5.png`}
                            alt="Video Interview"
                          />
                        )}
                        {isInterviewPassed(data.interivewDate, data.interivewTime) ? (
                          <span className="passedInterview">Passed</span>
                        ) : (
                          <span className="notpassed">Active</span>
                        )}
                      </div>
                      <FontAwesomeIcon
                        className="arrow"
                        icon={faCalendarAlt}
                      />{" "}
                      <span className="conversationName">
                        {convertDate(data.interivewDate)}
                      </span>{" "}
                      <FontAwesomeIcon className="arrow" icon={faClock} />{" "}
                      <span className="conversationName">
                        {data.interivewTime}
                      </span>
                    </span>
                    <br/>
                    
                    <div >
                   
                    {data.interviewType === "onsite" && (
                      <div style={{marginLeft:"6rem"}}>
                       <p>Location:</p>
                      { data.interviewInfo}
                       </div>
                    )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="chatBox infoside">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              {selectedConversationIndex !== null &&
              postInfo[selectedConversationIndex] ? (
                <>

                  <span className="convo">Job Details</span>
                  <div className="leftone col-6 infobox">
                    <h2>{postInfo[selectedConversationIndex].JobTask}</h2>
                    <h2>{postInfo[selectedConversationIndex].Jobtype}</h2>
                    <div className="onebyone">
                      <h3>Description</h3>
                      <p>{postInfo[selectedConversationIndex].Description}</p>
                    </div>
                    <div className="oneby"></div>
                    <h3>Qualification</h3>
                    {postInfo[selectedConversationIndex].Qualification && (
                      <ul>
                        {postInfo[selectedConversationIndex].Qualification.split(",").map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                      </ul>
                    )}
                    <p>Salary: {postInfo[selectedConversationIndex].Salary}</p>
                    <p>Location: {postInfo[selectedConversationIndex].location}</p>
                    <p>Contact: {postInfo[selectedConversationIndex].Contact}</p>
                    <p>
                      Posted Date: {convertDate(postInfo[selectedConversationIndex].PostedDate)}
                    </p>
                    <p>Deadline: {postInfo[selectedConversationIndex].Deadline}</p>
                  </div>
                </>
              ) : (
                <span className="noconvo">Open interview to call</span>
              )}
            </div>
            <div className="chatBoxBottom" onClick={() =>{
              navigate("/InterviewCalls")
            }
            }>
              <IconButton color="primary" aria-label="call">
                <PhoneIcon style={{ fontSize: "3.5rem" }} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
