import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import { useTranslation } from "react-i18next";
import AlertPopup from "./AlertPopup";


export default function Login() {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };
  const navigate = useNavigate();
  const { logIn } = useAuth();

  const forLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/login/`, {
        username,
        password,
      });
      if (!response || !response.data) {
        setIsPopupAlertVisible("error logging in check your credentials");
        return;
      }

      const data = response.data;
      logIn(data.message.userData, data.message.token);

      if (data.message.userData.UserType === "employer") {

        const redirectData = JSON.parse(sessionStorage.getItem("redirectDataEmployer")) ||  { pathname: "/employerpage", state: {} }

      sessionStorage.removeItem("redirectDataEmployer");
      navigate(redirectData.pathname, {  replace: true ,state: redirectData.state });


      } else if (data.message.userData.UserType === "freelancer") {

        const redirectData = JSON.parse(sessionStorage.getItem("redirectDataFreelancer")) || { pathname: "/freelancerpage", state: {} }
 
        sessionStorage.removeItem("redirectDataFreelancer");
        navigate(redirectData.pathname, { state: redirectData.state });

      } else if (data.message.userData.UserType === "admin") {
        navigate("/admin");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIsPopupAlertVisible(error.response.data.error);
      } else {
        console.error("Error checking user:", error);
        setIsPopupAlertVisible(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };


  const handleNavigation = (path) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 700); 
  };

  return (
    <div className="registerlogin">
    <div className="wholelogin">
        <div className="backlogo"></div>
      <div className={`registervid ${isExiting ? "slide-exitVidLogIn" : "slide-enter"}`}>
        <video width="700" muted controls={false} autoPlay loop>
          <source src={"/image/login-9832756-8050143.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="wrapper">
        <div className={`popup loginpop  ${isExiting ? "slide-exitLogIn" : "slide-enter"}`}>
          <div className="popup-content newlogin">
            <div className="login-popup">
              <h3 className="h3-login">{t("LogIn")}</h3>
              <input
                className="input"
                type="text"
                placeholder={t("Username")}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder={t("Password")}
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
              <br />
              <button className="popup-btn" onClick={forLogin}>
                {t("LogIn")}
              </button>
              <p>
                {t("Don't have an account.")}{" "}
                <button
                  className="button-33"
                  role="button"
                  onClick={() => handleNavigation("/Register")}
                >
                  {t("Register")}
                </button>
              </p>
            </div>
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
