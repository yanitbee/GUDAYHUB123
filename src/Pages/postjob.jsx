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
      alert("application sent");
    } catch (error) {
      console.log("errorr", error);
    }
  };


  return (
    <div className="postimg">
      <div className="post">
        <h1 className="post-h1">Post</h1>
        <div>
          <input
            type="radio"
            name="JobTask"
            value="Task"
            onChange={(e) =>
              setinputValue({ ...inputValue, JobTask: e.target.value })
            }
          />{" "}
          Task
          <input
            type="radio"
            name="JobTask"
            value="Job"
            onChange={(e) =>
              setinputValue({ ...inputValue, JobTask: e.target.value })
            }
          />{" "}
          Job <br />
          <input
            className="post-input"
            placeholder="Jobtype"
            type="string"
            value={inputValue.Jobtype}
            onChange={(e) =>
              setinputValue({ ...inputValue, Jobtype: e.target.value })
            }
          />
        </div>
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
              setinputValue({ ...inputValue, Qualification: e.target.value })
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
          <input
            className="post-input"
            placeholder="Deadline"
            type="string"
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
    </div>
  );
}
