import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Freelancer/css/addprofile.css";
import useAuth from "../../Hooks/UseAuth";
import Editprofile from "./profilEdit";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faQuestionCircle, faCommentDots,faWandSparkles,faQuoteLeft,faPenAlt } from "@fortawesome/free-solid-svg-icons";

export default function EmployerProfile() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [employerData, setEmployerData] = useState({
    Usertype: null,
    username: null,
    Fullname: null,
    Phonenumber: null,
    Email: null,
    Gender: null,
    freelancerprofile: {
      profilepic: null,
    },
  });
  const [popup, setPopup] = useState(false);
  const [ShowAddProfile, setShowAddProfile] = useState(false);

  const handleImage = () => {
    inputRef.current.click();
  };

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await editPic(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/employer/readprofile/${userData.userID}`
        );
        setEmployerData(response.data);
        setInputValue({
          fullname: response.data.fullname || "",
          email: response.data.email || "",
          phonenumber: response.data.phonenumber || "",
          gender: response.data.gender || "",
          title: response.data.title || "",
        });
      } catch (error) {
        console.error("Employer error", error);
      }
    };
    fetchData();
  }, [userData.userID]);

  const editPic = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.put(
        `http://localhost:4000/employer/picedit/${userData.userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error uploading picture", error);
    }
  };

  const editData = async () => {
    try {
      await axios.put(
        `http://localhost:4000/employer/edit/${userData.userID}`,
        {
          fullname: inputValue.fullname,
          email: inputValue.email,
          phonenumber: inputValue.phonenumber,
          gender: inputValue.gender,
          title: inputValue.title,
        }
      );
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

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

  const handleClick = () => {
    navigate("/Interview");
  };

  const addpro = () => {
    setShowAddProfile(!ShowAddProfile);
    setPopup(!popup);
  };

  const handleComplaintClick = () => {
    navigate("/Complaint");
  };
  const handleTestimonyClick = () => {
    navigate("/Testimony");
  };

  return (
    <>
      <div>
        {ShowAddProfile && <Editprofile prop={employerData} prop2={addpro} />}
      </div>
      <div></div>
      <div className="holder start-0 interviewlogo">
        <img
          onClick={handleClick}
          className="profilepic "
          src={`/image/interview5.png`}
          alt="Profile"
        />
      </div>

      <div className="holder start-0">
        
        <img
          onClick={togglePopup}
          className="profilepic"
          src={
            !employerData.freelancerprofile.profilepic
              ? `/image/profile.jpg`
              : getProfilePicUrl(employerData.freelancerprofile.profilepic)
          }
          alt="Profile"
        />
      </div>
      <div className="wrapper">
        {popup && (
          <div className={`profilebox morepro `}>
            <div className="profile-content">
            <div className="upperpro">
              <div className="pholder " onClick={handleImage}>
                <img
                  className="ppic"
                  src={
                    !employerData.freelancerprofile.profilepic
                      ? `/image/profile.jpg`
                      : getProfilePicUrl(
                          employerData.freelancerprofile.profilepic
                        )
                  }
                  alt="Profile"
                />

                <input
                  onChange={uploadImg}
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                />
              </div>
              <br />
              <div className="infopro">
              {employerData.Fullname} <br />
              {employerData.Email}
              </div>
              </div>
 
              <div
                  className=" complaint"
                  onClick={addpro} >
                   <FontAwesomeIcon
                      icon={faPenAlt }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
              <p  style={{display:"inline"}}>Edit Your profile</p>

</div>
              <div
                  className=" complaint"
                  onClick={handleComplaintClick}
                >
                     <FontAwesomeIcon
                      icon={faCommentDots }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
                  
                  <h6 style={{display:"inline"}}>{t("Complaint")} </h6>
                </div>
                <div
                  className=" complaint"
                  onClick={handleTestimonyClick}
                >
                    <FontAwesomeIcon
                      icon={faQuoteLeft }
                      size="1x"
                      color="rgb(100, 100, 100)"
                    />
                  <h6 style={{display:"inline"}}>{t("Testimony")} </h6>
                </div>
            
              <br />
              <p onClick={addpro} className="eedit"
              style={{marginTop:"1rem"}}>Edit</p>
              <br /> <br />
              <button className="popup-btn" id="x" onClick={togglePopup}>
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
