import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { setUser } from "../redux/actions";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const times = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

function Devices(props) {
  const { user, publications, setUser } = props;

  const [device, setDevice] = useState({});
  const [apps, setApps] = useState({});

  useEffect(() => {
    console.log("Props changed");
    const { match } = props;
    if (match) {
      const device = user.devices.find(
        (device) => device.mac_address === match.params.mac_address
      );
      setDevice(device);
      setApps(device.apps);
    }
  }, [user, props]);

  const handleChange = (value) => {
    device.print_time = value;
    setDevice(device);
    updateDevice(device);
  };

  const updateDevice = (device) => {
    console.log(user);
    Axios.put(`/api/devices/${device.mac_address}`, device)
      .then(({ data }) => {
        if (data) setDevice(data);
      })
      .catch((err) => console.log(err));
  };

  const removePublication = (publication) => {
    const { _id: id } = publication;
    device.apps[id] = undefined;

    Axios.put(`/api/devices/${device.mac_address}`, device).then(({ data }) => {
      console.log("DATA: ", data);
      setDevice(data);
      user.devices.splice(user.devices.indexOf(device), 1, data);
      setUser({ ...user });
    });
  };

  const updateObjectInArray = (array, action) => {
    return array.map((item, index) => {
      if (index !== action.index) {
        // This isn't the item we care about - keep it as-is
        return item;
      }

      // Otherwise, this is the one we want - return an updated value
      return {
        ...item,
        ...action.item,
      };
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <h3>{device.friendly_name}</h3>
          <div>Mac Address: {device.mac_address}</div>
          <h3 className="mt-5">Schedule</h3>
          <div>Schedule a printout</div>
          <Form.Control
            as="select"
            className="my-3"
            value={device.print_time}
            onChange={({ target }) => {
              handleChange(target.value);
            }}
          >
            <option>Select Time</option>
            {times.map((time) => {
              return <option key={time}>{time}</option>;
            })}
          </Form.Control>
          <h3 className="mt-5">Subscriptions</h3>
          {!apps
            ? "You've not subscribed to any publications yet"
            : Object.keys(apps).map((id) => {
                const publication = publications.find((pub) => pub._id === id);
                if (!publication) return null;
                return (
                  <div key={publication._id}>
                    <Button
                      variant="outline-secondary"
                      style={{ float: "right" }}
                      onClick={() => {
                        removePublication(publication);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <div className="bold">{publication.name}</div>
                    <div>{publication.cron_description}</div>
                    <hr />
                  </div>
                );
              })}
          <Button
            className="button-login"
            onClick={() => {
              props.history.push(`/publications`);
            }}
          >
            ADD PUBLICATION
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <textarea rows="4" cols="10" style={{ fontSize: "100px" }} />
        </div>
      </div>
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6">
          <Button className="button-login">SEND INSTANT MESSAGE</Button>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { user: state.user, publications: state.publications };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
