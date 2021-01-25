import React, { Component } from "react";

export default class displaysquats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sq: this.props.squats,
    };
  }
  handleChange(e) {
    console.log("f called");
  }

  render() {
    return (
      <div>
        <h1
          onChange={(e) => {
            this.handleChange(e);
          }}
        >
          {this.state.sq}
        </h1>
      </div>
    );
  }
}
