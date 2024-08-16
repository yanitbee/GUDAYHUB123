import axios from "axios";
import AlertPopup from "../../assets/AlertPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function VerifyUsers() {

    const { t } = useTranslation();
    const location = useLocation();

    
    const [inputValue, setinputValue] = useState({
        VerifiedDoc: "",
    
      });

    const uploadDoc = async (e) => {
        setinputValue({ ...inputValue, VerifiedDoc: e.target.files[0] });
      };

      const inputrefDoc = useRef(null);

const user = location.state;

      function isFormDataEmpty(formData) {
        for (let pair of formData.entries()) {
          return false;
        }
        return true;
      }

      
  const verifyUser = async () => {
    const formData = new FormData();
    if (inputValue.VerifiedDoc) {
      formData.append("VerifiedDoc", inputValue.VerifiedDoc);
    }
   
    if (!isFormDataEmpty(formData)) {
      try {
        const response =  await axios.put(
          `http://localhost:4000/admin/verifieUser/${user.username}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setIsPopupAlertVisible(response.data.message);
      } catch (error) {
        console.error("errorr", error);
      }
    }

  }

  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");

  const handleCancel = () => {
    setIsPopupAlertVisible("");
  };

  const handleDoc = () => {
    inputrefDoc.current.click();
  };


    return(
        <>
        <div style={{marginTop:"8rem"}}>
<div  className={`wrapper`}>
                        <div className={`popup adminpop 
                        verify` }
                        style={{display:"inline-flex"}}>
                          <div  className="overlay"></div>
                          <div className={`popup-content adminreg`}>                        
                      
                           <br />
                           <div className="holder start-0">
          {user === null ? (
            <img
              className="profilepic "
              src={`/image/profile.jpg`}
              alt="Profile"
            />
          ) : (
            <img
              className="profilepic "
              src={
                user.freelancerprofile.profilepic === "" ||
                user.freelancerprofile.profilepic === null
                  ? `/image/profile.jpg`
                  : getProfilePicUrl(
                    user.freelancerprofile.profilepic
                    )
              }
              alt="Profile"
            />
          )}
        </div>
  
  <h3 className="h3-register">{user.Fullname}</h3>   
  <br />
                            User Information
                            <input
                              className="input"
                              disabled
                              value={user.username}
                            />
                            <input
                              className="input"
                              disabled
                              type="text"
                              placeholder={t("Phonenumber")}
                              value={user.Phonenumber}
                            />
                            <input
                              className="input"
                              disabled
                              type="email"
                              placeholder={t("Email")}
                              value={user.Email}
                            />
                            <input
                              className="input"
                              type="text"
                              disabled
                              value={user.Gender}
                            />{" "}
                          
          
                          </div>
                        </div>

                    </div>
                    <div className="" onClick={handleDoc}
                       style={{ marginTop: "-20.5rem", marginLeft: "30rem" }}>
                      <h4>Upload the documentation</h4>
                      <br/>
                    <FontAwesomeIcon
                                icon={faFileArrowUp}
                                size="5x"
                                color="rgba(73, 154, 149, 0.61)"
                             
                              />
                      <input type="file" onChange={uploadDoc} 
                       ref={inputrefDoc}
                       style={{ display: "none" }}/>
                     
                    </div>
                    <button className="button-33"
                     style={{ marginTop: "15.5rem" }} onClick={verifyUser}>Verify</button>

                    {isPopupAlertVisible != "" && (
    <AlertPopup
    message={isPopupAlertVisible}
    onClose={handleCancel}
  />
                    )}
                    </div>
        </>
    )
}
