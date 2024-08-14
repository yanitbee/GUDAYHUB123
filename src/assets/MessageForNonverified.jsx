import React from 'react';
import "./MessageForNonverified.css";
import { Link } from 'react-router-dom';

const WelcomeMessage = ({ name, dismiss }) => {
  const handleDismiss = () => {
    // Call the dismiss function provided by the parent component
    dismiss();
    // Optionally, you could also store this in sessionStorage if you want to ensure it's not shown again in the current session
    sessionStorage.setItem('welcomeMessageDismissed', 'true');
  };

  return (
    <div className="welcome-message">
        <h2>Verification needed</h2>
      <p>Welcome, {name}, to GudayHub! Your account is not verified yet. Read more  <Link to="/verification">HERE</Link>.
         to verify your account.
        or contact us by this number: 123-456-789
      </p>
      <button onClick={handleDismiss}>Okay</button>
    </div>
  );
};

export default WelcomeMessage;
