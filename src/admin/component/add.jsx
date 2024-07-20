import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Add(){

    const [inputValue, setinputValue] = useState({
        Usertype: "",
        Fullname: "",
        username: "",
        Phonenumber: "",
        Email: "",
        Password: "",
        Gender: "",
      });
    
      const { t } = useTranslation();
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

      const [code, setcode] = useState("");
      const [codenum, setcodenum] = useState("");

      const togglePopupcode = () => {
        setcode("");
      };

     

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
          await axios.post("http://localhost:4000/admin/registerUserAdmin", {
            Usertype: inputValue.Usertype,
            Fullname: inputValue.Fullname,
            username: inputValue.username,
            Phonenumber: inputValue.Phonenumber,
            Email: inputValue.Email,
            Password: inputValue.Password,
            Gender: inputValue.Gender,
            title: "",
            profilepic: "",
            code: codenum,
            nullvalue,
          });
          console.log("data: ", nullvalue);
          setPopup(!popup);
        } catch (error) {
          if (error.response.status === 400) {
            if (error.response.data === "User already registered") {
              alert("User already registered");
            } else if (error.response.data === "Invalid code") {
              alert("Invalid code");
            } else if (error.response.data === "Code has expired") {
              alert("Code has expired");
            } else {
              alert(error.response.data); // Display other messages as an alert
            }
          } else if (error.response.data === "user already registered") {
            alert("user already registered");
            return;
          }
          console.log("errorr", error);
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
          alert("please fillout all of the fileds");
        } else {
          sendcode();
          setcode("active");
        
        }
      };


    return(
        <>
        
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
                      onChange={(e) => setcodenum(e.target.value)}
                    />{" "}
                    <br />
                    <button className="popup-btn" onClick={saveData}>
                      {t("Submit")}
                    </button>
                    <button
                      className="popup-btn"
                      id="x"
                      onClick={togglePopupcode}
                    >
                      X
                    </button>
                    <a href="#" onClick={togglecode}>
                      {t("Resend code")}
                    </a>
                  </div>



        <div  className={`wrapper`}>
                        <div className={`popup  registerpop adminpop ` }>
                          <div  className="overlay"></div>
                          <div className={`popup-content adminreg`}>
                          
                        
               
 
                            <input
                              type="radio"
                              name="user"
                              value="employer"
                              onChange={(e) =>
                                setinputValue({
                                  ...inputValue,
                                  Usertype: e.target.value,
                                })
                              }
                            />{" "}
                            {t("Employer")}
                            <input
                              type="radio"
                              name="user"
                              value="freelancer"
                              onChange={(e) =>
                                setinputValue({
                                  ...inputValue,
                                  Usertype: e.target.value,
                                })
                              }
                            />{" "}
                            {t("Freelancer")}
                            <br /><br />

        

  
  <h3 className="h3-register">{t("Register")}</h3>   
    <input
                              className="input"
                              type="text"
                              placeholder={t("Fullname")}
                              onChange={(e) =>
                                setinputValue({
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
                                setinputValue({
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
                                setinputValue({
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
                                setinputValue({
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
                                setinputValue({
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
                                setinputValue({
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
                                setinputValue({
                                  ...inputValue,
                                  Gender: e.target.value,
                                })
                              }
                            />{" "}
                            {t("Female")}
                            <br /> <br />
                            <button className="popup-btn"  onClick={togglecode} >
                              {t("Submit")}
                            </button>
                          
          
                          </div>
                        </div>
          
                    </div>
        </>
    )
} 