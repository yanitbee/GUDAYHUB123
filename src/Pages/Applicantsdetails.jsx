import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import EmployerProfile from "../components/employer/EmployerProfile";

export default function Applicantsdetails() {
  const [readData, setreadData] = useState([]);
  const [readhired, setreadhired] = useState([]);
  const [readapplicant, setreadapplicant] = useState([]);
  const [readhiredapplicant, sethiredapplicant] = useState([]);
  const [freelancerData, setfreelancerData] = useState([]);
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [hiredIsEmpty, sethiredIsEmpty] = useState(false);
  const [DataLen, setDataLen] = useState("");
  const [hiredLen, sethiredLen] = useState("");
  const [pieData, setPieData] = useState(null);

  const location = useLocation();
  const { postid } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicantResponse = await axios.get(
          "http://localhost:4000/applicant/readjobapplicant",
          { params: { postid } }
        );
        const freelancerIds = applicantResponse.data.map(applicant => applicant.Freelancerid);

        const freelancerResponses = await Promise.all(
          freelancerIds.map(id =>
            axios.get(`http://localhost:4000/freelancer/apply/${id}`)
          )
        );

        const applicantNames = freelancerResponses.map(response =>
          response.data.status !== undefined && response.data.status !== "deleted"
            ? response.data.Fullname
            : "Account deleted"
        );

        const hiredResponse = await axios.get(
          "http://localhost:4000/hired/readhired",
          { params: { postid } }
        );
        const hiredids = hiredResponse.data.map(Hired => Hired.Freelancerid);

        const hireResponses = await Promise.all(
          hiredids.map(id =>
            axios.get(`http://localhost:4000/freelancer/apply/${id}`)
          )
        );

        const hiredNames = hireResponses.map(response =>
          response.data.status !== undefined && response.data.status !== "deleted"
            ? response.data.Fullname
            : "Account deleted"
        );

        setreadData(applicantResponse.data);
        setreadapplicant(applicantNames);
        setreadhired(hiredResponse.data);
        sethiredapplicant(hiredNames);

        // Generate pie data based on application status
        const statusCounts = applicantResponse.data.reduce((acc, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {});

        setPieData({
          labels: Object.keys(statusCounts),
          datasets: [
            {
              data: Object.values(statusCounts),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40"
              ]
            }
          ]
        });
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchData();
  }, [postid]);

  const changestatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/applicant/changestatus`, null, {
        params: { status: status, applicantid: id }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const navigate = useNavigate();
  const handleclick = (id, userid, staus) => {
    if (staus === "waiting") {
      changestatus(id, "application opened")
      navigate("/employerpage/Applicantsdetails/more/Hire", { state: { userid: userid, applicaionid: id, postid: "not" } })
    } else if (staus === "hired" || staus === "got the job" || staus === "hire") {
      navigate("/employerpage/Applicantsdetails/more/Hire", { state: { userid: userid, applicaionid: id, check: "hired" } })
    } else navigate("/employerpage/Applicantsdetails/more/Hire", { state: { userid: userid, applicaionid: id, check: "not" } })
  }

  const isEmpty = (arr, type) => {
    const isEmptyArray = arr.length === 0;
    if (!isEmptyArray && type === "hired") {
      sethiredLen(arr.length);
    } else if (!isEmptyArray && type === "data") {
      setDataLen(arr.length);
    }
    return isEmptyArray;
  };

  useEffect(() => {
    const emptyCheck = isEmpty(readData, "data");
    if (readhired) {
      const emptyCheck2 = isEmpty(readhired, "hired");
      sethiredIsEmpty(emptyCheck2);
    }
    setArrayIsEmpty(emptyCheck);
  }, [readData, readhired]);

  const formattedDate = (data) => {
    const deadlineDate = new Date(data);
    return deadlineDate.toISOString().split("T")[0];
  };

  return (
    <>
      <EmployerProfile />

      <div className="wholeTask">
        <section id="applications">
          {arrayIsEmpty ? (
            <div className="taskblock catagory">There is no applicant yet</div>
          ) : (
            <>
              <div className="taskblock catagory">You have {DataLen} applicants</div>
              <div className="container">
                {readData.map((data, index) => (
                  <div onClick={() => handleclick(data._id, data.Freelancerid, data.status)} className="applylist catagory" >
                    {readapplicant[index] && (
                      <>
                        {readapplicant[index] !== "Account deleted" ? (
                          <>
                            <h3 className="textf">Applicant name</h3>
                            <p className="titlef">{readapplicant[index]}</p>
                          </>
                        ) : (
                          <h4 style={{ padding: "1rem", color: "red" }} className="titlef">{readapplicant[index]}</h4>
                        )
                        }
                      </>
                    )}
                    <h3 className="textf">Cover Letter </h3>
                    <p className="titlef">{data.Coverletter ? data.Coverletter : "No cover letter"}</p>
                    <h3 className="textf">Applied Date </h3>
                    <p className="titlef">{formattedDate(data.appliedDate)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section id="hired">
          {hiredIsEmpty ? (
            <div className="taskblock catagory">You have not hired any applicants</div>
          ) : (
            <>
              <div className="taskblock catagory">You have hired {hiredLen} applicants for this job</div>
              <div className="container">
                {readhired.map((data, index) => (
                  <div onClick={() => handleclick(data._id, data.Freelancerid, data.status)} className="applylist catagory" >
                    {readhiredapplicant[index] && (
                      <>
                        {readhiredapplicant[index] !== "Account deleted" ? (
                          <>
                            <h3 className="textf">Applicant name</h3>
                            <p className="titlef">{readhiredapplicant[index]}</p>
                          </>
                        ) : (
                          <h4 style={{ padding: "2rem", color: "red" }} className="titlef">{readhiredapplicant[index]}</h4>
                        )
                        }
                      </>
                    )}
                    <h3 className="textf">Job type </h3>
                    <p className="titlef">{data.Jobtype}</p>
                    <h3 className="textf">Cover Letter </h3>
                    <p className="titlef">{data.Coverletter}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="sidetask">
          <section>
            <br/><br/><br/><br/>
          <div className="bubles app"><a href="#applications"><p>Applications: {}</p></a></div>
          <div className="bubles hire"><a href="#hired"><p>Hired: {}</p></a></div>

            <h4>Application Status </h4>
            <div className="report-section">
              <div></div>
              {pieData && <Pie data={pieData} />}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

