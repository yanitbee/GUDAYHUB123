import React from 'react';
import "./MessageForNonverified.css";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AlertPopup from './AlertPopup';
import useAuth from '../Hooks/UseAuth';
import axios from 'axios';

const WelcomeMessage = ({ name, dismiss }) => {

  const { getUserData } = useAuth();

  const userData = getUserData();

  const [isPopupAlertVisible, setIsPopupAlertVisible] = useState("");
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [verificationDate, setverificationDate] = useState("");
  const [verificationTime, setverificationTime] = useState("");
  const [notes , setnotes ] = useState("");

  const [freelancerData, setFreelancerData] = useState([]);

  const handleClose = () => {
    setIsPopupAlertVisible("");
  };
  const handleDismiss = () => {
    dismiss();
   
    sessionStorage.setItem('welcomeMessageDismissed', 'true');
  };

   
  const handleDateChange = (e) => {
    setverificationDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setverificationTime(e.target.value);
  };

  const handelcomform = () => {
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const fetchFreelancerData = async () => {
      if (userData && userData.userID) {
        try {
          const response = await axios.get(
            `http://localhost:4000/freelancer/apply/${userData.userID}`
          );
          setFreelancerData(response.data);
        } catch (error) {
          console.error("freelancer error", error);
        }
      }
    };
    fetchFreelancerData();
  }, [userData]);

  
  const scheduleVerification = async (e) => {
    e.preventDefault();
    const formData = {
      freelancerId: userData.userID,
      freelanerName: freelancerData.Fullname,
      freelancerEmail: freelancerData.Email,
      verificationDate: verificationDate, 
      verificationTime: verificationTime, 
      notes: notes ? notes : "New schedule",
    };
  setnotes("")
    try {
      const response = await axios.post('http://localhost:4000/user/schedule-verification', formData)
      setIsPopupOpen(false)
      setIsPopupAlertVisible(response.data.message)
      console.log('Verification scheduled:', response.data);
    } catch (error) {
      console.error('Error scheduling verification:', error);
    }
  };
  
  const handleClosePop = () => {
    setIsPopupOpen(false)
    setnotes("")
  }

  return (
    <>
    <div className="welcome-message">
        <h2>Verification needed</h2>
      <p>Welcome, {name}, to GudayHub! Your account is not verified yet. Read more  <Link to="/verification">HERE</Link>.
         to verify your account.
        or contact us by this number: 123-456-789
      </p>
      <p>Click yes if you want to schdule Your verification</p>
      <button onClick={handelcomform}>Okay</button>
      <button onClick={handleDismiss}>Cancle</button>
    </div>

        
{isPopupOpen && (
        <div className="popupi"    style={{zIndex:"2000"}}>
          <div className="popup-contenti">
            <h2>schedule Your Verification</h2>
            <form onSubmit={scheduleVerification}>
              
          
          
              <label htmlFor="interviewDate">Verification Date:</label>
              <input
                type="date"
                id="interviewDate"
                value={verificationDate}
                onChange={handleDateChange}
              />
              <label htmlFor="interviewTime">Verification Time:</label>
              <input
                type="time"
                id="interviewTime"
                value={verificationTime}
                onChange={handleTimeChange}
              />
              <button type="submit">Schedule</button>
              <button type="button" onClick={handleClosePop}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
            {isPopupAlertVisible != "" && (
        <AlertPopup
        style={{zIndex:"3000"}}
          message = {isPopupAlertVisible}
          onClose={handleClose}
        />
      )}v
    </>
  );
};

export default WelcomeMessage;
