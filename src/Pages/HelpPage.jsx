import React, { useState } from "react";
import BackButton from "../components/BackButton";
import "../Pages/css/HelpPage.css";
import logo from "../../public/image/cv.jpg"

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const [openItem, setOpenItem] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const toggleSection = (sectionIndex, itemIndex) => {
    if (openSection === sectionIndex && openItem === itemIndex) {
      setOpenSection(null);
      setOpenItem(null);
    } else {
      setOpenSection(sectionIndex);
      setOpenItem(itemIndex);
    }
  };

  const helpSections = [
    {
      title: "Getting Started",
      description: "Learn how to register and create a profile.",
      items: [
        { title: "How to Register", explanation: "Step one: click on the Register button. Step two: after the registration form appears you can choose either you want to register as a freelancer or an employer by clicking on the radio buttons. Step three: After the register form appears then fill in the information it asks and clicke on the submit button." },
        { title: "Creating a Profile", explanation: "Learn how to build a compelling freelancer profile." },
      ],
    },
    {
      title: "For Freelancers",
      description: "Find jobs, submit applications, and manage your tasks.",
      items: [
        { title: "How to Find Jobs/Tasks", explanation: "First after loging in as a freelancer go to the freelancers homepage were you can see job lists and tasks." },
        { title: "Submitting Application", explanation: "Step one: Click on the job or task you want to apply on. Step two: Click on the apply button and submit your application." },
        { title: "Managing Tasks", explanation: "Guide to managing your assigned tasks effectively." }
      ],
    },
    {
      title: "For Employers",
      description: "Post jobs, hire freelancers, and manage your projects.",
      items: [
        { title:"Posting a Job", explanation:"Go to the post page on the employers page then you can choose either you want to post a job or a task."},
        { title:"Hiring Freelancers", explanation:"Go to applicants page to see who applied on the post you've made then you can istantly hire the freelancer or set an interview schedule."}
        ],
    },
    {
      title: "Common Issues",
      description: "Find solutions to common account and technical problems.",
      items: [
        {title:"Account Issues"},
      {title:"Technical Problems"}
        ],
    },
    {
      title: "Contact Support",
      description: "Need further assistance? Contact our support team.",
      items: [
       {title: "Live Chat"}, 
       {title: "Email Support"}, 
       {title:"FAQs"}
      ],
    },
    {
      title: "Community and Resources",
      description: "Explore guides, tutorials, and community resources.",
      items: ["Guides and Tutorials", "User Forums", "Success Stories"],
    },
    {
      title: "Legal and Privacy",
      description: "Review our terms of service, privacy policy, and dispute resolution process.",
      items: ["Terms of Service", "Privacy Policy", "Dispute Resolution"],
    },
  ];
  

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm) ||
    section.description.toLowerCase().includes(searchTerm) ||
    section.items.some(item => item.title.toLowerCase().includes(searchTerm))
  );

  return (
    <div className="help-page">
      <h1>Help Page</h1>
      
      {filteredSections.map((section, index) => (
        <section className="help-section" key={index}>
          <h2 onClick={() => toggleSection(index, null)} className="section-title">
            {section.title}
            <span className={`arrow ${openSection === index ? "open" : ""}`}></span>
          </h2>
          {openSection === index && (
            <div className="section-content">
              <p>{section.description}</p>
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} onClick={() => toggleSection(index, itemIndex)}>
                    {item.title}
                    {openItem === itemIndex && <p className="item-explanation">{item.explanation}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      <BackButton />
    </div>
  );
};

export default HelpPage;
