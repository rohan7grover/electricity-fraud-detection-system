import React from 'react';
import { useNavigate } from 'react-router-dom';

const DefaulterCard = ({ defaulter, user_role }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/consumer/${defaulter.consumer_number.consumer_number}?user_role=${user_role}`);
  };

  return (
    <div style={cardStyle} className='card col-md-3 col-12' onClick={handleClick}>
      <h2 className='text-center'>Consumer ID: {defaulter.consumer_number.consumer_number}</h2>
    </div>
  );
};

const cardStyle = {
  cursor: 'pointer',
  border: '1px solid #ddd',
  padding: '10px',
  margin: '10px',
  borderRadius: '10px',
  color: '#116A7B'
};

export default DefaulterCard;