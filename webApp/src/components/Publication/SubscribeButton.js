import React from "react";
import { Button } from "react-bootstrap";

export default function SubscripeButton({ handleSubscribe }) {
  return (
    <Button onClick={handleSubscribe} className="mt-5 login-button">
      SUBSCRIBE
    </Button>
  );
}
