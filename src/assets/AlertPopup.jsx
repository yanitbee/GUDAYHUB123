import React from "react";
import "./AlertPopup.css";

export default function AlertPopup({ message, onClose }) {
  return (
    <div className="alert-popup-container show">
      <div className="alert-popup">
        <h2>Message</h2>
        <p>{message}</p>
        <div className="alert-popup-buttons">
          <button id="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
