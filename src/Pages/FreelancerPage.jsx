import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Joblist from "../components/Freelancer/JobList";
import Frelancerprofile from "../components/Freelancer/FrelancerProfile";
import WelcomeMessage from "../assets/MessageForNonverified";
import useAuth from "../Hooks/UseAuth";

export default function Freelancerpage() {
  const { getUserData } = useAuth();
  const userData = getUserData();

  const [freelancerData, setFreelancerData] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      if (userData && userData.userID) {
        try {
          const response = await axios.get(
            `http://localhost:4000/freelancer/apply/${userData.userID}`
          );
          setFreelancerData(response.data);

          // Check if the message should be visible
          const hasDismissedMessage = sessionStorage.getItem('welcomeMessageDismissed');
          if (!response.data.IsVerified && !hasDismissedMessage) {
            setIsPopupVisible(true);
          }
        } catch (error) {
          console.error("freelancer error", error);
        }
      }
    };

    fetchFreelancerData();
  }, [userData]);

  // Function to hide the popup
  const handlePopupDismiss = () => {
    setIsPopupVisible(false);
    // Optionally, store the dismissal status in sessionStorage
    sessionStorage.setItem('welcomeMessageDismissed', 'true');
  };

  return (
    <>
      <Frelancerprofile />
      <Joblist />
      {isPopupVisible && <WelcomeMessage name={freelancerData.username} dismiss={handlePopupDismiss} />}
    </>
  );
}
