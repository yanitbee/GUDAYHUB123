import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import "./css/taskmanager.css";
import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from 'react-confetti';

export default function Taskmanager() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();
  const [readData, setReadData] = useState([]);
  const [dataLen, setDataLen] = useState("");
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const { width, height } = useWindowSize();
  const [hired, setHired] = useState(false);

  const confettiDuration = 2000; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/applicant/searchappliedposts", {
          params: { freelancerid: userData.userID },
        });
        setReadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

  const [readPost, setReadPost] = useState([]);

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

    const fetchAllPostTitles = async () => {
      const promises = readData.map(data => fetchData(data.postid));
      const postTitles = await Promise.all(promises);
      setReadPost(postTitles);
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

  const changestatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/applicant/changestatus`, null, {
        params: { status: status, applicantid: id },
      });
      window.location.reload(); // Reload the page after changing the status
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    const hiredApplicant = readData.find((data) => data.status === "hired");
    if (hiredApplicant) {
      setHired(true);
      setTimeout(() => {
        changestatus(hiredApplicant._id, "Got the job");
      }, confettiDuration);
    }
  }, [readData]);

  return (
    <>
      <Confetti
        width={width}
        height={height}
        run={hired}
        numberOfPieces={400}
        confettiSource={{ x: 0, y: 100, w: width, h: 600 }}
      />
      <h1 style={{marginTop:"5rem"}}>Task Manager</h1>
      {arrayIsEmpty ? (
        <div className="taskblock">You have not applied to any job or task yet</div>
      ) : (
        <>
          <div className="taskblock">You have applied to {dataLen} job</div>
          <div className="container">
          {readData.map((data, index) => (
  data.status !== "Got the job" ? (
    <div className="applylist" key={data.postid}>
      {readPost[index] && (
        <>
          <h3 className="textf">Job title</h3>
          <p className="titlef">{readPost[index]}</p>
        </>
      )}
      <h3 className="textf">Cover Letter</h3>
      <p className="titlef">{data.Coverletter}</p>
      <h3 className="textf">Status</h3>
      <p className="titlef">{data.status}</p>
    </div>
  ) : null
))}

          </div>

          
          <div className="taskblock">You have gotten {dataLen} job in GudayHub</div>
          <div className="container">
          {readData.map((data, index) => (
  data.status === "Got the job" ? (
    <div className="applylist" key={data.postid}>
      {readPost[index] && (
        <>
          <h3 className="textf">Job title</h3>
          <p className="titlef">{readPost[index]}</p>
        </>
      )}
      <h3 className="textf">Cover Letter</h3>
      <p className="titlef">{data.Coverletter}</p>
      <h3 className="textf">Status</h3>
      <p className="titlef">{data.status}</p>
    </div>
  ) : null
))}

          </div>
        </>
      )}
    </>
  );
}
