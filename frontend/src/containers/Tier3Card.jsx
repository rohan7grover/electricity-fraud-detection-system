import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tier3Card = ({ consumerNumber }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/make-report/${consumerNumber}`);
  };

  return (
    <div style={cardStyle} onClick={handleClick}>
      <h3>Consumer Number: {consumerNumber}</h3>
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

export default Tier3Card;