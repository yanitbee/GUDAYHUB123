import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/freelancerlist.css';
import { useTranslation } from 'react-i18next';

export default function Freelancerlist() {
  const [readData, setreadData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/employer/readfromserver');
        setreadData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const handleclick = (userid) => {
    navigate('Freelancerdetails', { state: { userid: userid } });
  };

  const filteredData = readData.filter((data) => data.Usertype === 'freelancer');

  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };

  return (
    <>
      <div className="container">
        {filteredData.map((data) => (
          <div key={data._id} onClick={() => handleclick(data._id)} className="freelist">
            <div>
              <img
                className="ppf"
                src={
                  data.freelancerprofile.profilepic === '' || data.freelancerprofile.profilepic === null
                    ? '/image/profile.jpg'
                    : getProfilePicUrl(data.freelancerprofile.profilepic)
                }
                alt="Profile"
              />
              <h3 className="textf">{t('Name')}</h3>
              <p className="titlef">{data.Fullname}</p>
            </div>
            <h3 className="textf">{t('Username')}</h3>
            <p className="titlef">{data.username}</p>
            <h3 className="textf">{t('Email')}</h3>
            <p className="titlef">{data.Email}</p>
          </div>
        ))}
      </div>
    </>
  );
}
