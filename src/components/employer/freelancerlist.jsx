import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/freelancerlist.css";
import { useTranslation } from "react-i18next";
import BackButton from "../BackButton"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowRight,faMinus,faPlus } from "@fortawesome/free-solid-svg-icons";
import debounce from 'lodash.debounce';

export default function Freelancerlist() {
  const [readData, setReadData] = useState({});
  const { t } = useTranslation();
  const [searchIcon, setSearchIcon] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [title, settitle] = useState("");
  const defaluttitle = ["Developer", "Deliver", "Cleaner","Pick Up"];

  const searchClicked = () => setSearchIcon("active");
  const searchClickedNot = () => setSearchIcon("");

  const handleSearch = (e) => setSearch(e.target.value);

  const debouncedSearch = useCallback(
    debounce(async (search,title) => {
      try {
        const response = await axios.get(
          "http://localhost:4000/employer/readfromserver",
          { params: { serachtitle: `${search}${title}` } }
        );
        const data = response.data;

        // Filter and categorize freelancers
        const freelancers = data.filter(user => user.Usertype === "freelancer" && user.status !== "deleted");
        const defaultCategories = {
          "House Work": ["Cleaner", "Plumber"],
          "IT & Software": ["Developer", "Designer"],
          "Writing & Translation": ["Writer", "Translator"],
          "Transportation": ["Driver", "Delivery", "Pickup", "Bus Driver"]
        };
        const lowerCaseCategories = Object.entries(defaultCategories).reduce((acc, [category, titles]) => {
          acc[category] = titles.map(title => title.toLowerCase());
          return acc;
        }, {});
        const categorizedData = freelancers.reduce((acc, freelancer) => {
          const freelancerTitle = freelancer.freelancerprofile.title ? freelancer.freelancerprofile.title.toLowerCase() : "others";
          let foundCategory = false;
          for (const [category, titles] of Object.entries(lowerCaseCategories)) {
            if (titles.includes(freelancerTitle)) {
              if (!acc[category]) acc[category] = [];
              acc[category].push(freelancer);
              foundCategory = true;
              break;
            }
          }
          if (!foundCategory) {
            if (!acc["Others"]) acc["Others"] = [];
            acc["Others"].push(freelancer);
          }
          return acc;
        }, {});
        setReadData(categorizedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 500), // 500ms debounce delay
    []
  );

  useEffect(() => {
    debouncedSearch(search,title);
  }, [search, debouncedSearch,title]);

  const handleClick = (userid) => {
    navigate("Freelancerdetails", { state: { userid } });
  };

  const getProfilePicUrl = (fileName) => `http://localhost:4000/${fileName}`;

  const generateStars = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2;
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <label key={starValue} className={`${starValue} ${roundedRating >= starValue ? "full-stars" : roundedRating + 0.5 === starValue ? "half-stars" : "no-stars"}`}>
          &#9733;
        </label>
      );
    });
  };

  const isempty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const handletitle = (title) => {
    settitle(title);
    console.log(title);
  };

  const handletitled = () => {
    settitle("");
  };
  
  return (
    <>
      <div className="jobparent">
        <div className={`serachparent`}>
          <FontAwesomeIcon className={`search s${searchIcon} end-0 morecssserch`} icon={faSearch} />
          <input className={`another end-0 morecss`} type="text" placeholder="Search specialties" onChange={handleSearch} onClick={searchClicked} />
        </div>
        <div className={`sidebar${searchIcon} freelancerlist${searchIcon} end-0 morecssside`}>
          <FontAwesomeIcon className={`arrow start-0`} icon={faArrowRight} onClick={searchClickedNot} />
          <br/><br/>
          <div style={{fontWeight:"bold",fontSize:"16px"}}>
              <div className="postsidelist">
              {t("Specialties")}
              </div>
               <br />
              {defaluttitle.map((type) => (
                  title === type ? (
                <>
                  <div className="skills" onClick={handletitled}>
                    <FontAwesomeIcon className="delete" icon={faMinus} />
                    {type}
                  </div>
                </>) : (
                    <div className="skills" style={{color:"#b7fff2"}} onClick={() => {handletitle(type)}}>
                    <FontAwesomeIcon className="delete" icon={faPlus} />
                    {type}
                  </div>
                )
              ))}
            </div>
        </div>
        
        {isempty(readData) ? (
          <div className="nojob">
            <img src="/image/nofreelancer.png" alt="No Freelancer" />
          </div>
        ) : (
          <div className="freelist-container">
            {Object.keys(readData)
              .sort((a, b) => (a === "Others" ? 1 : b === "Others" ? -1 : 0))
              .map((category) => (
                <div key={category} className="category-section">
                  <div className="taskblock catagory">{category}</div>
                  {readData[category].map((data) => (
                    <div key={data._id} onClick={() => handleClick(data._id)} className="free-list">
                      <div>
                        <img className="ppf" src={data.freelancerprofile.profilepic ? getProfilePicUrl(data.freelancerprofile.profilepic) : `/image/profile.jpg`} alt="Profile" />
                        <p className="titles">{data.freelancerprofile.title}</p>
                      </div>
                      <div className="rating">{generateStars(data.freelancerprofile.rating)}</div>
                      <p className="namef">{data.Fullname}</p>
                      <p>{data.freelancerprofile.gudayhistory.jobs ? data.freelancerprofile.gudayhistory.jobs : 0} jobs in GudayHub</p>
                      {data.freelancerprofile.skills.slice(0, 2).map((skill, key) => (
                        <div className="skills freelist-skill" key={key}>
                          <p>{skill}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}  
