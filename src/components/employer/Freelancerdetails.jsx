import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./css/freelancerdetails.css";

export default function Freelancerdetails() {
  const location = useLocation();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employer/freelancerdetail/${userid}`
        );
        setreadData(response.data);
        console.log(response.data.freelancerprofile.title);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [userid]);

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
      <div className="fdetails">
        {readData && (
          <div>
            <h2>Freelancer: {readData.username}</h2>
            <p>FullName: {readData.Fullname}</p>
            <p>
              Skills:{" "}
              {readData.freelancerprofile.skills
                ? readData.freelancerprofile.skills.map((skill) => skill)
                : null}
            </p>
            <p>PhoneNumber: {readData.Phonenumber}</p>
            <p>Email: {readData.Email}</p>
            <p>Gender: {readData.Gender}</p>
            <p>Profession:{readData.freelancerprofile.title}</p>
            <p>CV: {readData.cv}</p>
            <button className="chat-btn" onClick={togglePopup}>
               offer
            </button>
          </div>
        )}
      </div>
    </>
  );
}
