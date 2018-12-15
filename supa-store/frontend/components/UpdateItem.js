import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import Router from 'next/router';

// create a query to get the item
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    e.persist();
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState(() => ({
      [name]: val
    }));
    // this.setState({title: e.target.value})
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log(this.state);
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    console.log('updated');
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading) return <p>loading...</p>;
          if (!data.item)
            return <p>there is no data with item with id {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error, called }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    {/* {this.state.image && <img src={this.state.image} alt="uploaded image" width="200"/> } */}
                    <label htmlFor="title">
                      Title
                      <input
                        onChange={this.handleChange}
                        value={this.state.title}
                        defaultValue={data.item.title}
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        onChange={this.handleChange}
                        defaultValue={data.item.price}
                        value={this.state.price}
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                        value={this.state.description}
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Enter a description"
                        required
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? 'ing' : 'e'} changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { ALL_ITEMS_QUERY, UPDATE_ITEM_MUTATION };
