import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SCMTokenData extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  static propTypes = {

  };



  render() {
    return (
      <div>
        <p>SCM Balance: {this.props.balance || "Loading"}</p>
        <p>SCM Balance to Claim: {this.props.claimable || "Loading"}</p>
      </div>
    );
  }
}


