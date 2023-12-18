import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js';

const GraphComponentHourly = ({ consumer_number, target_date }) => {
  const userToken = localStorage.getItem('access');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-consumption-history-hourly/${consumer_number}/?date=${target_date}`, {
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
  }, [consumer_number, userToken, target_date]);

  const createGraph = data => {
    const ctx = document.getElementById('charthourly').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(entry => entry.time),
        datasets: [{
          label: 'Consumption',
          data: data.map(entry => entry.consumption),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        }],
      },
      options: {
        scales: {
          x: {
            type: 'category',
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
        <canvas id="charthourly" width="6" height="2"></canvas>
      )}
    </div>
  );
};

export default GraphComponentHourly;
