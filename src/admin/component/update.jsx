import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Update(){
    const { t } = useTranslation();
    const [inputValue, setinputValue] = useState({
        username: "",
        VerifiedDoc: "",
    
      });
    
      const uploadDoc = async (e) => {
        setinputValue({ ...inputValue, VerifiedDoc: e.target.files[0] });
      };
    
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
              `http://localhost:4000/admin/verifieUser/${inputValue.username}`,
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
    return(
        <>
        <div  className={`wrapper`}>
                        <div className={`popup adminpop verify ` }
                        style={{display:"inline-flex"}}>
                          <div  className="overlay"></div>
                          <div className={`popup-content adminreg`}>                        
                      
                           <br />
  
  <h3 className="h3-register">{t("Update")}</h3>   
    <input
                              className="input"
                              type="text"
                              placeholder={t("Search UserName")}
                              onChange={(e) =>
                                setinputValue({
                                  ...inputValue,
                                  username: e.target.value,
                                })
                              }
                            />
                              <br />
                              <br />  <br />
                            User Information
                            <input
                              className="input"
                              type="text"
                              placeholder={t("Username")}
                            />
                            <input
                              className="input"
                              type="text"
                              placeholder={t("Phonenumber")}
                            />
                            <input
                              className="input"
                              type="email"
                              placeholder={t("Email")}
                            />
                            <input
                              className="input"
                              type="password"
                              placeholder={t("Password")}
                            />{" "}
                          
          
                          </div>
                        </div>

                    </div>
                    <div className="fileinput">
                      <input type="file" onChange={uploadDoc}/>
                    </div>
                    <button className="button-33" onClick={verifyUser}>Update</button>
        </>
    )
}