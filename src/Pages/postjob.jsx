import { useState } from "react";
import axios from "axios";
import "./css/post.css";
import useAuth from "../Hooks/UseAuth";

export default function Write() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const [inputValue, setinputValue] = useState({
    JobTask: "",
    Jobtype: "",
    Jobtitle: "",
    Description: "",
    Qualification: "",
    PostedDate: "",
    Deadline: "",
    Salary: "",
    Contact: "",
    location: "",
    urgency: "",
  });
  const [show, setShow] = useState("");
  const [showbox, setShowbox] = useState("");

  const saveData = async () => {
    try {
      await axios.post("http://localhost:4000/post/writepost", {
        JobTask: inputValue.JobTask,
        Jobtype: inputValue.Jobtype,
        Jobtitle: inputValue.Jobtitle,
        Description: inputValue.Description,
        Qualification: inputValue.Qualification,
        PostedDate: inputValue.PostedDate,
        Deadline: inputValue.Deadline,
        Salary: inputValue.Salary,
        Contact: inputValue.Contact,
        location: inputValue.location,
        urgency: inputValue.urgency,
        employerid: userData.userID,
      });
      console.log("data: ", inputValue);
      alert("job/task posted");
    } catch (error) {
      console.log("errorr", error);
    }
  };

  const newpost = () => {
    setShowbox("post");
  };
  const handleJobTaskChange = (value) => {
    setinputValue({ ...inputValue, JobTask: value });
    if (value === "Job") {
      setShow("job");
      setShowbox("");
    } else {
      setShow("Task");
      setShowbox("");
    }
  };

  console.log(inputValue.Jobtype);
  return (
    <div className="postimg">
      <div className="post">
        <h1 className="post-h1">Post</h1>
        <br />
        <br />
        <button class="c-button" onClick={newpost}>
          <span class="c-main">
            <span class="c-ico">
              <span class="c-blur"></span> <span class="ico-text">+</span>
            </span>
            Post
          </span>
        </button>
        <div className={`post-div${showbox}`}>
          <div class="radiocontainer">
            <div class="radiobox">
              <div
                class="radioleft-side"
                onClick={() => {
                  handleJobTaskChange("Job");
                }}
              >
                <h3>Job</h3>
              </div>
              <div
                class="radioright-side"
                onClick={() => {
                  handleJobTaskChange("Task");
                }}
              >
                <h3>Task</h3>
              </div>
            </div>
          </div>
        </div>
        {show === "job" ? (
          <div>
            <div>
              <div>
                <br />
                Job Type
                <div
                  className="skills"
                  onClick={() =>
                    setinputValue({ ...inputValue, Jobtype: "onsite" })
                  }
                >
                  onsite{" "}
                </div>
                <div
                  className="skills"
                  onClick={() =>
                    setinputValue({ ...inputValue, Jobtype: "remote" })
                  }
                >
                  remote{" "}
                </div>
                <div
                  className="skills"
                  onClick={() =>
                    setinputValue({ ...inputValue, Jobtype: "hybrid" })
                  }
                >
                  hybrid{" "}
                </div>
              </div>
              <input
                className="post-input"
                placeholder="Jobtitle"
                type="string"
                value={inputValue.Jobtitle}
                onChange={(e) =>
                  setinputValue({ ...inputValue, Jobtitle: e.target.value })
                }
              />
            </div>
            <div>
              <input
                className="post-input"
                placeholder="Description"
                type="string"
                value={inputValue.Description}
                onChange={(e) =>
                  setinputValue({ ...inputValue, Description: e.target.value })
                }
              />
            </div>
            <div>
              <input
                className="post-input"
                placeholder="Qualification"
                type="string"
                value={inputValue.Qualification}
                onChange={(e) =>
                  setinputValue({
                    ...inputValue,
                    Qualification: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <input
                className="post-input"
                placeholder="PostedDate"
                type="string"
                value={inputValue.PostedDate}
                onChange={(e) =>
                  setinputValue({ ...inputValue, PostedDate: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="interviewDate">Deadline</label>
              <input
                className="post-input"
                type="date"
                id="interviewDatei"
                value={inputValue.Deadline}
                onChange={(e) =>
                  setinputValue({ ...inputValue, Deadline: e.target.value })
                }
              />
            </div>
            <div>
              <input
                className="post-input"
                placeholder="Salary"
                type="string"
                value={inputValue.Salary}
                onChange={(e) =>
                  setinputValue({ ...inputValue, Salary: e.target.value })
                }
              />
              <div>
                <input
                  className="post-input"
                  placeholder="Contact"
                  type="string"
                  value={inputValue.Contact}
                  onChange={(e) =>
                    setinputValue({ ...inputValue, Contact: e.target.value })
                  }
                />
              </div>
              <div>
                <input
                  className="post-input"
                  placeholder="location"
                  type="string"
                  value={inputValue.location}
                  onChange={(e) =>
                    setinputValue({ ...inputValue, location: e.target.value })
                  }
                />
              </div>
              <div>
                <input
                  className="post-input"
                  placeholder="urgency"
                  type="string"
                  value={inputValue.urgency}
                  onChange={(e) =>
                    setinputValue({ ...inputValue, urgency: e.target.value })
                  }
                />
              </div>
              <button className="btn-save" onClick={saveData}>
                Post
              </button>
            </div>
          </div>
        ) : null}

        {show === "Task" ? (
          <div>
            <input
              className="post-input"
              placeholder="Jobtype"
              type="string"
              value={inputValue.Jobtype}
              onChange={(e) =>
                setinputValue({ ...inputValue, Jobtype: e.target.value })
              }
            />
            <div>
              <input
                className="post-input"
                placeholder="Jobtitle"
                type="string"
                value={inputValue.Jobtitle}
                onChange={(e) =>
                  setinputValue({ ...inputValue, Jobtitle: e.target.value })
                }
              />
            </div>
            <div>
              <input
                className="post-input"
                placeholder="Description"
                type="string"
                value={inputValue.Description}
                onChange={(e) =>
                  setinputValue({ ...inputValue, Description: e.target.value })
                }
              />
            </div>
            <div>
              <input
                className="post-input"
                placeholder="Qualification"
                type="string"
                value={inputValue.Qualification}
                onChange={(e) =>
                  setinputValue({
                    ...inputValue,
                    Qualification: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <input
                className="post-input"
                placeholder="PostedDate"
                type="string"
                value={inputValue.PostedDate}
                onChange={(e) =>
                  setinputValue({ ...inputValue, PostedDate: e.target.value })
                }
              />
            </div>
            <button className="btn-save" onClick={saveData}>
              Post
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
