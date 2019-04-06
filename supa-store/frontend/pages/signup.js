import React, { Component } from 'react';
import Signup from '../components/Signup';
import styled from 'styled-components';

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
`


export default class SignupPage extends Component {
  render() {
    return (
      <Columns>
        <Signup />
        <Signup />
        <Signup />
      </Columns>
    );
  }
}
