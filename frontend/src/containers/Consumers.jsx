import React from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ConsumerCard from './ConsumerCard';
import '../css/consumerslist.css';

const Consumers = ({ isAuthenticated }) => {
    const { area_code } = useParams();
    const navigate = useNavigate();
    const consumerIDS = ['123', '456', '567'];

    if (!isAuthenticated) {
        navigate('/');
    }

    return (
        <div>
        <div className='headconsumer'>
        <h1>Consumers</h1>
        <p>Area Code: {area_code}</p>
        </div>
        <div className='cardsconsumer'>
        {consumerIDS.map((uid, index) => (
            <ConsumerCard key={index} uid={uid} />
        ))}
        </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Consumers);