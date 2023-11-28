import React from 'react';

const Tier3 = ({ user }) => {
    return (
        <div>
            <h1>Tier3</h1>
            <p>Name: {user ? user.id : ''}</p>
            <p>Name: {user ? user.name : ''}</p>
            <p>Email: {user ? user.email : ''}</p>
            <p>Role: {user ? user.role : ''}</p>
        </div>
    );
};

export default Tier3;