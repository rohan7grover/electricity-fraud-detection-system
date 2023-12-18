import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tier1Card = ({ area, user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/defaulters/${area?.city_code || ''}/${area?.area_code || ''}?area_name=${encodeURIComponent(area?.area_name || '')}&officer_name=${encodeURIComponent(area?.tier2_officer.name || '')}&user_role=${user.role}`);
  };
  return (
    <div style={cardStyle} onClick={handleClick}>
      <h3>Area Code: {area.area_code}</h3>
      <h3>Area Name: {area.area_name}</h3>
      <h3>Number of Defaulters: {area.defaulter_count}</h3>
    </div>
  );
};

const cardStyle = {
  cursor: 'pointer',
  border: '1px solid #ddd',
  padding: '10px',
  margin: '10px',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
};

export default Tier1Card;
