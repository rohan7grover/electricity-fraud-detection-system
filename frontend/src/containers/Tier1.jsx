import React from 'react';
import Tier1Card from './Tier1Card';

const Tier1 = ({ user }) => {

    const areaCodes = ['123', '456'];

    return (
        <div>
            <h1>Tier1</h1>
            <p>Name: {user ? user.id : ''}</p>
            <p>Name: {user ? user.name : ''}</p>
            <p>Email: {user ? user.email : ''}</p>
            <p>Role: {user ? user.role : ''}</p>

            {areaCodes.map((areaCode, index) => (
                <Tier1Card key={index} areaCode={areaCode} />
            ))}
        </div>
    );
};

export default Tier1;


