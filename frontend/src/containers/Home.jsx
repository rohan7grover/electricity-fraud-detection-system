import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { load_user } from '../actions/auth';
import { Link } from 'react-router-dom';
import Tier1 from './Tier1';
import Tier2 from './Tier2';
import Tier3 from './Tier3';
import '../css/Home.css';

const Home = ({ isAuthenticated, user, load_user }) => {
  useEffect(() => {
    load_user();
  }, [load_user]);

  return (
    <div>
      {isAuthenticated ? (
        <div>
          {user && user.role === 'tier1' ? (
            <Tier1 user={user} />
          ) : user && user.role === 'tier2' ? (
            <Tier2 user={user} />
          ) : user && user.role === 'tier3' ? (
            <Tier3 user={user} />
          ) : null}
        </div>
      ) : (
        <div className='container '>
          <div className="d-flex align-items-center justify-content-center">
          
           <div class='jumbotron mt-5 col-10'>
            <h1 class='display-4'>Welcome to Energy Fraud Detection System</h1>
            <hr class='my-4' />
            <p>Click the Log In button to Continue using our Application</p>
            <Link class='btn btn-primary btn-lg mt-3 col-2' to='/login' role='button'>Login</Link>
          </div> 
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { load_user })(Home);