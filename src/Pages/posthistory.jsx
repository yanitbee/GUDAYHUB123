import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import "./css/taskmanager.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser ,faUserCheck } from "@fortawesome/free-solid-svg-icons";
import ApplicantNum from "../components/employer/applicantNum";
import EmployerProfile from "../components/employer/EmployerProfile";


export default function Posthistory(){
    const { getUserData, getUserToken } = useAuth();

    const userData = getUserData();
    const token = getUserToken();


    const [readData, setreadData] = useState([]);
    const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
    const [DataLen, setDataLen] = useState("")

    

    useEffect(() => {
      const fetchData = async () => {
        try {
       const response = await axios.get("http://localhost:4000/post/reademployerpost" ,{
          params: { employerid: userData.userID }
        })
            
            const sortedData = response.data.sort(
              (a, b) => new Date(b.PostedDate) - new Date(a.PostedDate)
            );
            setreadData(sortedData);
            
        } catch (error) {
          console.error("error", error);
        }
      };
      fetchData();
    }, [userData.userID]);

    
   

    const navigate = useNavigate();

    const handleclick = (postid) => {
        navigate("/employerpage/Applicantsdetails/more", { state: {postid: postid}});
    }

    const isEmpty = (arr) => {
      const isEmptyArray = arr.length === 0;
      if (!isEmptyArray) {
        setDataLen(arr.length);
      }
      return isEmptyArray;
    };
  
    useEffect(() => {
      const emptyCheck = isEmpty(readData);
      setArrayIsEmpty(emptyCheck);
    }, [readData]);

    const handlepost = (postid) => {
      navigate("/employerpage/Applicantsdetails/postdetails", { state: { postid: postid } });
    };

    return(
        <>
           <EmployerProfile />
        <div className="wholeposthist">
          <div className="mainpostHis">
         {arrayIsEmpty  ? (
        <div className="taskblock catagory">You have not posted any job or task yet</div>
      ) : (
     <div>
      <div className="taskblock catagory">You have {DataLen} active job </div>
        {readData.map((data) => (
          <>
          <div className="">
         <div className="applylist catagory" >
             <div>
             <h4 className="textf">Job title </h4>
          <p className="titlef">{data.Jobtitle}</p>
          </div>
             <h4 className="textf">Job type </h4>
          <p className="titlef">{data.Jobtype}</p>
          <h4 className="textf">Description </h4>
          <p className="titlef">{data.Description}</p>
          <div className="linepost"></div>
          <div style={{display:"inline"}}>
          <FontAwesomeIcon color="#47ae4b"
          style={{height:"25px"}} icon={faUser } />
          <FontAwesomeIcon color="#a45f5f" style={{height:"25px", marginLeft:"7rem"}}  icon={faUserCheck} />
          </div>

          <div style={{}}>
            <sapn   style={{display:"inline-block", marginLeft:"-.5rem"}}>
          <ApplicantNum postId={data._id } type="App"
        />
          </sapn>
          <span   style={{marginLeft:"8rem",display:"inline-block"}}>
          <ApplicantNum postId={data._id } type="Hired"
        />
          </span>

          </div>
            </div>
            <button className="btn-job1 more" onClick={() => handlepost(data._id)}>
            Post details</button>
          <button className="btn-job1 more1" onClick={() => handleclick(data._id)}>See applicant</button>

          </div>
          </>
         ))}
          </div>
            )}
            </div>

            </div>
        </>
     )
    }