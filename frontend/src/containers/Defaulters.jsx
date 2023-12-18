import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DefaulterCard from './DefaulterCard';

const Defaulters = ({ isAuthenticated }) => {
  const [defaulterList, setDefaulterList] = useState([]);
  const [error, setError] = useState(null);

  const { area_code } = useParams();
  const { city_code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const area_name = searchParams.get('area_name');
  const officer_name = searchParams.get('officer_name');
  const user_role = searchParams.get('user_role');

  useEffect(() => {
    const fetchDefaulters = async () => {
      try {
        const userToken = localStorage.getItem('access');

        const response = await fetch(`${process.env.REACT_APP_API_URL}/get-defaulters/${city_code}/${area_code}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch defaulters');
        }

        const data = await response.json();
        setDefaulterList(data.defaulters);
      } catch (error) {
        setError(error.message);
      }
    };

    if (isAuthenticated) {
      fetchDefaulters();
    } else {
      navigate('/');
    }
  }, [city_code,area_code, isAuthenticated, navigate]);

  return (
    <div>
      <div className='mt-4'>
      <h1 className='display-4 text-center'>DEFAULTERS LIST</h1>
      </div>
      {error && <p>Error: {error}</p>}
        <div className='mt-3 '>
          <div className="d-flex align-items-center justify-content-center">
          <div style={cardStyle} className='card col p-3'>
          <h3 className='display'>Area Code: {area_code}</h3>
          <h3 className='display'>Area Name: {area_name}</h3>
          {officer_name && <h3 className='display'>Tier 2 Officer Name: {officer_name}</h3>}
          </div>
          </div>
        </div>
      <div className="container-fluid mt-3">
      <div className="row justify-content-center">
      {defaulterList.map((defaulter, index) => (
        <DefaulterCard key={index} defaulter={defaulter} user_role={user_role}/>
      ))}
      </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#96B6C5',
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
  });
  
  export default connect(mapStateToProps)(Defaulters);