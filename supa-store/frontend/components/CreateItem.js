import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import Router from 'next/router'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION (
    $title: String!,
    $description: String!,
    $price: Int!,
    $image: String,
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

 class CreateItem extends Component {
  state = {
    title: 'cool shoes',
    description: 'best shoes',
    image: 'dog.jpg',
    largeImage: 'largeDog.jpg',
    price: 0
  }

  handleChange = (e) => {
    e.persist()
    const {name, type, value} = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState(() => ({
      [name]: val
    }))
    // this.setState({title: e.target.value})
  }

  onSubmit =e => {
    e.preventDefault()
    const res = createItem()
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}
      >
        {(createItem, {loading, error, called, data}) => (
          <Form onSubmit={async (e) => {
            e.preventDefault();
            const res = await createItem();
            Router.push({
              pathname: '/item',
              query: {id: res.data.createItem.id}
            })
          }}>
            <ErrorMessage error={error} />
            <fieldset
              disabled={loading}
              aria-busy={loading}
            >
              <label htmlFor="title">
                Title
                <input onChange={this.handleChange} value={this.state.title} type="text" id="title" name="title" placeholder="Title" required />
              </label>
              <label htmlFor="price">
                Price
                <input onChange={this.handleChange} value={this.state.price} type="number" id="price" name="price" placeholder="Price" required />
              </label>
              <label htmlFor="description">
                Description
                <textarea onChange={this.handleChange} value={this.state.description} type="text" id="description" name="description" placeholder="Enter a description" required/>
              </label>
              <button type="submit">Submit</button>
              </fieldset>
            </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem
export { ALL_ITEMS_QUERY, CREATE_ITEM_MUTATION }