import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Popup from "../assets/popup";
import "./css/apply.css";

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
      <div>
        {readData && (
          <div>
            <h2> {readData.JobTask}</h2>
            <h2>Job Type: {readData.Jobtype}</h2>
            <p>Job Title: {readData.Jobtitle}</p>
            <p>Description: {readData.Description}</p>
            <p>Qualification: {readData.Qualification}</p>
            <p>Salary: {readData.Salary}</p>
            <p>location: {readData.location}</p>
            <p>Contact: {readData.Contact}</p>
            <p>PostedDate: {readData.PostedDate}</p>
            <p>Deadline: {readData.Deadline}</p>

            <button onClick={handleShowPopup}>Close opening</button>

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
