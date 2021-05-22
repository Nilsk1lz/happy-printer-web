import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import qs from 'qs';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

function Patreon(props) {
  const { user = {} } = props;

  const [loading, setLoading] = useState(false);

  const linkAccount = () => {
    window.location.href =
      'https://www.patreon.com/oauth2/authorize?response_type=code&client_id=J1LOaeORU64BNqNo1uZZHmDgSpEq8bjzEiCRSYFtaBCm4ac5sAEHGsRKV3H_BvIT&redirect_uri=https://happy-printer.co.uk/account';
  };

  const getPatreonCode = () => {
    const { location } = props;

    if (location && location.search) {
      const search = qs.parse(location.search.replace('?', ''));
      if (search.code) {
        setLoading(true);
        Axios.get(`/api/oauth?code=${search.code}`)
          .then(({ data }) => {})
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  useEffect(() => getPatreonCode());

  return (
    <div className='row mt-5'>
      <div className='col-3'></div>
      <div className='col-6'>
        <h3>Patreon Account</h3>
        {!user.patreon && (
          <>
            <div>Patreon account not linked. In order to register for publications please link your account below.</div>
            <Button className='mt-3 button-login' onClick={linkAccount} disabled={loading}>
              LINK ACCOUNT
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default withRouter(connect(mapStateToProps)(Patreon));
