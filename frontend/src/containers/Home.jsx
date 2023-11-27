import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { load_user } from '../actions/auth';
import { Link } from 'react-router-dom';

const Home = ({ isAuthenticated, user, load_user }) => {
  useEffect(() => {
    load_user();
  }, [load_user]);

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user ? user.name : 'User'}!</h2>
          <p>Email: {user ? user.email : ''}</p>
          <p>Role: {user ? user.role : ''}</p>
        </div>
      ) : (
        <div className='container'>
          <div class='jumbotron mt-5'>
            <h1 class='display-4'>Welcome to Auth System!</h1>
            <p class='lead'>This is an incredible authentication system with production level features!</p>
            <hr class='my-4' />
            <p>Click the Log In button</p>
            <Link class='btn btn-primary btn-lg' to='/login' role='button'>Login</Link>
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