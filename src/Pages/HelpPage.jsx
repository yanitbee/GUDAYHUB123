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
        { title: "How to Register", explanation: "Step one: click on the Register button. Step two: after the registration form appeared you can choose either you want to register as a fteelancer or an employer by clicking on the radio buttons" },
        { title: "Creating a Profile", explanation: "Learn how to build a compelling freelancer profile." },
      ],
    },
    {
      title: "For Freelancers",
      description: "Find jobs, submit applications, and manage your tasks.",
      items: [
        { title: "How to Find Jobs/Tasks", explanation: "Tips for searching and applying for jobs or tasks." },
        { title: "Submitting Application", explanation: "How to submit your application and what to include." },
        { title: "Managing Tasks", explanation: "Guide to managing your assigned tasks effectively." }
      ],
    },
    {
      title: "For Employers",
      description: "Post jobs, hire freelancers, and manage your projects.",
      items: [
        { title:"Posting a Job", explanation:"bla bla bla"},
        { title:"Hiring Freelancers", explanation:"bla blan"}
        ],
    },
    {
      title: "Common Issues",
      description: "Find solutions to common account and technical problems.",
      items: ["Account Issues", "Technical Problems"],
    },
    {
      title: "Contact Support",
      description: "Need further assistance? Contact our support team.",
      items: ["Live Chat", "Email Support", "FAQs"],
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
