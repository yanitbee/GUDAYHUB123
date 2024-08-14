import React from "react";

const LogoutPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout-popup">
      <div className="popup-contentl">
        <h4>Are you sure you want to logout?</h4>
        <div className="popup-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-button" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
