import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Popup from "../assets/popup";
import "./css/apply.css";
import EmployerProfile from "../components/employer/EmployerProfile";
import { format } from "timeago.js";

export default function Postdetails() {
 
  const location = useLocation();

  const { postid } = location.state || {};



  const [readData, setreadData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/post/searchpost/${postid}`
        );
        setreadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);


  const closejob = async (postId) => {
    try {
      await axios.post("http://localhost:4000/postHistory/closepost", { postId });
      alert("Job post closed successfully");
      // Optionally, refresh the list of posts or remove the closed post from the state
    } catch (error) {
      console.error("Error closing post:", error);
      alert("Error closing post");
    }
  };
  

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleShowPopup = () => {
    setIsPopupVisible(true);
  };

  const handleConfirm = (id) => {
    closejob(id);
    setIsPopupVisible(false);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
  };


  return (
    <>
       <EmployerProfile />
      <div className="applaywhole">
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

            <button className="apply-btn" onClick={handleShowPopup}>Close opening</button>

            {isPopupVisible && (
        <Popup
          message="Do you really want to close this job post?"
          onConfirm={()=>{handleConfirm(readData._id)}}
          onCancel={handleCancel}
        />
      )}
   
          </div>

        )}
      </div>



    </>
  );
}
