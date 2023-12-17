import React from 'react';
import { useNavigate } from 'react-router-dom';


const Tier1Card = ({ areaCode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/defaulters/${areaCode}`);
  };

  return (
    <div class='cardstyle' onClick={handleClick}>
      <h4>Area Code: {areaCode}</h4>
      <h4>Area Name: urban estate</h4>
      <h4>Number of Defaulters: 30</h4>
    </div>
  );
};

export default Tier1Card;