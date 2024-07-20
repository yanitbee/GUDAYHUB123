import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/freelancerlist.css";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Freelancerlist() {
  const [readData, setreadData] = useState({});
  const { t } = useTranslation();
  const [searchicon, setsearchicon] = useState("");
  const [search, setsearch] = useState("");

  const searchclicked = () => {
    setsearchicon("active");
  };
  const searchclickednot = () => {
    setsearchicon("");
  };

  const handelsearch = (e) => {
    setsearch(e.target.value);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/employer/readfromserver" ,
          {
            params: { serachtitle: search},
          }
        );
        const data = response.data;

        // Filter the freelancers
        const freelancers = data.filter((user) => 
          user.Usertype === "freelancer" && user.status !== "deleted" && user.status !== undefined
        );

        // Default categories
        const defaultCategories = {
          "House Work": ["Cleaner", "Plumber"],
          "IT & Software": ["Developer", "Designer"],
          "Writing & Translation": ["Writer", "Translator"],
          "Transportation" : ["driver","Delivery","Pickup","bus driver"]
          // Add more default categories as needed
        };

        // Convert default categories to lowercase for comparison
        const lowerCaseCategories = Object.entries(defaultCategories).reduce((acc, [category, titles]) => {
          acc[category] = titles.map(title => title.toLowerCase());
          return acc;
        }, {});

        // Categorize freelancers
        const categorizedData = freelancers.reduce((acc, freelancer) => {
          const freelancerTitle = freelancer.freelancerprofile.title ? freelancer.freelancerprofile.title.toLowerCase() : "others";
          let foundCategory = false;

          for (const [category, titles] of Object.entries(lowerCaseCategories)) {
            if (titles.includes(freelancerTitle)) {
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(freelancer);
              foundCategory = true;
              break;
            }
          }

          if (!foundCategory) {
            if (!acc["Others"]) {
              acc["Others"] = [];
            }
            acc["Others"].push(freelancer);
          }
          return acc;
        }, {});

        setreadData(categorizedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [search]);

 

  const navigate = useNavigate();

  const handleclick = (userid) => {
    navigate("Freelancerdetails", { state: { userid: userid } });
  };

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  const generateStars = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2;
    const stars = [];

    for (let i = 5; i >= 1; i--) {
      if (roundedRating >= i) {
        stars.push(
          <label key={i} className={`${i} full-stars`}>
            &#9733;
          </label>
        );
      } else if (roundedRating + 0.5 === i) {
        stars.push(
          <label key={i} className={`${i} half-stars`}>
            &#9733;
          </label>
        );
      } else {
        stars.push(
          <label key={i} className={`${i} no-stars`}>
            &#9734;
          </label>
        );
      }
    }
    stars.reverse();
    return stars;
  };
 
 
 



  return (
    <>
      <div className="jobparent">
        <div className={`serachparent`}>
          <FontAwesomeIcon
            className={`search s${searchicon} end-0 morecssserch`}
            icon={faSearch}
          />
          <input
            className={`another end-0 morecss`}
            type="text"
            placeholder="Search specialtys"
            onChange={handelsearch}
            onClick={searchclicked}
          />
        </div>
        <div className={`sidebar${searchicon} freelancerlist${searchicon} end-0 morecssside`}>
          <FontAwesomeIcon
            className={`arrow start-0`}
            icon={faArrowRight}
            onClick={searchclickednot}
          />
        </div>

        <div className="freelist-container">
          {Object.keys(readData)
            .sort((a, b) => (a === "Others" ? 1 : b === "Others" ? -1 : 0))
            .map((category) => (
              <div key={category} className="category-section">
                <div className="taskblock catagory">{category}</div>
                {readData[category].map((data) => (
                  <div
                    key={data._id}
                    onClick={() => handleclick(data._id)}
                    className="free-list"
                  >
                    <div>
                      <img
                        className="ppf"
                        src={
                          data.freelancerprofile.profilepic === "" ||
                          data.freelancerprofile.profilepic === null
                            ? `/image/profile.jpg`
                            : getProfilePicUrl(data.freelancerprofile.profilepic)
                        }
                        alt="Profile"
                      />
                      <p className="titles">{data.freelancerprofile.title}</p>
                    </div>

                    <div className="rating">
                      {generateStars(data.freelancerprofile.rating)}
                    </div>

                    <p className="namef">{data.Fullname}</p>
                    <p>
                      {data.freelancerprofile.gudayhistory.jobs
                        ? data.freelancerprofile.gudayhistory.jobs
                        : 0}{" "}
                      jobs in GudayHub
                    </p>

                    {data.freelancerprofile.skills.map((skill, key) =>
                      key <= 1 ? (
                        <div className="skills freelist-skill" key={key}>
                          <p>{skill}</p>
                        </div>
                      ) : null
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
