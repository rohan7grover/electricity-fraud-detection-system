import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/consumerslist.css';

const ConsumerCard = ({ uid }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/consumer/${uid}`);
  };

  return (
    <div class="cardStyleconsumer" onClick={handleClick}>
      <h3>Consumer ID: {uid}</h3>
    </div>
  );
};


export default ConsumerCard;