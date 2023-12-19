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
                    <div className='mt-4'> 
                    <h1 style={h1color} className='display-4 text-center'>TIER-3 DASHBOARD</h1>
                    </div>
                    <div className='mt-3'>
                    <div className="d-flex align-items-center justify-content-center">
                    <div style={cardStyle} className='card col p-3'>
                    <h3 className='display'>Officer Name: {user ? user.name : ''}</h3>
                    <h3 className='display'>Email: {user ? user.email : ''}</h3>
                    </div>                    
                    </div>
                    </div>
                </div>
            )}
            <div className='mt-4 mb-4 ml-5'>
            <h2 style={h1color} className='display-5 text-left'>PENDING RAIDS</h2>
            </div>
            <div className='container-fluid mt-3 mb-3'>
            <div className='justify-content-center'>
            <div style={pending} className="col-12">
            {Array.isArray(pendingRaids) && pendingRaids.map((raid, index) => (
                <Tier3Card key={index} consumerNumber={raid.consumer_number} />
            ))}
            </div>
            </div>
            </div>        
            </div>
    );
};

const cardStyle = {
    backgroundColor: '#96B6C5',
    color: '#eeeeee',
};
const pending = {
    textAlign:'center',
    color:'#116A7B',
};

const h1color = {
    color: '#116A7B'
};
export default Tier3;