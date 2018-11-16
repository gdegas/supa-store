import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item'

const GET_ALL_ITEMS = gql`
  query getAllItems {
    items {
      id
      title
      description
      largeImage
      image
      price
    }
  }
`

const Center = styled.div`
  text-align: center;
`

const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`


export default class Items extends Component {
  render() {
    return (
      <Center>
        <Query query={GET_ALL_ITEMS}>
          {({error, loading, data}) => {
            if(error) return <p>Error: {error}</p>
            if(loading) return <p>Loading...</p>
            return <ItemList>
              {data.items.map(item => {
                return <Item key={item.id} item={item} />
              })}
            </ItemList>
          }}
        </Query>
      </Center>
    )
  }
}
