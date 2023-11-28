import React from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ConsumerCard from './ConsumerCard';

const Consumers = ({ isAuthenticated }) => {
    const { area_code } = useParams();
    const navigate = useNavigate();
    const consumerIDS = ['123', '456', '567'];

    if (!isAuthenticated) {
        navigate('/');
    }

    return (
        <div>
            <h1>Consumers</h1>
            <p>Area Code: {area_code}</p>

            {consumerIDS.map((uid, index) => (
                <ConsumerCard key={index} uid={uid} />
            ))}
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Consumers);