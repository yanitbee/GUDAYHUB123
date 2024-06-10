import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../Hooks/UseAuth";
import { useLocation } from "react-router-dom";
import "./css/apply.css";

export default function Apply() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const location = useLocation();

  const { postid } = location.state || {};

  const [freelancerData, setfreelancerData] = useState([]);
  const [applied, setapplied] = useState("");
  const [file, setfile] = useState("");

  const uploadcv = (e) => {
    setfile(e.target.files[0]);
    console.log(file);
  };

  const alreadyapplied = () => {
    alert("You have already applied");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/freelancer/apply/${userData.userID}`
        );
        setfreelancerData(response.data);
      } catch (error) {
        console.error("freelacer error", error);
      }
    };
    fetchData();
  }, []);

  const [inputValue, setinputValue] = useState({
    Freelancerid: "",
    postid: "",
    Coverletter: "",
    status: "",
  });

  const saveData = async () => {
    try {
      editData(file);
      await axios.post("http://localhost:4000/applicant/writeapplicant", {
        Freelancerid: userData.userID,
        postid: readData._id,
        Coverletter: inputValue.Coverletter,
        status: "waiting",
      });
      console.log("data: ", inputValue);
      setPopup(!popup);
      alert("application sent");
      fetchData();
    } catch (error) {
      console.log("errorr", error);
    }
  };

  const fetchData = async () => {
    try {
      await axios
        .get("http://localhost:4000/applicant/searchapplied", {
          params: { postid: postid, freelancerid: userData.userID },
        })
        .then((response) => {
          const data = response.data;

          if (data.message === "have applied") {
            setapplied("applied");
          }
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postid, userData.userID]);

  function isFormDataEmpty(formData) {
    for (let pair of formData.entries()) {
      return false;
    }
    return true;
  }

  const editData = async (cv) => {
    const formData = new FormData();
    if (cv) {
      formData.append("cv", cv);
    }

    if (!isFormDataEmpty(formData)) {
      try {
        await axios.put(
          `http://localhost:4000/freelancer/edit/${userData.userID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (error) {
        console.error("errorr", error);
      }
    }
  };

  const [readData, setreadData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/post/searchpost/${postid}`
        );
        setreadData(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, []);

  const [popup, setPopup] = useState(false);

  const togglePopup = () => {
    setPopup(!popup);
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }
  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  return (
    <>
      <div>
        {readData && (
          <div>
            <h2> {readData.JobTask}</h2>
            <h2>Job Type: {readData.Jobtype}</h2>
            <p>Job Title: {readData.Jobtitle}</p>
            <p>Description: {readData.Description}</p>
            <p>Qualification: {readData.Qualification}</p>
            <p>Salary: {readData.Salary}</p>
            <p>location: {readData.location}</p>
            <p>Contact: {readData.Contact}</p>
            <p>PostedDate: {readData.PostedDate}</p>
            <p>Deadline: {readData.Deadline}</p>

            {applied === "applied" ? (
              <button className="apply-btn applied" onClick={alreadyapplied}>
                Apply Now
              </button>
            ) : (
              <button className="apply-btn" onClick={togglePopup}>
                Apply Now
              </button>
            )}

            <div className="wrapper">
              {popup && (
                <div className={`form`}>
                  <div className="form-content">
                    <h3 className="">
                      Application for {readData.Jobtitle} position
                    </h3>
                    Fullname
                    <input
                      className="input"
                      type="text"
                      placeholder={freelancerData.Fullname}
                    />
                    <br />
                    Phonenumber
                    <input
                      className="input"
                      type="text"
                      placeholder={freelancerData.Phonenumber}
                    />
                    <br />
                    Email
                    <input
                      className="input"
                      type="email"
                      placeholder={freelancerData.Email}
                    />{" "}
                    <br />
                    Address
                    <input
                      className="input"
                      type="text"
                      placeholder="Address"
                    />{" "}
                    <br />
                    Your cv
                    {freelancerData.freelancerprofile.cv ? (
                      <div className="">
                        <a
                          href={getProfilePicUrl(
                            freelancerData.freelancerprofile.cv
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`/image/cv.png`}
                            style={{ width: "5rem" }}
                          />
                        </a>
                      </div>
                    ) : null}
                    change CV
                    <input type="file" onChange={uploadcv} /> <br />
                    Cover Letter
                    <input
                      className="input"
                      type="text"
                      placeholder="coverletter"
                      value={inputValue.Coverletter}
                      onChange={(e) =>
                        setinputValue({
                          ...inputValue,
                          Coverletter: e.target.value,
                        })
                      }
                    />{" "}
                    <br />
                    <br /> <br />
                    <button className="popup-btn" onClick={saveData}>
                      Submit
                    </button>
                    <button className="popup-btn" id="x" onClick={togglePopup}>
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
