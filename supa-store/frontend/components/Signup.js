import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!,
    $password: String!,
    $name: String!
  ) {
    signup(
      email: $email,
      name: $name,
      password: $password
    ) {
      id,
      name,
      email
    }
  }
`

class Signup extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    }

    saveToState = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    onSubmit = e => {
      e.preventDefault();
      
    }
  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
      >
        {(signup, {error, loading}) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await signup();
                // reset the state of component
                this.setState({name: '', password: '', email: ''})
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Signup to create an account</h2>
                  {error && <Error  />}
                  <label htmlFor="email">
                      Email
                      <input
                          type="text"
                          name="email"
                          placeholder="email"
                          value={this.state.email}
                          onChange={this.saveToState}
                          />
                  </label>
                  <label htmlFor="name">
                      Name
                      <input
                          type="text"
                          name="name"
                          placeholder="name"
                          value={this.state.name}
                          onChange={this.saveToState}
                          />
                  </label>
                  <label htmlFor="password">
                      Password
                      <input
                          type="password"
                          name="password"
                          placeholder="password"
                          value={this.state.password}
                          onChange={this.saveToState}
                          />
                  </label>
                  <input type="submit" value="Signup" />
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
      
    )
  }
}

export default Signup;