import React, { Component } from 'react';
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items'
// create a mutation called delete item

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION(
    $id: ID!
  ) {
    deleteItem(id: $id) {
      id
      title
    }
  }
`


class DeleteItem extends Component {
  update = (cache, payload) => {
    // get all the items
    const data = cache.readQuery( { query: ALL_ITEMS_QUERY } )
    console.log(data, payload);
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id)
    cache.writeQuery({query: ALL_ITEMS_QUERY, data})
  }

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{
          id: this.props.id
        }}
        update={this.update}
      >
        {(deleteItem, nextparam) => {

          return <button onClick={e => {
            if(confirm(`are you sure you want to delete this item?`)) {
              deleteItem()
            }
          }} >{this.props.children}</button>
        }}
      </Mutation>
    )
  }
}

export default DeleteItem;