import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

function Devices(props) {
  const { user = {} } = props;

  return (
    <div className="row mt-5">
      <div className="col-3"></div>
      <div className="col-6">
        <h3 className="mb-3">Registered Devices</h3>
        {!user.devices && <div>No devices registered</div>}
        {user.devices &&
          user.devices.length &&
          user.devices.map((device) => {
            return (
              <div key={device._id}>
                <Button
                  variant="outline-secondary"
                  style={{ float: "right" }}
                  onClick={() => {
                    props.history.push(`/devices/${device.mac_address}`);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    onClick={() => {
                      props.history.push(`/devices/${device.mac_address}`);
                    }}
                  />
                </Button>
                <div>{device.friendly_name}</div>
                <div>Mac Addess: {device.mac_address}</div>

                <hr />
              </div>
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
