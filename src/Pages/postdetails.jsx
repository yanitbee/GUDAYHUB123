import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Popup from "../assets/popup";
import "./css/apply.css";
import EmployerProfile from "../components/employer/EmployerProfile";
import { format } from "timeago.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import AlertPopup from "../assets/AlertPopup";

export default function Postdetails() {
 
  const location = useLocation();

  const { postid } = location.state || {};

  const [readData, setreadData] = useState([]);
  const [show, setShowbox] = useState("");

  const [inputValue, setinputValue] = useState({
    JobTask: "",
    Jobtype: "",
    Jobtitle: "",
    Description: "",
    Qualification: "",
    Deadline: "",
    Salary: "",
    Contact: "",
    location: "",
    urgency: "",
    anonymous: "",
    cv: "",
    coverletter: "",
  });

  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };

  const handleAnonymousToggle = () => {
    setinputValue({ ...inputValue, anonymous: !inputValue.anonymous });
  };
  const handlecvToggle = () => {
    setinputValue({ ...inputValue, cv: !inputValue.cv });
  };
  const handlecoverToggle = () => {
    setinputValue({ ...inputValue, coverletter: !inputValue.coverletter });
  };
  const handleurgencyToggle = () => {
    setinputValue({ ...inputValue, urgency: !inputValue.urgency });
  };


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
  }, [postid]);




  const closejob = async (postId ) => {
    try {
      await axios.put(`http://localhost:4000/post/changestatus`, null, {
        params: { status: "Closed", postid: postId },
      });
 setIsPopupAlertVisible("Job closed successfully");
    } catch (error) {
      console.error("error", error);
      setIsPopupAlertVisible("An error occurred. Please try again later.");
    }
  };
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleShowPopup = () => {
    setIsPopupVisible(true);
  };

  const handleConfirm = (id) => {
    closejob(id);
    setIsPopupVisible(false);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
  };

  const handleEditPopup = ( jobTask) => {
if(jobTask === "Job"){
  setShowbox("Job")
  }else if(jobTask === "Task"){
    setShowbox("Task")
  }
}



const saveEdit = async (postid) => {
  const payload = {};

  if (inputValue.JobTask) payload.JobTask = inputValue.JobTask;
  if (inputValue.Jobtitle) payload.Jobtitle = inputValue.Jobtitle;
  if (inputValue.Jobtype) payload.Jobtype = inputValue.Jobtype;
  if (inputValue.Description) payload.Description = inputValue.Description;
  if (inputValue.Qualification) payload.Qualification = inputValue.Qualification;
  if (inputValue.Deadline) payload.Deadline = inputValue.Deadline;
  if (inputValue.Salary) payload.Salary = inputValue.Salary;
  if (inputValue.Contact) payload.Contact = inputValue.Contact;
  if (inputValue.location) payload.location = inputValue.location;
  if (inputValue.urgency) payload.urgency = inputValue.urgency;
  if (inputValue.anonymous) payload.anonymous = inputValue.anonymous;
  if (inputValue.cv) payload.cv = inputValue.cv;
  if (inputValue.coverletter) payload.coverletter = inputValue.coverletter;

  try {
    const response = await axios.put(
      `http://localhost:4000/post/edit/${postid}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    setShowbox("")
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setinputValue((prevState) => ({ ...prevState, [name]: value }));
};

  return (
    <>
       <EmployerProfile />
      <div className="applaywhole">
        {readData && (
          <div className={`${show !== "" ? "backdrop" : ""}`}>
             <h1 className="title">{readData.Jobtitle}</h1>
             <br />
             <div className=" row">
              <div className=" leftone col-5">
                <h2> {readData.JobTask}</h2>
                <h2>{readData.Jobtype}</h2>
                <div className="onebyone">
                  <h3>Description</h3>
                  <p>{readData.Description}</p>
                </div>

                <div className="oneby"></div>
                <h3>Qualification</h3>
                {readData.Qualification && (
                  <ul>
                    {readData.Qualification.split(",").map((item, index) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                  </ul>
                )}

                <p>Salary: {readData.Salary}</p>
                <p>Location: {readData.location}</p>
                <p>Contact: {readData.Contact}</p>
                <p>Posted Date: {format(readData.PostedDate)}</p>
                <p>Deadline: {readData.Deadline}</p>
              </div>

              <div className="sideline col-3">
           <h4>Requirements to apply</h4><br/>
                <div className="by"></div><br/>
                <div className="typewhole">
                <h5>CV:</h5>

                {readData.cv ? 
                <p style={{marginTop:".5rem", marginLeft:"1rem",color:"#830000"}}>Required</p>
              :<p style={{marginTop:".5rem", marginLeft:"1rem",color:"#1c8300"}}> Not Required</p>}
                </div>
                <div className="typewhole">
                <h5>Cover Letter:</h5>

                {readData.coverletter ? 
                <p style={{marginTop:".5rem", marginLeft:"1rem",color:"#830000"}}>Required</p>
              :<p style={{marginTop:".5rem", marginLeft:"1rem",color:"#1c8300"}}> Not Required</p>}
                </div>

                {readData.urgency ? 
                <p style={{marginTop:".5rem", marginLeft:"1rem",color:"#830000"}}>Urgent</p>
              :null}
              </div>

            </div>

            <button style={{display:"inline-block" , float:"left"}} className="apply-btn" onClick={handleShowPopup}>Close opening</button>

            <div className="editPost" onClick={() => {handleEditPopup(readData.JobTask)}}>
            <FontAwesomeIcon style={{height:"1.5rem"}}  icon={faPen} />
            </div>


<div className="editPop">

          {show && (
            <div className="postjob">
              {show === "Job" && (
                <div className="toggle-div end-0 rightpost">
                  <p>Is CV required to apply?</p>
                  <div className="toggle-button-cover ">
                    <div id="button-3" className="buttont r">
                      <input
                        className="checkboxt"
                        type="checkbox"
                        checked={inputValue.cv}
                        onChange={handlecvToggle}
                      />
                      <div className="knobs"></div>
                      <div className="layer"></div>
                    </div>
                  </div>
                  <p>Is cover letter required to apply?</p>
                  <div className="toggle-button-cover ">
                    <div id="button-3" className="buttont r">
                      <input
                        className="checkboxt"
                        type="checkbox"
                        checked={inputValue.coverletter}
                        onChange={handlecoverToggle}
                      />
                      <div className="knobs"></div>
                      <div className="layer"></div>
                    </div>
                  </div>
                </div>
              )}

              {show === "Job" || show === "Task" ? (
                <>
                  <div className="toggle-div end-0 both">
                    <p>Do you wish to be annonmous to freelancers?</p>
                    <div className="toggle-button-cover ">
                      <div id="button-3" className="buttont r">
                        <input
                          className="checkboxt"
                          type="checkbox"
                          checked={inputValue.anonymous}
                          onChange={handleAnonymousToggle}
                        />
                        <div className="knobs"></div>
                        <div className="layer"></div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="containert on "
                    onClick="this.classList.toggle('off'); this.classList.toggle('on')"
                  >
                    <div className="toggle">
                      <div className="detail"></div>
                      <div className="detail"></div>
                      <div className="detail"></div>
                    </div>
                  </div>
                  
<div className="p">
 
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
                  
                  </div>
                  
                </>
              ) : null}

              {show === "Task" && (
                <>
                <p>Urgency</p>
                  <div id="button-3" className="buttont r">
                    <input
                      className="checkboxt"
                      type="checkbox"
                      checked={inputValue.urgency}
                      onChange={handleurgencyToggle}
                    />
                    <div className="knobs"></div>
                    <div className="layer"></div>
                    
                  </div>
               
                </>
              )}

              <button className="btn-save" onClick={()=>{saveEdit(readData._id)}}>
                Edit
              </button>

              <button className="btn-save" onClick={()=>{setShowbox("")}}>
                X
              </button>
            </div>
          )}

</div>
          
          


            {isPopupVisible && (
        <Popup
          message="Do you really want to close this job post?"
          onConfirm={()=>{handleConfirm(readData._id)}}
          onCancel={handleCancel}
        />
      )}
   
   {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}
          </div>

        )}
      </div>



    </>
  );
}

function JobTypeSelector({ setinputValue }) {
  return (
    <div>
      <br />
      Job Type
      <div
        className="skills"
        onClick={() =>
          setinputValue((prevState) => ({ ...prevState, Jobtype: "onsite" }))
        }
      >
        onsite
      </div>
      <div
        className="skills"
        onClick={() =>
          setinputValue((prevState) => ({ ...prevState, Jobtype: "remote" }))
        }
      >
        remote
      </div>
      <div
        className="skills"
        onClick={() =>
          setinputValue((prevState) => ({ ...prevState, Jobtype: "hybrid" }))
        }
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
      <div >
        <label htmlFor="deadline"  >Deadline </label>
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
