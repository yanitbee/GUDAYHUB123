import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../Hooks/UseAuth';
import './complaint.css';

export default function Testimony() {
  const { getUserData, getUserToken } = useAuth();

  const userData = getUserData();
  const token = getUserToken();

  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    setCurrentDateTime(formattedDate);
  }, []);

  const [rating, setRating] = useState(0);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      const formObject = Object.fromEntries(formData.entries());
      formObject.Userid = userData.userID;
      formObject.Date = currentDateTime;
      formObject.rating = rating;

      const response = await axios.post(
        'http://localhost:4000/testimony/writetestimony',
        formObject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fs-frm-inputs">
        
      <label htmlFor="text">Testimony</label>
        <textarea
          rows="6"
          name="text"
          className="complaints"
          placeholder="Enter your Testimony"
          required
        ></textarea>

        <label htmlFor="">Rate Us</label>
        <div className="ratings ">
                <input
                  value="5"
                  name="rate"
                  id="star5"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star5"></label>
                <input
                  value="4"
                  name="rate"
                  id="star4"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star4"></label>
                <input
                  value="3"
                  name="rate"
                  id="star3"
                  type="radio"
                 checked=""
                  onChange={handleRatingChange}
                />
                <label title="text" for="star3"></label>
                <input
                  value="2"
                  name="rate"
                  id="star2"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star2"></label>
                <input
                  value="1"
                  name="rate"
                  id="star1"
                  type="radio"
                  onChange={handleRatingChange}
                />
                <label title="text" for="star1"></label>
              </div>


        <input
          type="hidden"
          name="_subject"
          className="email-subject hidden"
          value="Complaint Form Submission"
        />
      </fieldset>
      <input type="submit" value="Send Testimony" />
    </form>
  );
}

