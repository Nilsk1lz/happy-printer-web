import React, { useState, useEffect } from 'react';
import SubscribeButton from './SubscribeButton';
import UnsubscribeButton from './UnsubscribeButton';

export default function PublicationSubscriptionOptions({ publication, user, handleSubscribe, handleUnsubscribe }) {
  const [printer, setPrinter] = useState();

  if (!user) return <h5 className='mt-5'>Please login to subscribe to this publication</h5>;

  useEffect(() => {
    if (user && user.devices.length === 1) {
      setPrinter(user.devices[0]);
    }
  });

  const hasSubscription = (printer) => {
    const { apps } = printer;
    if (!apps) return false;
    if (Object.keys(apps).includes(publication._id)) return true;
    return false;
  };

  return (
    <>
      {user.devices.length > 1 ? (
        <Form.Control
          as='select'
          className='my-3'
          onChange={({ target }) => {
            setPrinter(target.value);
          }}>
          <option>Select Printer</option>
          {user.devices.map((device) => {
            return <option value={device}>{`${device.friendly_name} (${device.mac_address})`}</option>;
          })}
        </Form.Control>
      ) : null}
      {printer && !hasSubscription(printer) ? (
        <SubscribeButton
          handleSubscribe={() => {
            handleSubscribe({ device: printer });
          }}
        />
      ) : (
        <UnsubscribeButton
          handleUnsubscribe={() => {
            handleUnsubscribe({ device: printer });
          }}
        />
      )}
    </>
  );
}
