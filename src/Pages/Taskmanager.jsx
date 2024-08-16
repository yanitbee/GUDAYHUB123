import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import "./css/taskmanager.css";
import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from "react-confetti";
import { Pie } from "react-chartjs-2";
import Frelancerprofile from "../components/Freelancer/FrelancerProfile";
import { Chart, registerables } from "chart.js";
import AlertPopup from "../assets/AlertPopup";

Chart.register(...registerables);

export default function Taskmanager() {
  const { getUserData, getUserToken } = useAuth();
  const userData = getUserData();
  const token = getUserToken();

  const [readData, setReadData] = useState([]);
  const [readHired, setReadHired] = useState([]);
  const [readDataPostTitles, setReadDataPostTitles] = useState([]);
  const [readHiredPostTitles, setReadHiredPostTitles] = useState([]);
  const [dataLen, setDataLen] = useState(0);
  const [hiredLen, setHiredLen] = useState(0);
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [hiredIsEmpty, setHiredIsEmpty] = useState(false);
  const [hired, setHired] = useState(false);
  const { width, height } = useWindowSize();
  const confettiDuration = 600;

  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appliedResponse = await axios.get("http://localhost:4000/applicant/searchappliedposts", {
          params: { freelancerid: userData.userID },
        });
        const hiredResponse = await axios.get("http://localhost:4000/hired/searchhiredposts", {
          params: { freelancerid: userData.userID },
        });
  
        setReadData(appliedResponse.data);
        setReadHired(hiredResponse.data);
  
        const appliedPostTitles = await Promise.all(
          appliedResponse.data.map(async (data) => {
            try {
              const response = await axios.get(`http://localhost:4000/post/searchpost/${data.postid}`);
              return response.data.status === "Closed" ? "Closed Job" : response.data.Jobtitle;
            } catch {
              return null;
            }
          })
        );
        setReadDataPostTitles(appliedPostTitles);
  
        const hiredPostTitles = await Promise.all(
          hiredResponse.data.map(async (data) => {
            try {
              const response = await axios.get(`http://localhost:4000/post/searchpost/${data.postid}`);
              return response.data.status === "Closed" ? "Closed Job" : response.data.Jobtitle;
            } catch {
              return null;
            }
          })
        );
        setReadHiredPostTitles(hiredPostTitles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [userData.userID]);
  

  useEffect(() => {
    const hiredApplicant = readHired.find(data => data.status === "hire");
    if (hiredApplicant) {
      setHired(true);
      setTimeout(() => {
        axios.put(`http://localhost:4000/applicant/changehirestatus`, null, {
          params: { status: "hired", applicantid: hiredApplicant._id }
        })
          .then(() => 
            setIsPopupAlertVisible('Congratulations! You have been hired.') )
          .catch(error => {
            console.error("Error adding hired:", error);
            setIsPopupAlertVisible("Error adding hired");
          });
      }, confettiDuration);
    }
  }, [readData, confettiDuration]);

  useEffect(() => {
    setDataLen(readData.length);
    setHiredLen(readHired.length);
    setArrayIsEmpty(readData.length === 0);
    setHiredIsEmpty(readHired.length === 0);
  }, [readData, readHired]);

  const pieData = {
    labels: ["Waiting", "Application Opened", "Interview Set", "Hired"],
    datasets: [
      {
        label: "Application Status",
        data: [
          readData.filter(data => data.status === "waiting").length,
          readData.filter(data => data.status === "application opened").length,
          readData.filter(data => data.status === "Interview Set").length,
          readHired.length
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
      }
    ]
  };

  const totalApplications = readData.length + readHired.length;

  const getPercentage = (count) => ((count / totalApplications) * 100).toFixed(1);
  
  const wait = getPercentage(totalApplications);  // This will always be 100%
  const open = getPercentage(
    readData.filter(data => data.status === "application opened").length +
    readData.filter(data => data.status === "Interview Set").length +
    readHired.length
  );
  const interview = getPercentage(
    readData.filter(data => data.status === "Interview Set").length +
    readHired.length
  );
  const hire = getPercentage(readHired.length);

  return (
    <>
      <Frelancerprofile />
      <div className="wholeTask">
        <Confetti
          width={width}
          height={height}
          run={hired}
          numberOfPieces={400}
          confettiSource={{ x: 0, y: 100, w: width, h: 600 }}
        />
        <div className="main">
<section id="applications">
        {arrayIsEmpty ? (
          <div className="taskblock catagory">You have not applied to any job or task yet</div>
        ) : (
          <>
            <div className="taskblock catagory">You have {dataLen} current application{dataLen > 1 ? 's' : ''}</div>
            <div className="container">
              {readData.map((data, index) => (
                <div className="applylist catagory" key={data.postid}>
                  {readDataPostTitles[index] && (
                    <>
                    {readDataPostTitles[index] === "Closed Job" ? (
                     <>
                     <h3 style={{color:"red"}}> {readDataPostTitles[index]}</h3>
                     <br/>
                     </> 
                    ):(
                      <>
                                            <h3 className="textf">Job title</h3>
                                            <p className="titlef">{readDataPostTitles[index]}</p>
                      </>
                    )}

                    </>
                  )}
                  <h3 className="textf">Cover Letter</h3>
                  <p className="titlef">{data.Coverletter}</p>
                  <h3 className="textf">Status</h3>
                  <p className="titlef">{data.status}</p>
                </div>
              ))}
            </div>
          </>
        )}
</section>
<section id="hired">
        {hiredIsEmpty ? (
          <div className="taskblock catagory">You have not gotten any job in GudayHub</div>
        ) : (
          <>
            <div className="taskblock catagory">You have gotten {hiredLen} job{hiredLen > 1 ? 's' : ''} in GudayHub</div>
            <div className="container ">
              {readHired.map((data, index) => (
                <div className="applylist catagory" key={data.postid}>
                  {readHiredPostTitles[index] && (
                    <>
                          {readHiredPostTitles[index] === "Closed Job" ? (
                     <>
                     <h3 style={{color:"red"}}> {readDataPostTitles[index]}</h3>
                     <br/>
                     </> 
                    ):(
                      <>
                                            <h3 className="textf">Job title</h3>
                                            <p className="titlef">{readHiredPostTitles[index]}</p>
                      </>
                    )}
                    </>
                  )}
                  <h3 className="textf">Cover Letter</h3>
                  <p className="titlef">{data.Coverletter}</p>
                  <h3 className="textf">Status</h3>
                  <p className="titlef">{data.status}</p>
                </div>
              ))}
            </div>
          </>
        )}
        </section>
        
        <div className="bullet-section">
          <h2>Average Application Progress</h2>
  <div className="line"></div>
  <div className="list">
    <div className="itemList">
      <div className="percent">
        <p>{wait}% </p></div>
  <img
          src={`/image/wait.jpg`}
          alt="waiting"
        />
        </div>
        <div className="itemList">
        <div className="percent">
        <p>{open}% </p></div>
        <img
          src={`/image/open.jpg`}
          alt="opened"
        />
        </div>
        <div className="itemList">
        <div className="percent">
        <p>{interview}% </p></div>
        <img
          src={`/image/interview5.png`}
          alt="Profile"
        />
        </div>
        <div className="itemList">
        <div className="percent">
        <p>{hire}% </p></div>
        <img
          src={`/image/hire.jpg`}
          alt="hired"
        />
        </div>
        
  </div>
        </div>
        </div>
        <div className="sidetask">
        <section>
        <div style={{paddingTop:"6rem"}}>
          <div className="bubles app"><a href="#applications"><p>Applications: {readHired.length + readData.length}</p></a></div>
          <div className="bubles hire"><a href="#hired"><p>Hired: {readHired.length}</p></a></div>
          </div>
 <h4>Application Status </h4>
        <div className="report-section">
          <div></div>
          <Pie data={pieData} />
        </div>
        </section>
        </div>

      </div>

      {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}
    </>
  );
}
