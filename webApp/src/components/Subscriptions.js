import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

function Devices(props) {
  const { user = {} } = props;

  return (
    <div className='row mt-5'>
      <div className='col-3'></div>
      <div className='col-6'>
        <h3 className='mb-3'>Available Publications</h3>
        {!user.devices && <div>No devices registered</div>}
        {user.devices.map((device) => {
          return (
            <>
              <Button
                variant='outline-secondary'
                style={{ float: 'right' }}
                onClick={() => {
                  props.history.push(`/devices/${device.mac_address}`);
                }}>
                Configure
              </Button>
              <div>{device.friendly_name}</div>
              <div>Mac Address: {device.mac_address}</div>

              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default withRouter(connect(mapStateToProps)(Devices));
