import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { setUser } from '../redux/actions';

class Login extends Component {
  state = {
    email: '',
    password: '',
    alert: '',
  };

  componentDidUpdate = () => {
    const { user } = this.props;
    if (user) {
      this.props.history.push('/account');
    }
  };

  submitForm = () => {
    if (!this.state.email) {
      this.setState({ alert: 'Please enter a valid email' });
      return;
    }

    if (!this.state.password) {
      this.setState({ alert: 'Please enter a valid password' });
      return;
    }

    const auth = `${this.state.email}:${this.state.password}`;
    const buff = new Buffer(auth);

    Axios.get('/api/login', {
      headers: {
        Authorization: `basic ${buff.toString('base64')}`,
      },
    })
      .then(({ data }) => {
        const { setUser } = this.props;
        if (data) {
          Axios.defaults.headers.common['Authorization'] = `bearer ${data.token}`;
          console.log('Setting token: ', data.token);
          localStorage.setItem('token', data.token);
          setUser({ ...data.devices });
        }
      })
      .catch((err) => {
        if (err.status === 401) this.setState({ alert: 'Incorrect email or password' });
      });
  };

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'></div>
          <div className='col-md-6'>
            <h3 className='mt-5'>Login</h3>
            <Form>
              <Form.Group controlId='formBasicEmail'>
                {this.state.alert && <Alert variant={'danger'}>{this.state.alert}</Alert>}
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={this.state.email}
                  onChange={({ target }) => {
                    this.setState({ email: target.value, alert: '' });
                  }}
                />
              </Form.Group>

              <Form.Group controlId='formBasicPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={({ target }) => {
                    this.setState({ password: target.value, alert: '' });
                  }}
                />
              </Form.Group>
              <Button className='button-login' variant='primary' onClick={this.submitForm}>
                LOGIN
              </Button>
              <Link className='ml-3 btn-link' to='/register' type='submit'>
                Register
              </Link>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
