import React from 'react';
import Tier1Card from './Tier1Card';
import '../css/tier1card.css';


const Tier1 = ({ user }) => {
  const areaCodes = ["123", "456", "658", "765", "101","124","123", "456", "658", "765", "101","124","123", "456", "658", "765", "101","124"];

  return (
    <div>
      <div className='head1'>
        <h1 className='center-align1'>Tier1 Dashboard</h1>
        <h3>City: Jalandhar</h3>
        <h3>Officer Name: Jashan Arora</h3>
      </div>

      <div className='card-container'>
        {areaCodes.map((areaCode, index) => (
          <Tier1Card key={index} areaCode={areaCode} />
        ))}
      </div>
    </div>
  );
};

export default Tier1;