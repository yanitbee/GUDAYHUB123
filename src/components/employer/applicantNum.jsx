import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicantNum = ({ postId, type }) => {
  const [numApplicants, setNumApplicants] = useState([]);
  const [numHired, setNumHired] = useState([]);

  useEffect(() => {
    const fetchApplicantsAndHired = async () => {
      try {
        const applicantResponse = await axios.get(
          "http://localhost:4000/applicant/readjobapplicant",
          { params: { postid: postId } }
        );
        setNumApplicants(applicantResponse.data);
        const hiredResponse = await axios.get(
          "http://localhost:4000/hired/readhired",
          { params: { postid: postId } }
        );
        setNumHired(hiredResponse.data);
      } catch (error) {
        console.error("Error fetching applicant or hired count:", error);
        setNumApplicants([]);
        setNumHired([]);
      }
    };

    fetchApplicantsAndHired();
  }, [postId]);

  return (
    <div>
      {type === "App" ? (
        Array.isArray(numApplicants) ? numApplicants.length : "Loading..."
      ) : type === "Hired" ? (
        Array.isArray(numHired) ? numHired.length : "Loading..."
      ) : (
        "Invalid type"
      )}
    </div>
  );
};

export default ApplicantNum;

