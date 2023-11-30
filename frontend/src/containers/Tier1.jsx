import React, { useState, useEffect } from 'react';
import Tier1Card from './Tier1Card';

const Tier1 = ({ user }) => {
  const [areas, setAreaCodes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreaCodes = async () => {
      try {
        const userToken = localStorage.getItem('access');

        const response = await fetch('http://localhost:8000/get-area-codes/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch area codes');
        }

        const data = await response.json();
        setAreaCodes(data.areas);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAreaCodes();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {Array.isArray(areas) && areas.map((area, index) => (
        <Tier1Card key={index} area={area} />
      ))}
    </div>
  );
};

export default Tier1;
