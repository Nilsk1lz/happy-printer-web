import React from "react";
import { connect } from "react-redux";
import Devices from "../components/Devices";

function Account({ user }) {
  console.log(user);
  return user ? (
    <div className="container">
      <Devices />
      {/* <Subscriptions /> */}
    </div>
  ) : (
    <div></div>
  );
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Account);
