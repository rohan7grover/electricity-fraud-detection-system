import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tier1Card = ({ area, user}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/defaulters/${area?.city_code || ''}/${area?.area_code || ''}?area_name=${encodeURIComponent(area?.area_name || '')}&officer_name=${encodeURIComponent(area?.tier2_officer.name || '')}&user_role=${user.role}`);
  };

  const determineBackgroundColor = () => {
    const defaulterCount = area.defaulter_count || 0;

    if (defaulterCount <= 13) {
      return '#41AAA8'; // Green
    } else if (defaulterCount < 18) {
      return '#FCE38A'; // Orange
    } else {
      return '#F38181'; // Red
    }
  };

  const cardStyle = {
    cursor: 'pointer',
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: determineBackgroundColor(),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={cardStyle} className='card col-lg-3 col-md-4 col-8 mx-4 p-2 mt-4 align-middle' onClick={handleClick}>
      <h4 className='display-5 text-center'>Area Code: {area.area_code}</h4>
      <h4 className='display-5 text-center'>Area Name: {area.area_name}</h4>
      <h4 className='display-5 text-center'>Number of Defaulters: {area.defaulter_count}</h4>
    </div>
  );
};

export default Tier1Card;
