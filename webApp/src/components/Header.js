import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import { slide as Menu } from 'react-burger-menu';
import { Button } from 'react-bootstrap';
import { setPublications, setUser } from '../redux/actions';

class Header extends Component {
  componentDidMount = () => {
    this.getPublications();
  };

  getPublications = () => {
    Axios.get('/api/publications')
      .then(({ data }) => {
        this.props.setPublications(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <>
        {this.props.isMobile && (
          <Menu htmlClassName='hide-desktop' pageWrapId={'page-wrap'}>
            <a id='home' className='menu-item' href='/'>
              Home
            </a>
            <a id='about' className='menu-item' href='/shop'>
              Shop
            </a>
            <a id='contact' className='menu-item' disabled href='/account'>
              My Account
            </a>
          </Menu>
        )}
        <div className='header'>
          <div
            onClick={() => {
              this.props.history.push('/');
            }}
            className='header-title'>
            Happy Printer
          </div>
          {!this.props.isMobile && (
            <>
              <Button
                className='btn-primary'
                style={{
                  right: '20px',
                  float: 'right',
                  position: 'absolute',
                  marginTop: '30px',
                }}>
                <Link to='/account'>MY ACCOUNT</Link>
              </Button>
              <Button
                className='btn-primary'
                style={{
                  right: '160px',
                  float: 'right',
                  position: 'absolute',
                  marginTop: '30px',
                }}>
                <Link to='/shop'>SHOP</Link>
              </Button>
            </>
          )}
        </div>
        <div className='header-shadow'></div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    setPublications: (publications) => dispatch(setPublications(publications)),
    setUser: (user) => dispatch(setUser(user)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(Header));
