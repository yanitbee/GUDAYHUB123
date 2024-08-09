import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import AlertPopup from "./AlertPopup";
import useAuth from "../Hooks/UseAuth";

export default function Register() {

  const { getUserData, logOut } = useAuth();
  const userData = getUserData();

  const { t } = useTranslation();
  const navigate = useNavigate()
  const [isExiting, setIsExiting] = useState(false);
  const [inputValue, setInputValue] = useState({
    Usertype: "",
    Fullname: "",
    username: "",
    Phonenumber: "",
    Email: "",
    Password: "",
    Gender: "",
  });
  const nullvalue = useState({
    profilepic: null,
    title: null,
    skills: null,
    cv: null,
    additionaldoc: { educations: null, certifications: null },
    gudayhistory: { jobs: 0, hired: 0 },
    workhistory: null,
    rating: 0,
    description: null,
    portfolio: { link: null, title: null },
  });
  const [codenum, setCodenum] = useState("");
  const [popup, setPopup] = useState(false);
  const [code, setCode] = useState("");
  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  if(userData){
    logOut();
  }

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };

  const togglePopup = () => {
    setPopup(!popup);
  };

  const togglecodePopup = ()=>{
    setCode("")
  }

  const sendcode = async () => {
    try {
      await axios.post("http://localhost:4000/user/sendcode", {
        email: inputValue.Email,
      });
      console.log("code sent");
    } catch (error) {
      console.log("errorr", error);
    }
  };

  const saveData = async () => {
    try {
      const response =   await axios.post("http://localhost:4000/user/registerUser", {
        Usertype: inputValue.Usertype,
        Fullname: inputValue.Fullname,
        username: inputValue.username,
        Phonenumber: inputValue.Phonenumber,
        Email: inputValue.Email,
        Password: inputValue.Password,
        Gender: inputValue.Gender,
        title: "",
        profilepic: "",
        IsVerified: false,
        nullvalue,
      });
      
      if (response.status === 201 && response.data.message === "Verification code sent to email") {
        setIsPopupAlertVisible("Verification code sent to email");
        setCode("active");
      }  else if(response.data.message === "User already exists. Verification code has been reset."){
        setIsPopupAlertVisible(response.data.message); 
        setCode("active"); 
      }else {
        setIsPopupAlertVisible("Unexpected response from server.");
      }
   
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;

        if (Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors.map(err => err.msg).join(", ");
          setIsPopupAlertVisible(validationErrors);
        }
        else if (error.response.data === "User already registered") {
          setIsPopupAlertVisible("User already registered");
        }
        else {
          setIsPopupAlertVisible(error.response.data.message); 
        }
      } else if (error.response.data === "user already registered") {
        setIsPopupAlertVisible("user already registered");
        return;
      }
      console.log("errorr", error);
    }
  };

  const verify = async () => {
    try {
      const response = await axios.post("http://localhost:4000/user/verify", {
        email: inputValue.Email,
        verificationCode: codenum,
      });
  
      if (response.status === 200) {
        setIsPopupAlertVisible(response.data.message); 
        setCode(""); 
        setTimeout(() => {
          handleNavigation("/login")
        }, 400);
      } else {
        setIsPopupAlertVisible("Unexpected response from server.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {

        setIsPopupAlertVisible(error.response.data.message || "An error occurred");
      } else {
        setIsPopupAlertVisible("An unexpected error occurred.");
      }
    }
  };
  

  const togglecode = () => {
    const isEmpty = (value) => {
      return (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
      );
    };
    const hasEmptyProperties = Object.values(inputValue).some(isEmpty);
    if (hasEmptyProperties) {
      setIsPopupAlertVisible("please fill out all of the fields");
    } else {
      sendcode();
      setIsPopupAlertVisible("Code resent")
      setCode("active");
      setPopup(!popup);
    }
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }

  const [radio, setRadio] = useState(false);
  const clicked = () => {
    setRadio(!radio);
  };


  const handleNavigation = (path) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 700); 
  };



  return (
    <div className="registerlogin">
      <div className="backlogo"></div>
      <div className="wholeregister">
        <div className={`loginvid ${isExiting ? "slide-exit" : "slide-enter"}`}>
          <video width="600" muted controls={false} autoPlay loop>
            <source
              src={"/image/sign-up-8431988-6716092.mp4"}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={`code${code}`}>
          <p>
            {t(
              "we have sent a code to your email enter the code to register"
            )}
          </p>
          <input
            className="input"
            type="text"
            placeholder=""
            onChange={(e) => setCodenum(e.target.value)}
          />{" "}
          <br />
          <button className="popup-btn" onClick={verify}>
            {t("Submit")}
          </button>
          <button className="popup-btn" id="x" onClick={togglecodePopup}>
            X
          </button>
          <a href="#" onClick={togglecode}>
            {t("Resend code")}
          </a>
        </div>

        <div className={`wrapper`}>
          <div className={`popup ${radio} registerpop ${isExiting ? "slide-exitPop" : "slide-enterPop"}`}>
            <div onClick={togglePopup} className="overlay"></div>
            <div className={`popup-content content${radio}`}>
              <p>
                Would you like to register as an employer or a freelancer?
              </p>
              <div>
                <img src="/image/choose.png"></img>
              </div>
              <input
                type="radio"
                name="user"
                value="employer"
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Usertype: e.target.value,
                  })
                }
                onClick={clicked}
              />{" "}
              {t("Employer")}
              <input
                type="radio"
                name="user"
                value="freelancer"
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Usertype: e.target.value,
                  })
                }
                onClick={clicked}
              />{" "}
              {t("Freelancer")}
              <br />
              <br />
              <p>
                {t("Already have an account.")}{" "}
                <button
                  className="button-33"
                  role="button"
                  onClick={() => handleNavigation("/login")}
                >
                  {t("LogIn")}
                </button>
              </p>
              <br /> <br /> <br /> <br />
              <FontAwesomeIcon icon={faArrowUp} size="2x" onClick={clicked} />
              <h3 className="h3-register">{t("Register")}</h3>
              <input
                className="input"
                type="text"
                placeholder={t("Fullname")}
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Fullname: e.target.value,
                  })
                }
              />
              <input
                className="input"
                type="text"
                placeholder={t("Username")}
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    username: e.target.value,
                  })
                }
              />
              <input
                className="input"
                type="text"
                placeholder={t("Phonenumber")}
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Phonenumber: e.target.value,
                  })
                }
              />
              <input
                className="input"
                type="email"
                placeholder={t("Email")}
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Email: e.target.value,
                  })
                }
              />
              <input
                className="input"
                type="password"
                placeholder={t("Password")}
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Password: e.target.value,
                  })
                }
              />{" "}
              <br />
              <input
                className="radio"
                type="radio"
                name="gender"
                value="male"
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Gender: e.target.value,
                  })
                }
              />{" "}
              {t("Male")}
              <input
                className="radio"
                type="radio"
                name="gender"
                value="female"
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    Gender: e.target.value,
                  })
                }
              />{" "}
              {t("Female")}
              <br /> <br />
              <button className="popup-btn" onClick={saveData}>
                {t("Submit")}
              </button>
              <p>
                {t("Already have an account.")}{" "}
                <button
                  className="button-33"
                  role="button"
                  onClick={() => handleNavigation("/login")}
                >
                  {t("LogIn")}
                </button>
              </p>

            </div>
          </div>
          {isPopupAlertVisible != "" && (
        <AlertPopup
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}
        </div>
      </div>
    </div>
  );
}
