import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const ApplicationTrends = ({ postId, postedDate }) => {

  //          <ApplicationTrends postId={data._id} postedDate={data.PostedDate} />
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/applicant/readjobapplicant",
          { params: { postid: postId } }
        );

        const data = response.data;

        if (data && data.length > 0) {
          // Extract applied dates and ensure unique dates
          const appliedDates = data.map(app => new Date(app.appliedDate).toLocaleDateString());
          const uniqueAppliedDates = [...new Set(appliedDates)];

          // Include the posted date and applied dates in the x-axis labels
          const labels = [postedDate, ...uniqueAppliedDates];
          const applicationsPerDay = labels.map(date => {
            return date === postedDate ? 0 : appliedDates.filter(d => d === date).length;
          });

          
          if (!labels.includes(postedDate)) {
            labels.unshift(postedDate);
            applicationsPerDay.unshift(0);
          }

          setChartData({
            labels,
            datasets: [
              {
                label: "Number of Applications",
                data: applicationsPerDay,
                fill: false,
                backgroundColor: "blue",
                borderColor: "lightblue",
                borderWidth: 2
                
              }
            ]
          });
        } else {
          console.log("No application data available");
          setChartData({
            labels: [],
            datasets: []
          });
        }
      } catch (error) {
        console.error("Error fetching application data:", error);
      }
    };

    fetchApplicationData();
  }, [postId, postedDate]);

  return (
    <div>

      {chartData.labels && chartData.labels.length > 0 ? (
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                  color: '#fff',
                  font: {
                    size: 14, 
                  }
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Number of Applications',
                  color: '#fff',
                  font: {
                    size: 14, 
                  }
                },
                beginAtZero: true
              }
            },
            backgroundColor: '#ffffff'
          }}
        />
      ) : (
        <p>0 Applicant</p>
      )}
    </div>
  );
};

export default ApplicationTrends;
