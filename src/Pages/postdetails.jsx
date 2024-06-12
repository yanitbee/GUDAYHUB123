import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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

  const closejob =(id) =>{
    axios.put(`http://localhost:4000/post/closejob/${id}`);
  }

  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!popup);
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }


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

            <button onClick={()=>{closejob(readData._id)}}>Close opening</button>
          </div>
        )}
      </div>
   

    </>
  );
}
