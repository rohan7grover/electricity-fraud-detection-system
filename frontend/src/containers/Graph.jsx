import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js';

const GraphComponent = ({ consumer_number }) => {
  const userToken = localStorage.getItem('access');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-consumption-history/${consumer_number}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${userToken}`,
      },
    })
      .then(response => {
        setError(null);
        createGraph(response.data.consumption_history);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          setError('Consumer Details not Found');
        } else {
          console.error('Error fetching data:', error);
        }
      });
  }, [consumer_number, userToken]);

  const createGraph = data => {
    const ctx = document.getElementById('myChart').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.slice(1).map((entry, index) => `Week ${index + 1}`),
        datasets: [{
          label: 'Total Consumption',
          data: data.slice(1).map(entry => entry.total_consumption),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        }],
      },
      options: {
        scales: {
          x: {
            type: 'category',
            labels: data.slice(1).map((entry, index) => `Week ${index + 1}`),
            position: 'bottom',
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Consumption',
            },
          },
        },
      },
    });
  };

  return (
    <div>
      {error ? (
        <h3>{error}</h3>
      ) : (
        <canvas id="myChart" width="6" height="2"></canvas>
      )}
    </div>
  );
};

export default GraphComponent;
