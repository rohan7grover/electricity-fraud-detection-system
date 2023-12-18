import React from 'react';
import { useNavigate } from 'react-router-dom';

const DefaulterCard = ({ defaulter, user_role }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/consumer/${defaulter.consumer_number.consumer_number}?user_role=${user_role}`);
  };

  return (
    <div style={cardStyle} onClick={handleClick}>
      <h3>Consumer ID: {defaulter.consumer_number.consumer_number}</h3>
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

export default DefaulterCard;