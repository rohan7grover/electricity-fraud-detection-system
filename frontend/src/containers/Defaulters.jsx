import React from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DefaulterCard from './DefaulterCard';
import '../css/DefaulterCard.css';

const Defaulters = ({ isAuthenticated }) => {
    const { area_code } = useParams();
    const navigate = useNavigate();
    const defaulterIDS = ['123', '456', '567'];

    if (!isAuthenticated) {
        navigate('/');
    }

    return (
        <div>
        <div class='headdefaulter'> 
            <h1>Defaulters</h1>
            <p>Area Code: {area_code}</p>
        </div>
        <div class='cardsDiv'>
            {defaulterIDS.map((uid, index) => (
                <DefaulterCard key={index} uid={uid} />
            ))}
        </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Defaulters);