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
      <h1>Defaulters</h1>
      {<p>Area Code: {area_code}</p>}
      {<p>Area Name: {area_name}</p>}
      {officer_name && <p>Tier 2 Officer Name: {officer_name}</p>}
      {error && <p>Error: {error}</p>}
      {defaulterList.map((defaulter, index) => (
        <DefaulterCard key={index} defaulter={defaulter} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
  });
  
  export default connect(mapStateToProps)(Defaulters);