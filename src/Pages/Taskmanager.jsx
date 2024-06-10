import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import "./css/taskmanager.css";

export default function Taskmanager() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();
  const [readData, setreadData] = useState([]);
  const [DataLen, setDataLen] = useState("")
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("http://localhost:4000/applicant/searchappliedposts", {
            params: { freelancerid: userData.userID },
          })
          .then((applicant) => setreadData(applicant.data));
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

  const [readpost, setreadpost] = useState([]);

  useEffect(() => {
    const fetchData = async (postId) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/post/searchpost/${postId}`
        );
        return response.data.Jobtitle;
      } catch (error) {
        console.error("error", error);
        return null;
      }
    };
  
    // Use Promise.all to handle multiple asynchronous requests
    const fetchAllPostTitles = async () => {
      const promises = readData.map(data => fetchData(data.postid));
      const postTitles = await Promise.all(promises);
      setreadpost(postTitles);
    };
  
    fetchAllPostTitles();
  }, [readData]);

  




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

  return (
    <>
      <h1>Task Manager</h1>
      {arrayIsEmpty  ? (
        <div className="taskblock">You have not applied to any job or task yet</div>
      ) : (
        <>
        <div className="taskblock">You have applied to {DataLen} job </div>
       <div className="container">
       {readData.map((data, index) => (
  <div className="freelist" key={data.postid}>
     {readpost[index] && (
      <>
        <h3 className="textf">Job title</h3>
        <p className="titlef">{readpost[index]}</p>
      </>
    )}

    <h3 className="textf">Cover Letter </h3>
    <p className="titlef">{data.Coverletter}</p>
    <h3 className="textf"> Status </h3>
    <p className="titlef">{data.status}</p>
  </div>
))}
       </div>
       </>
       
      )}
    </>
  );
}
