import React, { Component } from 'react';
import SingleItem from '../components/SingleItem';

export default class item extends Component {
  render() {
    return (
      <div>
        <SingleItem id={this.props.query.id} />
      </div>
    );
  }
}
