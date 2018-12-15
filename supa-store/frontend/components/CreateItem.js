import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import Router from 'next/router';
import { ALL_ITEMS_QUERY } from './Items';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
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
      title
      description
      price
      image
      largeImage
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  };

  handleChange = e => {
    e.persist();
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState(() => ({
      [name]: val
    }));
    // this.setState({title: e.target.value})
  };

  onSubmit = e => {
    e.preventDefault();
    const res = createItem();
  };

  uploadFile = async e => {
    // grab the file
    const files = e.target.files;
    // create formdata
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'sickfits');
    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dhopribya/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      const image = await res.json();
      this.setState({
        image: image.secure_url,
        largeImage: image.eager[0].secure_url
      });
    } catch (e) {
      console.log(e);
    }
  };

  update = (cache, payload) => {
    // get all the items
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log('data before: ', data);

    const newItem = {
      ...data.createItem
    };
    data.items = [...data.items, newItem];
    console.log('data after: ', { data, newItem });
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}
        update={this.update}
      >
        {(createItem, { loading, error, called, data }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              if (!this.state.image || !this.state.largeImage) {
                alert('item not yet uploaded');
                return;
              }
              const res = await createItem();
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  onChange={this.uploadFile}
                  type="file"
                  id="file"
                  name="file"
                  required
                />
              </label>
              {this.state.image && (
                <img src={this.state.image} alt="uploaded image" width="200" />
              )}
              <label htmlFor="title">
                Title
                <input
                  onChange={this.handleChange}
                  value={this.state.title}
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
                  onChange={this.handleChange}
                  value={this.state.description}
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { ALL_ITEMS_QUERY, CREATE_ITEM_MUTATION };
