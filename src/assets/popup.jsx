import React from "react";
import "./Popup.css";

export default function Popup ({ message, onConfirm, onCancel }) {
  return (
    <div className="popupc-container confirm show">
      <div className="popupc">
        <h2>Message</h2>
        <p>{message}</p>
        <div className="popup-buttons">
          <button id="confirm-button" onClick={onConfirm}>
            Yes
          </button>
          <button id="cancel-button" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};


