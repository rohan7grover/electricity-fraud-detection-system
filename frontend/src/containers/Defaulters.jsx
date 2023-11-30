import React from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DefaulterCard from './DefaulterCard';

const Defaulters = ({ isAuthenticated }) => {
  const { area_code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const defaulterIDS = ['123', '456', '567'];

  if (!isAuthenticated) {
    navigate('/');
  }

  const searchParams = new URLSearchParams(location.search);
  const area_name = searchParams.get('area_name');

  return (
    <div>
      <h1>Defaulters</h1>
      <p>Area Code: {area_code}</p>
      <p>Area Name: {area_name}</p>

      {defaulterIDS.map((uid, index) => (
        <DefaulterCard key={index} uid={uid} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Defaulters);