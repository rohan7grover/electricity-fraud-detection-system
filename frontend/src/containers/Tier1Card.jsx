import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tier1Card = ({ area }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/defaulters/${area.area_code}`);
  };
  

  return (
    <div style={cardStyle} onClick={handleClick}>
      <h3>Area Code: {area.area_code}</h3>
      <h3>Area Name: {area.area_name}</h3>      
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
