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
      <div className='mt-4'>
      <h1 style={h1color} className='display-4 text-center'>TIER-1 DASHBOARD</h1>
      </div>
      {error && <p>Error: {error}</p>}
      {userDetails && (
        <div className='mt-3 '>
          <div className="d-flex align-items-center justify-content-center">
          <div style={cardStyle} className='card col p-3'>
          <h3 className='display'>Officer Name: {user ? user.name : ''}</h3>
          <h3 className='display'>City Name: {userDetails.city_name}</h3>
          <h3 className='display'>City Code: {userDetails.city_code}</h3>
          </div>
          </div>
        </div>
      )}
      <div className="container-fluid">
      <div className='row justify-content-center'>
      {Array.isArray(areas) && areas.map((area, index) => (
        <Tier1Card key={index} area={area} user={user}/>
      ))}
      </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#96B6C5',
  color: '#eeeeee'
};

const h1color = {
  color: '#116A7B'
};

export default Tier1;
