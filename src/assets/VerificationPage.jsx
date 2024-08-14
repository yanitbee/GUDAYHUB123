import React from 'react';


const VerificationPage = () => {
  return (
    <div className="verificationContainer">
      <h1 className="heading1">Verification Process Overview</h1>

      <section className="verificationIntro">
        <h2 className="heading2">Welcome to Our Verification Process</h2>
        <p>
          To ensure the highest level of security and compliance, we require all users to complete a verification process. This step is crucial for verifying your identity and ensuring the accuracy and legality of the information provided.
        </p>
      </section>

      <section className="verificationDetails">
        <h2 className="heading2">What to Expect</h2>

        <div className="verificationStep">
          <h3>1. In-Person Verification</h3>
          <p>
            To complete your verification, you will need to visit our designated verification center in person. This step allows us to perform a thorough check of your identification documents and confirm your identity in person.
          </p>
        </div>

        <div className="verificationStep">
          <h3>2. Documents Required</h3>
          <ul className="lista">
            <li className="listItem"><strong className="strong">Government-Issued ID:</strong> A valid passport, driver’s license, or national ID card.</li>
            <li className="listItem"><strong className="strong">Proof of Address:</strong> A recent utility bill, bank statement, or other official documents that show your current address.</li>
            <li className="listItem"><strong className="strong">Legal Documents:</strong> If applicable, any documents that pertain to legal agreements or compliance requirements.</li>
          </ul>
        </div>

        <div className="verificationStep">
          <h3>3. Signing Legal Documents</h3>
          <p>
            During your visit, you will be required to sign several legal documents. These documents include:
          </p>
          <ul className="lista">
            <li className="listItem"><strong className="strong">User Agreement:</strong> Outlines the terms and conditions of using our platform.</li>
            <li className="listItem"><strong className="strong">Privacy Policy:</strong> Details how we handle and protect your personal information.</li>
            <li className="listItem"><strong className="strong">Consent Forms:</strong> Necessary consents related to data processing and legal compliance.</li>
          </ul>
        </div>

        <div className="verificationStep">
          <h3>4. Verification Appointment</h3>
          <p>
            To ensure a smooth and efficient process, please schedule an appointment in advance. You can do this by contacting our support team via <a href="gudayhub@Gmail.com" className="link">email</a> or through our online scheduling system.
          </p>
        </div>

        <div className="verificationStep">
          <h3>5. On-Site Process</h3>
          <ul className="lista">
            <li className="listItem"><strong className="strong">Arrival:</strong> Upon arrival, please check in at the reception.</li>
            <li className="listItem"><strong className="strong">Verification Check:</strong> Our staff will guide you through the verification steps, including document checks and form signing.</li>
            <li className="listItem"><strong className="strong">Completion:</strong> Once all steps are completed, you will receive a confirmation of your verification status.</li>
          </ul>
        </div>
      </section>

      <section className="verificationImportance">
        <h2 className="heading2">Why Verification is Important</h2>
        <p>
          Verification is a critical part of maintaining the integrity and security of our platform. It helps us ensure that all users are genuine and meet our standards for participation. By completing this process, you help us create a safer and more trustworthy environment for everyone.
        </p>
      </section>

      <section className="verificationAssistance">
        <h2 className="heading2">Need Assistance?</h2>
        <p>
          If you have any questions or need assistance with the verification process, please feel free to reach out to our support team. We are here to help!
        </p>
        <ul>
          <li><strong className="strong">Email:</strong> <a href="mailto:support@example.com" className="link">gudayhub@Gmail.com</a></li>
          <li><strong className="strong">Phone:</strong> (123) 456-7890</li>
          <li><strong className="strong">Address:</strong> 123 Verification Street, City, Country</li>
        </ul>
      </section>
    </div>
  );
};

export default VerificationPage;
