import React from "react";
import BackButton from "../components/BackButton";
import "../Pages/css/HelpPage.css";

const HelpPage = () => {
  return (
    <div className="help-page">
      <h1>Help Page</h1>
      <p>How can we help you?</p>
      
      <section className="help-section">
        <h2>Getting Started</h2>
        <p>Learn how to register, create a profile, and navigate the dashboard.</p>
        <ul>
          <li>How to Register</li>
          <li>Creating a Profile</li>
          <li>Navigating the Dashboard</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>For Freelancers</h2>
        <p>Find jobs, submit applications, and manage your Tasks.</p>
        <ul>
          <li>How to Find Jobs/Tasks</li>
          <li>Submitting Application</li>
          <li>Managing Tasks</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>For Employers</h2>
        <p>Post jobs, hire freelancers, and idk.</p>
        <ul>
          <li>Posting a Job</li>
          <li>Hiring Freelancers</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Common Issues</h2>
        <p>Find solutions to common account and technical problems.</p>
        <ul>
          <li>Account Issues</li>
          <li>Technical Problems</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Contact Support</h2>
        <p>Need further assistance? Contact our support team.</p>
        <ul>
          <li>Live Chat</li>
          <li>Email Support</li>
          <li>FAQs</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Community and Resources</h2>
        <p>Explore guides, tutorials, and community resources.</p>
        <ul>
          <li>Guides and Tutorials</li>
          <li>User Forums</li>
          <li>Success Stories</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Legal and Privacy</h2>
        <p>Review our terms of service, privacy policy, and dispute resolution process.</p>
        <ul>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Dispute Resolution</li>
        </ul>
      </section>

      <BackButton />
    </div>
  );
};

export default HelpPage;
