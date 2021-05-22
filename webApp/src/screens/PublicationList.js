import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class Publications extends Component {
  componentDidUpdate = () => {
    const { match } = this.props;
    if (match.params.id && this.state.publications.length && !this.state.publication) {
      const pub = this.state.publications.find((p) => p._id.toString() === match.params.id);
      if (pub) this.setState({ publication: pub });
    }
  };

  render() {
    const { publications = [] } = this.props;
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className='col-md-8'>
            <h3 className='my-5'>Publications</h3>
            <Table responsive='sm'>
              <tbody>
                {publications.map((pub) => {
                  return (
                    <tr key={pub._id}>
                      <td>
                        <h5>{pub.name}</h5>
                        <div>{pub.description}</div>
                      </td>
                      <td>
                        <Button
                          variant='outline-secondary'
                          onClick={() => {
                            this.props.history.push(`/publications/${pub._id}`);
                          }}>
                          <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => {
                              // props.history.push(`/devices/${device.mac_address}`);
                            }}
                          />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { publications: state.publications };
}

export default connect(mapStateToProps)(Publications);
