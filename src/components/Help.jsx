import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "../Pages/css/help.css";

const Help = () => {
  const navigate = useNavigate();

  const handleHelpClick = () => {
    navigate("/HelpPage"); 
  };

  return (
    <div>
      {/* Floating Help Icon */}
      <div className="help-icon" onClick={handleHelpClick}>
        <FontAwesomeIcon icon={faQuestionCircle} size="3x" />
      </div>
    </div>
  );
};

export default Help;
