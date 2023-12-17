import React, { useState, useEffect } from 'react';
import Tier3Card from './Tier3Card';

const Tier3 = ({ user }) => {
    const [pendingRaids, setPendingRaids] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingRaids = async () => {
            try {
                const userToken = localStorage.getItem('access');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/get-details/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${userToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pending raids');
                }

                const data = await response.json();
                setPendingRaids(data.pending_raids);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPendingRaids();
    }, []);

    return (
        <div>
            {error && <p>Error: {error}</p>}
            {user && (
                <div>
                    <h1>Tier3</h1>
                    <p>Name: {user ? user.id : ''}</p>
                    <p>Name: {user ? user.name : ''}</p>
                    <p>Email: {user ? user.email : ''}</p>
                </div>
            )}
            {Array.isArray(pendingRaids) && pendingRaids.map((raid, index) => (
                <Tier3Card key={index} consumerNumber={raid.consumer_number} />
            ))}
        </div>
    );
};

export default Tier3;