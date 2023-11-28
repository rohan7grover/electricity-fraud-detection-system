import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tier1Card = ({ areaCode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/defaulters/${areaCode}`);
  };

  return (
    <div style={cardStyle} onClick={handleClick}>
      <h3>Area Code: {areaCode}</h3>
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