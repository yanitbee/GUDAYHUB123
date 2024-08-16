import { useState, useEffect } from "react";
import axios from "axios";
import "./css/post.css";
import useAuth from "../Hooks/UseAuth";
import AlertPopup from "../assets/AlertPopup";
import Popup from "../assets/popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import EmployerProfile from "../components/employer/EmployerProfile";
import { useNavigate } from "react-router-dom";

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
    anonymous: false,
    cv: false,
    coverletter: false,
  });

  const [readData, setreadData] = useState([]);
  const [readActiveData, setreadActiveData] = useState([]);
  const [readOfferData, setreadOfferData] = useState([]);
  const [show, setShow] = useState("");
  const [showbox, setShowbox] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  const [arrayIsEmpty, setArrayIsEmpty] = useState(false);
  const [ActivearrayIsEmpty, setActiveArrayIsEmpty] = useState(false);
  const [OfferarrayIsEmpty, setOfferArrayIsEmpty] = useState(false);
  const [DataLen, setDataLen] = useState("");
  const [ActiveDataLen, setActiveDataLen] = useState("");
  const [OfferDataLen, setOfferDataLen] = useState("");

  const [isPopupVisible, setIsPopupVisible] = useState("");
  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const navigate = useNavigate();

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };
  const handleCancel = () => {
    setIsPopupVisible("");
    setPostIdToDelete(null);
  };


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
      time: formattedTime,
    });
  }, []);

  const combinedDateTime = `${currentDateTime.date} ${currentDateTime.time}`;

  const saveData = async () => {
    try {
      const response = await axios.post("http://localhost:4000/post/writepost", {
        ...inputValue,
        PostedDate: combinedDateTime,
        employerid: userData.userID,
      });
  
    
      setIsPopupAlertVisible(response.data.message);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errorMessages = error.response.data.errors
          .map(err => err.msg) 
          .join("\n"); 
          setIsPopupAlertVisible(errorMessages);
      } else {
        // Fallback for other errors
        setIsPopupAlertVisible("An error occurred while posting the job/task.");
      }
      console.log("Error:", error);
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get("http://localhost:4000/PostHistory/reademployerpost", {
            params: { employerid: userData.userID },
          })
          .then((Post) => setreadData(Post.data));
      } catch (error) {
        console.error("error", error);
      }
    };

    const fetchActiveData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/post/reademployerpost", {
          params: { employerid: userData.userID },
        });

        const activeData = response.data
          .filter(post => !post.status || post.status === "Active")
          .sort((a, b) => new Date(b.PostedDate) - new Date(a.PostedDate));
    
        const closedData = response.data
          .filter(post => post.status === "Closed")
          .sort((a, b) => new Date(b.PostedDate) - new Date(a.PostedDate));
 
        setreadActiveData(activeData);
        setreadData(closedData);
        
      } catch (error) {
        console.error("error", error);
      }
    };
    

    const fetchOfferData = async () => {
      try {
        await axios
          .get("http://localhost:4000/Offer/reademployerOffer", {
            params: { employerid: userData.userID },
          })
          .then((Offer) => setreadOfferData(Offer.data));
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchOfferData()
    fetchActiveData()
    fetchData();
  }, [userData.userID]);

  const handleJobTaskChange = (value) => {
    setinputValue((prevState) => ({ ...prevState, JobTask: value }));
    setShow(value);
    setShowbox("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setinputValue((prevState) => ({ ...prevState, [name]: value }));
  };

  const isEmpty = (arr, type) => {

    const isEmptyArray = arr.length === 0;
    if (!isEmptyArray && type==="closed") {
      setDataLen(arr.length);
    }
    if (!isEmptyArray && type==="active") {
      setActiveDataLen(arr.length);
    }
    if (!isEmptyArray && type==="offer") {
      setOfferDataLen(arr.length);
    }
    return isEmptyArray;
  };


  useEffect(() => {
    const emptyCheck = isEmpty(readData,"closed");
    setArrayIsEmpty(emptyCheck);

    const emptyActiveCheck = isEmpty(readActiveData,"active");
    setActiveArrayIsEmpty(emptyActiveCheck);

    const emptyOfferCheck = isEmpty(readOfferData,"offer");
    setOfferArrayIsEmpty(emptyOfferCheck);
  }, [readData, readActiveData,readOfferData]);

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

  const handleDeleteConfirm = (postId) =>{
    setIsPopupVisible("Are you sure you want to Delete the job post?")
    setPostIdToDelete(postId); 
  }

  const handleDelete = async () => {
    try {
      await axios.put(`http://localhost:4000/post/changestatus`, null, {
        params: { status: "Deleted", postid: postIdToDelete },
      });
 setIsPopupAlertVisible("Job deleted successfully");
    } catch (error) {
      console.error("error", error);
      setIsPopupAlertVisible("An error occurred. Please try again later.");
    }

    /*try {
      const response = await axios.delete(`http://localhost:4000/PostHistory/deletepost/${postIdToDelete}`);

      console.log(response.data);
      setIsPopupAlertVisible("post deleted")
      setreadData(readData.filter((post) => post._id !== postIdToDelete));
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }*/
  };
  const handlepost = (postid) => {
    navigate("/employerpage/Applicantsdetails/postdetails", { state: { postid: postid } });
  };
  
  
  return (
    <>
       <EmployerProfile />
    <div className="wholePost">
    <div className="mainpost">
      <section id="Addpost" >
      <div className="postimg">
        <div className="post">
          <h1 className="post-h1"></h1>
          <br />
          <br />
          <button className="c-button" onClick={() => setShowbox("post")}>
            <span className="c-main">
              <span className="c-ico">
                <span className="c-blur"></span>{" "}
                <span className="ico-text">+</span>
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

              <button className="btn-save" onClick={saveData}>
                Post
              </button>

              <button className="btn-save" onClick={()=>{setShow("")}}>
                X
              </button>
            </div>
          )}
          
        </div>
      </div>
      </section>
      <section id="AllPost">
      <div className="postHistory">

      {arrayIsEmpty &&  ActivearrayIsEmpty ? (
        <div className="taskblock catagory">You have not posted any job or task yet</div>
      ) : (
        <div>
          <div className="taskblock catagory">You had posted {DataLen + ActiveDataLen} job </div>
          <section id="ClosedPost">
{!arrayIsEmpty &&
<div className="ActiveClosed">Closed</div>}
          {readData.map((data) => (
            <>
              <div className="applylist catagory">
                <div>
                  <h3 className="textf">Job title </h3>
                  <p className="titlef">{data.Jobtitle}</p>
                </div>
                <h3 className="textf">Job type </h3>
                <p className="titlef">{data.Jobtype}</p>
                <h3 className="textf">Description </h3>
                <p className="titlef">{data.Description}</p>
              </div>
              <button
                className="btn-job1 more"
                onClick={() => handleDeleteConfirm(data._id)}
              >
                 Delete Post 
              </button>

              <button
                className="btn-job1 more"
                onClick={() => handlepost(data._id)}
              >
                Post details
              </button>
            </>
          ))}
          </section>
          <section id="ActivePost">

{!ActivearrayIsEmpty && <div className="ActiveClosed">Active</div>}

                    {readActiveData.map((data) => (
          <>
          
          <div>
         <div className="applylist catagory" >
             <div>
             <h3 className="textf">Job title </h3>
          <p className="titlef">{data.Jobtitle}</p>
          </div>
             <h3 className="textf">Job type </h3>
          <p className="titlef">{data.Jobtype}</p>
          <h3 className="textf">Description </h3>
          <p className="titlef">{data.Description}</p>
            </div>
            </div>
            <button className="btn-job1 more" onClick={() => handlepost(data._id)}>
            Post details</button>
            <button
                className="btn-job1 more"
                onClick={() => handleDeleteConfirm(data._id)}
              >
                 Delete Post 
              </button>
          </>
         ))}
         </section>
        </div>
      )}
    
      </div>
      <section id="Offer">
<div className="Offersec">
<div className="offerLayer"></div>
{OfferarrayIsEmpty? (
        <div className="taskblock catagory offerbock">You have not made any offer yet</div>
      ) : (
        <div>
          <div className="taskblock catagory offerbock">You had made {OfferDataLen} offers </div> 
      {readOfferData.map((data) => (
            <div key={data._id} >
              <div className="postblock box offerPost">
                <div className="ribbon-2">{data.status}</div>
                <h3 className="textf">Description</h3>
                <p className="titlef">{data.Description}</p>
                <h3 className="textf">Price</h3>
                <p className="titlef">{data.price}</p>
                {data.status ==="rejected" && (
                  <>
                <h3 className="textf">Reason</h3>
                <p className="titlef">{data.message}</p>
                </>)}
              </div>
            </div>
          ))}      
</div>
)}
</div>
</section>
      </section>
      </div>
      <div className="sidePost">
        <section>
        <ul className="postui">
  <li >
  <a href="#Addpost" className="activea"
	>
    <div className="postsidelist">
    <FontAwesomeIcon  icon={faBars} />
	   {" "}Add Post
    </div>
    <div className="bublesPost app"
    style={{backgroundColor:" #1d5c48da"}}><a href="#applications"><p>Task</p></a></div>
    <div className="bublesPost hire"
    style={{backgroundColor:" #1f1d5cda"}}><a href="#hired"><p>Job</p></a></div>
	</a>
  </li>

  <li >
  <a href="#AllPost">
  <div className="postsidelist">
  <FontAwesomeIcon  icon={faBars} />
  {" "}
	  All Post
    </div>
    <div className="bublesPost app"
    style={{backgroundColor:" #815a23da"}}><a href="#ActivePost"><p>Active</p></a></div>
    <div className="bublesPost hire"
     style={{backgroundColor:" #5c1d4dda"}}><a href="#ClosedPost"><p>Closed</p></a></div>
	</a>
  </li>

  <li >
	<a href="#Offer">
  <div className="postsidelist">
  <FontAwesomeIcon  icon={faBars} />
  {" "}
	  All Offer
    </div>
    <div className="bublesPost app"
     style={{backgroundColor:" #6c6c19da"}}><a href="#applications"><p>Waiting</p></a></div>
    <div className="bublesPost app"
     style={{backgroundColor:" #1d355cda"}}><a href="#applications"><p>Accepted</p></a></div>
    <div className="bublesPost hire"
     style={{backgroundColor:" #761f1fda"}}><a href="#hired"><p>Rejected</p></a></div>
	</a>
  </li>

</ul>
        </section>
        </div>
      </div>
      {isPopupVisible != "" && (
        <Popup
          message = {isPopupVisible}
          onConfirm={handleDelete}
          onCancel={handleCancel}
        />
      )}

      {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}
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


