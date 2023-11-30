import React, { useState, useEffect } from 'react';
import Tier1Card from './Tier1Card';

const Tier1 = ({ user }) => {
  const [areas, setAreaCodes] = useState([]);
  const [error, setError] = useState(null);
  const [userDetails, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
        try {
            const userToken = localStorage.getItem('access');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/get-details/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${userToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch area data');
            }

            const data = await response.json();
            setUserData(data.details);
        } catch (error) {
            setError(error.message);
        }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchAreaCodes = async () => {
      try {
        if (userDetails) {
          const userToken = localStorage.getItem('access');

          const response = await fetch(`${process.env.REACT_APP_API_URL}/get-area-codes/${userDetails.city_code}/`, {
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
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAreaCodes();
  }, [userDetails]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {userDetails && (
        <div>
          <p>Name: {user ? user.name : ''}</p>
          <p>City Code: {userDetails.city_code}</p>
          <p>City Name: {userDetails.city_name}</p>
        </div>
      )}
      {Array.isArray(areas) && areas.map((area, index) => (
        <Tier1Card key={index} area={area} />
      ))}
    </div>
  );
};

export default Tier1;
