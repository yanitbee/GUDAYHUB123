import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/freelancerlist.css"

export default function Freelancerlist(){
    const [readData, setreadData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get("http://localhost:4000/employer/readfromserver")
          .then((User) => setreadData(User.data));
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

    const navigate = useNavigate();

    const handleclick = (userid) => {
        navigate("Freelancerdetails", { state: {userid: userid }});}

        const filteredData = readData.filter((data) => data.Usertype === "freelancer");

      
  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
    
  };

    

    return(
        <>
     <div className="container">
        {filteredData.map((data) => (
         <div onClick={() => handleclick(data._id)} className="freelist" >
             <div>
            
            <img
            className="ppf" 
              src={
                data.freelancerprofile.profilepic === "" ||
                data.freelancerprofile.profilepic === null
                  ? `/image/profile.jpg`
                  : getProfilePicUrl(data.freelancerprofile.profilepic)
              }
              alt="Profile"
            />
             <h3 className="textf">Name </h3>
          <p className="titlef">{data.Fullname}</p>
          </div>
             <h3 className="textf">Username </h3>
          <p className="titlef">{data.username}</p>
          <h3 className="textf">Email </h3>
          <p className="titlef">{data.Email}</p>
           </div>
         ))}
          </div>
        </>
     )
    }