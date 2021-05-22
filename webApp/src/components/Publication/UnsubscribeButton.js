import React from "react";
import { Button } from "react-bootstrap";

export default function UnsubscripeButton({ handleUnsubscribe }) {
  return (
    <Button onClick={handleUnsubscribe} className="mt-5 login-button">
      UNSUBSCRIBE
    </Button>
  );
}
