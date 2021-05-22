import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import { setUser } from '../redux/actions';

const getUser = (token) => {};

const LoginProvider = (props) => {
  const { user, children, setUser } = props;

  if (!user) {
    const token = localStorage.getItem('token');
    console.log('Got token: ', token);

    if (token) {
      Axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
      Axios.get('/api/user').then(({ data }) => {
        if (data) {
          setUser(data);
        }
      });
    } else {
      props.history.push('/login');
    }
  }

  return user ? <div>{children}</div> : <div></div>;
};

function mapStateToProps(state) {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginProvider));
