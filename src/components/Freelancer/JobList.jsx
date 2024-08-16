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
import { useTranslation } from "react-i18next";

export default function Joblist() {
  const [readData, setreadData] = useState([]);
  const [jobtype, setjobtype] = useState("");
  const [jobtitle, setjobtitle] = useState("");
  const [jobtask, setjobtask] = useState("");
  const [serach, setsearch] = useState("");
  const defalutjobtype = ["onsite", "remote", "hybrid"];
  const defalutjobtitle = ["Developer", "Deliver", "Cleaner","Pick Up"];
  const [searchicon, setsearchicon] = useState("");
  const [employerInfo, setEmployerInfo] = useState({});
  const { t } = useTranslation();
  const [popup, setPopup] = useState(false);
  const [deletedEmployers, setDeletedEmployers] = useState([]);
  

  const togglePopup = (employerId) => {
    setPopup((prevState) => ({
      ...prevState,
      [employerId]: !prevState[employerId],
    }));
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }

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

  const handlejobtitle = (title) => {
    setjobtitle(title);
    console.log(jobtitle);
  };

  const handlejobtitled = () => {
    setjobtitle("");
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
            params: { search: jobtype, serachtitle: `${serach}${jobtitle}`, filter: jobtask },
          }
        );
        const filteredData = response.data.filter(
          post => post.status && post.status !== "Closed"
        );
        

        const sortedData = filteredData.sort(
          (a, b) => new Date(b.PostedDate) - new Date(a.PostedDate)
        );
        setreadData(sortedData);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchData();
  }, [jobtype, serach, jobtask,jobtitle]);

  const fetchEmployerInfo = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/employer/serach/${id}`
      );
      setEmployerInfo((prevState) => ({ ...prevState, [id]: response.data }));
    } catch (error) {
      console.error("employer error", error);
    }
  };

  useEffect(() => {
    const updatedDeletedEmployers = Object.keys(employerInfo).filter(
      (id) => employerInfo[id].status === "deleted"
    );
    setDeletedEmployers(updatedDeletedEmployers);
  }, [employerInfo]);

  useEffect(() => {
    // Fetch employer info for all unique employer IDs in readData
    const employerIds = [...new Set(readData.map((data) => data.employerid))];
    employerIds.forEach((id) => fetchEmployerInfo(id));
  }, [readData]);

  let navigate = useNavigate();

  const handleclick = (postid) => {
    navigate("Apply", { state: { postid: postid } });
  };

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };
  let formattedDate;
  const convert = (data) => {
    const deadlineDate = new Date(data);

    formattedDate = deadlineDate.toISOString().split("T")[0];
  };

  return (
    <>
    
      <div className="alljoblist">
        {jobtask === "" ? (
          <>
            <div
              className=" allfilter"
              onClick={() => {
                handlejobtask("Job");
              }}
            >
              <FontAwesomeIcon className="delete" icon={faPlus} />
              {t("Job")}
            </div>
            <div
              className=" allfilter two"
              onClick={() => {
                handlejobtask("Task");
              }}
            >
              <FontAwesomeIcon className="delete" icon={faPlus} />
              {t("Task")}
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
                  {t("Job")}
                </div>
                <div className="allfilter two" onClick={handlejobtaskd}>
                  <FontAwesomeIcon className="delete" icon={faMinus} />
                  {t("Task")}
                </div>
              </>
            )}
            {jobtask === "Job" && (
              <>
                <div className="allfilter" onClick={handlejobtaskd}>
                  <FontAwesomeIcon className="delete" icon={faMinus} />
                  {t("Job")}
                </div>
                <div
                  className=" allfilter two"
                  onClick={() => {
                    handlejobtask("Task");
                  }}
                >
                  <FontAwesomeIcon className="delete" icon={faPlus} />
                  {t("Task")}
                </div>
              </>
            )}
          </>
        )}

        <div className="">
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
          <div className={`sidebar${searchicon} end-0`}>
            <FontAwesomeIcon
              className={`arrow start-0`}
              icon={faArrowRight}
              onClick={searchclickednot}
            />
            <br /> <br />
            <div style={{fontWeight:"bold",fontSize:"16px"}}>
              <div className="postsidelist">
              {t("Job Title")}
              </div>
               <br />
              {defalutjobtitle.map((type) => (
                  jobtitle === type ? (
                <>
                  <div className="skills" onClick={handlejobtitled}>
                    <FontAwesomeIcon className="delete" icon={faMinus} />
                    {type}
                  </div>
                </>) : (
                    <div className="skills" style={{color:"#b7fff2"}} onClick={() => {handlejobtitle(type)}}>
                    <FontAwesomeIcon className="delete" icon={faPlus} />
                    {type}
                  </div>
                )
              ))}
            </div>
       
            <div style={{fontWeight:"bold",fontSize:"16px"}}>
            <div className="postsidelist">
              {t("Job Type")}
              </div>
              <br />
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
                    <div style={{color:"#b7fff2"}}
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
            <div className="jobwhole">
              {readData.map((data) => (
                <>
                  <div
                    onClick={() => handleclick(data._id)}
                    className={`postblock box addcss ${data.urgency ? "urgent" : ""}`}
                    style={{ display: deletedEmployers.includes(data.employerid) ? 'none' : 'block' }}
                  >
                    <div class="ribbon-2">{data.JobTask}</div>

                    <div className="date">{format(data.PostedDate)} </div>
                    <div className="employerinfo">
                      {employerInfo[data.employerid] ? (
                        data.anonymous != true ? (
                          <div>
                            <div className="wrapper">
                              {popup[data._id] && (
                                <div className={`emppro `}>
                                  <div className="profile-content">
                                    <div className="pholder ">
                                      <img
                                        className="ppic"
                                        src={
                                          !employerInfo[data.employerid].freelancerprofile
                                            .profilepic
                                            ? `/image/profile.jpg`
                                            : getProfilePicUrl(
                                              employerInfo[data.employerid].freelancerprofile
                                                  .profilepic
                                              )
                                        }
                                        alt="Profile"
                                      />
                                    </div>
                                    <br />
                                    <br />
                                    {employerInfo[data.employerid].Fullname} <br />
                                    {employerInfo[data.employerid].title}
                                    {employerInfo[data.employerid].Email}
                                    <div className="typewhole">
                                      <p>Jobs posted:  {" "}
                                     {employerInfo[data.employerid].freelancerprofile.gudayhistory.jobs} </p>
                                    </div>
                                    <div className="typewhole">
                                      <p>Freelancers hired: {" "}
                                    {employerInfo[data.employerid].freelancerprofile.gudayhistory.hired} </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="empName" >

                            </div>
                            <div>
                              <img
                              onMouseOver={()=>togglePopup(data._id)} onMouseLeave={()=>togglePopup(data._id)}
                                className=" emp"
                                src={
                                  employerInfo[data.employerid]
                                    .freelancerprofile.profilepic === "" ||
                                  employerInfo[data.employerid]
                                    .freelancerprofile.profilepic === null
                                    ? `/image/profile.jpg`
                                    : getProfilePicUrl(
                                        employerInfo[data.employerid]
                                          .freelancerprofile.profilepic
                                      )
                                }
                                alt="Profile"
                              />

                              <p className="titles">
                                {
                                  employerInfo[data.employerid]
                                    .freelancerprofile.title
                                }
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>                  <div className="wrapper">
                          {popup[data._id] && (
                            <div className={`emppro `}>
                              <div className="profile-content">
                                <br/><br/>
                    <h3>Anonymous</h3>
                            <p> The employer has chosen to not show their profile  </p>    
                              </div>
                            </div>
                          )}
                        </div>

                          <img
                              onMouseOver={()=>togglePopup(data._id)} onMouseLeave={()=>togglePopup(data._id)}
                            className=" emp"
                            src={`/image/no user.png`}
                            alt="Profile"
                          />
                          </>
                        )
                      ) : (
                        <div>Loading...</div>
                      )}
                    </div>

                    <br />
                    <h3 className="text titlet">{data.Jobtitle}</h3>
                    {convert(data.Deadline)}
                    <div className="typewhole">
                      <p>Deadline: </p>
                      <p className=" titlet">{formattedDate}</p>
                    </div>

                    <div className="typewhole">
                      <img
                        className=" jobtype"
                        src={
                          data.Jobtype === "onsite"
                            ? `/image/onsite.png`
                            : data.Jobtype === "remote"
                            ? `/image/remotew.png`
                            : data.jobtype === "hibrid"
                            ? `/image/hybrid.png`
                            : `/image/hybrid.png`
                        }
                        alt="Profile"
                      />
                      <p className="">{data.Jobtype}</p>

                      <img
                        className=" location"
                        src={`/image/Location.png`}
                        alt="Profile"
                      />

                      <p className="">{data.location}</p>
                    </div>
                    <div className="typewhole">
                      <p className="s">{data.Salary}</p>

                      <img
                        className=" birr"
                        src={`/image/birr.png`}
                        alt="Profile"
                      />
                    </div>
                  </div>
                  <button
                    className="btn-job"
                    onClick={() => handleclick(data._id)}
                    style={{ display: deletedEmployers.includes(data.employerid) ? 'none' : 'block' }}
                  >
                    {t("More Information")}
                  </button>
                </>
              ))}
            </div>
          ) : (
            <div className="nojob">
              <img src={`/image/nojob.png`} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
