import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faMinus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "timeago.js";
import "./css/joblist.css";

export default function Joblist() {
  const [readData, setreadData] = useState([]);
  const [jobtype, setjobtype] = useState("");
  const [jobtask, setjobtask] = useState("");
  const [serach, setsearch] = useState("");
  let defalutjobtype = ["onsite", "remote", "hybrid"];
  const [searchicon, setsearchicon] = useState("");

  const searchclicked = () => {
    setsearchicon("active");
  };
  const searchclickednot = () => {
    setsearchicon("");
  };

  const handlejobtype = (type) => {
    setjobtype(type);
    console.log(jobtype);
  };
  const handlejobtyped = () => {
    setjobtype("");
  };

  const handlejobtask = (type) => {
    setjobtask(type);
    console.log(jobtype);
  };
  
  const handlejobtaskd = () => {
    setjobtask("");
  };

  const handelsearch = (e) => {
    setsearch(e.target.value);
  };

  const isempty = (arr) => {
    if (arr.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/post/readpost",
          {
            params: { search: jobtype, serachtitle: serach, filter: jobtask },
          }
        );

        const sortedData = response.data.sort(
          (a, b) => new Date(b.PostedDate) - new Date(a.PostedDate)
        );
        setreadData(sortedData);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [jobtype, serach,jobtask]);

  let navigate = useNavigate();

  const handleclick = (postid) => {
    navigate("Apply", { state: { postid: postid } });
  };


  return (
    <>
      {jobtask === "" ? (
        <>
          <div
          className=" allfilter"
          onClick={() => {
            handlejobtask("Job");
          }}
        >
          <FontAwesomeIcon className="delete" icon={faPlus} />
          Job
        </div>
        <div
        className=" allfilter two"
        onClick={() => {
          handlejobtask("Task");
        }}
      >
        <FontAwesomeIcon className="delete" icon={faPlus} />
        Task
      </div>
</>
      ) : (
        <>
        {jobtask === "Task" && (
          <>
          
          <div
          className=" allfilter"
          onClick={() => {
            handlejobtask("Job");
          }}
        >
          <FontAwesomeIcon className="delete" icon={faPlus} />
          Job
        </div>
          <div
            className="allfilter two"
            onClick={handlejobtaskd}
          >
            <FontAwesomeIcon className="delete" icon={faMinus} />
            Task
          </div>
          </>
        )}
        {jobtask === "Job" && (
          <>
          <div
            className="allfilter"
            onClick={handlejobtaskd}
          >
            <FontAwesomeIcon className="delete" icon={faMinus} />
            Job
          </div>
                 <div
                 className=" allfilter two"
                 onClick={() => {
                   handlejobtask("Task");
                 }}
               >
                 <FontAwesomeIcon className="delete" icon={faPlus} />
                 Task
               </div>
               </>
        )}
      </>
      )}



      <div className="jobparent">
        <div className={`serachparent`}>
          <FontAwesomeIcon
            className={`search s${searchicon} end-0`}
            icon={faSearch}
          />
          <input
            className={`another  end-0`}
            type="text"
            placeholder="Search Job"
            onChange={handelsearch}
            onClick={searchclicked}
          />
        </div>
        <div class={`sidebar${searchicon} end-0`}>
          <FontAwesomeIcon
            className={`arrow start-0`}
            icon={faArrowRight}
            onClick={searchclickednot}
          />
          <br /> <br />
          <div className="type">
            Job Title <br />
            {defalutjobtype.map((type) => (
              <>
                <div className="skills">
                  <FontAwesomeIcon className="delete" icon={faPlus} />
                  {type}
                </div>
              </>
            ))}
          </div>
          <br />
          <div className="type">
            Job Type <br />
            {defalutjobtype.map((type) =>
              jobtype === type ? (
                <>
                  <div className="skills" onClick={handlejobtyped}>
                    <FontAwesomeIcon className="delete" icon={faMinus} />
                    {type}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="skills"
                    onClick={() => {
                      handlejobtype(type);
                    }}
                  >
                    <FontAwesomeIcon className="delete" icon={faPlus} />
                    {type}
                  </div>
                </>
              )
            )}
          </div>
        </div>

        {isempty(readData) ? (
          <div>
            {readData.map((data) => (
              <>
                <div
                  onClick={() => handleclick(data._id)}
                  className={`postblock box ${data.urgency ? "urgent" : ""}`}
                >
                  <div class="ribbon-2">{data.JobTask}</div>

                  <div className="date">{format(data.PostedDate)} </div>

                  <div>
                    <h3 className="text">Job Type </h3>
                    <p className="title">{data.Jobtype}</p>
                  </div>
                  <h3 className="text">Job Title </h3>
                  <p className="title">{data.Jobtitle}</p>
                  <h3 className="text">Location </h3>
                  <p className="title">{data.location}</p>
                </div>
                <button className="btn-job">More Information</button>
              </>
            ))}
          </div>
        ) : (
          <div className="nojob">
            <img src={`/image/nojob.png`} />
          </div>
        )}
      </div>
    </>
  );
}
