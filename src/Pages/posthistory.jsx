import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import "./css/taskmanager.css";

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
         await axios.get("http://localhost:4000/post/reademployerpost" ,{
          params: { employerid: userData.userID }
        })
            .then((Post) => setreadData(Post.data));
            
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

    return(
        <>
         {arrayIsEmpty  ? (
        <div className="taskblock">You have not posted any job or task yet</div>
      ) : (
     <div>
      <div className="taskblock">You have {DataLen} active job </div>
        {readData.map((data) => (
          <>
         <div className="applylist" >
             <div>
             <h3 className="textf">Job title </h3>
          <p className="titlef">{data.Jobtitle}</p>
          </div>
             <h3 className="textf">Job type </h3>
          <p className="titlef">{data.Jobtype}</p>
          <h3 className="textf">Description </h3>
          <p className="titlef">{data.Description}</p>
            </div>
            <button className="btn-job1 more">
            Post details</button>
          <button className="btn-job1 more1" onClick={() => handleclick(data._id)}>See applicant</button>
          </>
         ))}
          </div>
            )}
        </>
     )
    }