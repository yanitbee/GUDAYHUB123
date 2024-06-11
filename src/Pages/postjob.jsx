import { useState, useEffect } from "react";
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
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: ""
  });

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    setCurrentDateTime({
      date: formattedDate,
      time: formattedTime
    });
  }, []);

  const combinedDateTime = `${currentDateTime.date} ${currentDateTime.time}`;

  const saveData = async () => {
    try {
      await axios.post("http://localhost:4000/post/writepost", {
        ...inputValue,
        PostedDate: combinedDateTime,
        employerid: userData.userID,
      });
      console.log("data: ", inputValue);
      alert("job/task posted");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleJobTaskChange = (value) => {
    setinputValue((prevState) => ({ ...prevState, JobTask: value }));
    setShow(value);
    setShowbox("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setinputValue((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="postimg">
      <div className="post">
        <h1 className="post-h1">Post</h1>
        <br />
        <br />
        <button className="c-button" onClick={() => setShowbox("post")}>
          <span className="c-main">
            <span className="c-ico">
              <span className="c-blur"></span> <span className="ico-text">+</span>
            </span>
            Post
          </span>
        </button>
        <div className={`post-div${showbox}`}>
          <div className="radiocontainer">
            <div className="radiobox">
              <div
                className="radioleft-side"
                onClick={() => handleJobTaskChange("Job")}
              >
                <h3>Job</h3>
              </div>
              <div
                className="radioright-side"
                onClick={() => handleJobTaskChange("Task")}
              >
                <h3>Task</h3>
              </div>
            </div>
          </div>
        </div>

        {show && (
          <div>
            {show === "Job" || show === "Task" ? (
              <>
                <JobTypeSelector setinputValue={setinputValue} />
                <InputField
                  name="Jobtitle"
                  placeholder="Job Title"
                  value={inputValue.Jobtitle}
                  onChange={handleInputChange}
                />
                <InputField
                  name="Description"
                  placeholder="Description"
                  value={inputValue.Description}
                  onChange={handleInputChange}
                />
                <InputField
                  name="Qualification"
                  placeholder="Qualification"
                  value={inputValue.Qualification}
                  onChange={handleInputChange}
                />
                <DeadlineField
                  value={inputValue.Deadline}
                  onChange={handleInputChange}
                />
                      <InputField
                  name="location"
                  placeholder="location"
                  value={inputValue.location}
                  onChange={handleInputChange}
                />
                  <InputField
                  name="Contact"
                  placeholder="Contact"
                  value={inputValue.Contact}
                  onChange={handleInputChange}
                />
                     <InputField
                  name="Salary"
                  placeholder="Salary"
                  value={inputValue.Salary}
                  onChange={handleInputChange}
                />
                 
              </>
            ) : null}

            {show === "Task" && (
              <>
             
                <InputField
                  name="urgency"
                  placeholder="Urgency"
                  value={inputValue.urgency}
                  onChange={handleInputChange}
                />
              </>
            )}

            <button className="btn-save" onClick={saveData}>
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function JobTypeSelector({ setinputValue }) {
  return (
    <div>
      <br />
      Job Type
      <div
        className="skills"
        onClick={() => setinputValue((prevState) => ({ ...prevState, Jobtype: "onsite" }))}
      >
        onsite
      </div>
      <div
        className="skills"
        onClick={() => setinputValue((prevState) => ({ ...prevState, Jobtype: "remote" }))}
      >
        remote
      </div>
      <div
        className="skills"
        onClick={() => setinputValue((prevState) => ({ ...prevState, Jobtype: "hybrid" }))}
      >
        hybrid
      </div>
    </div>
  );
}

function InputField({ name, placeholder, value, onChange }) {
  return (
    <div>
    <input
      className="post-input"
      placeholder={placeholder}
      type="string"
      name={name}
      value={value}
      onChange={onChange}
    />
    </div>
  );
}

function DeadlineField({ value, onChange }) {
  return (
    <div>
      <label htmlFor="deadline">Deadline</label>
      <input
        className="post-input"
        type="date"
        id="deadline"
        name="Deadline"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
