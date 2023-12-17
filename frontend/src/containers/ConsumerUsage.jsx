import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import GraphComponent from './Graph';

const ConsumerUsage = ({ isAuthenticated }) => {
    const { uid } = useParams();
    const navigate = useNavigate();

    const [isDefaulter, setIsDefaulter] = useState(true);

    useEffect(() => {
        // Fetch the current defaulter status from the database
        const fetchDefaulterStatus = async () => {
            try {
                // const response = await fetch(`YOUR_API_URL/consumers/${uid}/defaulter-status`);
                // const data = await response.json();
                // setIsDefaulter(data.isDefaulter);
                setIsDefaulter(true);
            } catch (error) {
                console.error('Error fetching defaulter status:', error);
            }
        };

        fetchDefaulterStatus();
    }, [uid]);

    if (!isAuthenticated) {
        navigate('/');
    }

    const handleToggleDefaulterStatus = async () => {
        
        //also write code to delete all PENDING RAIDS FOR THAT CONSUMER ID IN RAID_STATUS TABLE

        try {
            const updatedStatus = !isDefaulter;

            // Make a PUT request to update the defaulter status (replace with your actual API endpoint)
            // await fetch(`YOUR_API_URL/consumers/${uid}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // Add any additional headers as needed
            //     },
            //     body: JSON.stringify({ isDefaulter: updatedStatus }),
            // });

            // Update the local state with the new defaulter status
            setIsDefaulter(updatedStatus);

            // After updating, navigate back
            navigate(-1);
        } catch (error) {
            console.error('Error updating defaulter status:', error);
        }
    };

    return (
        <div>
            <h1>ConsumerUsage</h1>
            <p>Consumer ID: {uid}</p>

            <button onClick={handleToggleDefaulterStatus}>
                {isDefaulter ? 'Remove from Defaulters' : 'Add to Defaulters'}
            </button>
            <GraphComponent consumer_number={uid} />
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ConsumerUsage);