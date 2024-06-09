import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";


export default function Posthistory({prop}){
    const { getUserData, getUserToken } = useAuth();

    const userData = getUserData();
    const token = getUserToken();


    const [readData, setreadData] = useState([]);
    const [postid,setpostid] =useState("")


    useEffect(() => {
      const fetchData = async () => {
        try {
         await axios.get("http://localhost:4000/post/reademployerpost" ,{
          params: { employerid: userData.userID }
        })
            .then((Post) => setreadData(Post.data));
            console.log(userData.userID)
            
        } catch (error) {
          console.error("error", error);
        }
      };
      fetchData();
    }, [userData.userID]);

    
   

    let navigate = useNavigate();

    const handleclick = (postid) => {
        navigate("/employerpage/Applicantsdetails/more", { state: {postid: postid}});
    }

    return(
        <>
     <div className="container">
        {readData.map((data) => (
         <div onClick={() => handleclick(data._id)} className="freelist" >
             <div>
             <h3 className="textf">Job title </h3>
          <p className="titlef">{data.Jobtitle}</p>
          </div>
             <h3 className="textf">Job type </h3>
          <p className="titlef">{data.Jobtype}</p>
          <h3 className="textf">Description </h3>
          <p className="titlef">{data.Description}</p>
           </div>
         ))}
          </div>
        </>
     )
    }