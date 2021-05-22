import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import Publication from '../components/Publication/Publication';
import PublicationSubscriptionOptions from '../components/Publication/PublicationSubscriptionOptions';
import { setUser } from '../redux/actions';

class Publications extends Component {
  state = {
    publication: null,
    printer: null,
  };

  componentDidMount = () => {
    const { publications } = this.props;
    if (publications) this.getPublication();
  };

  componentDidUpdate = () => {
    this.getPublication();
  };

  getPublication = () => {
    const { match, publications, user } = this.props;
    const { publication } = this.state;

    if (match.params.id && publications.length && !publication) {
      const pub = publications.find((p) => p._id.toString() === match.params.id);

      if (pub) this.setState({ publication: pub });
    }
  };

  handleSubscribe = ({ device }) => {
    const { user, setUser } = this.props;
    const { publication } = this.state;
    if (!device.apps) device.apps = {};
    device.apps[publication._id] = {
      subscibed: true,
    };

    Axios.put(`/api/devices/${device.mac_address}`, device)
      .then(({ data }) => {
        user.devices.splice(user.devices.indexOf(device), 1, data);
        setUser(user);
        this.props.history.push(`/devices/${device.mac_address}`);
      })
      .catch((err) => console.log(err));
  };

  handleUnsubscribe = ({ device }) => {
    const { user } = this.props;
    const { publication } = this.state;
    device.apps[publication._id] = undefined;
    delete device.aps[publication._id];

    Axios.put(`/api/devices/${device.mac_address}`, device)
      .then(({ data }) => {
        // if (data) setDevice(data);
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { publication } = this.state;
    const { user } = this.props;
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-8'>
            {publication && (
              <>
                <Publication publication={publication} />
                <PublicationSubscriptionOptions
                  publication={publication}
                  user={user}
                  handleSubscribe={this.handleSubscribe}
                  handleUnsubscribe={this.handleUnsubscribe}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

function mapStateToProps(state) {
  return { publications: state.publications, user: state.user };
}

export default connect(mapStateToProps, mapDispatchToProps)(Publications);
