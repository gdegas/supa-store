import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';

const ALL_ITEMS_QUERY = gql`
  query getAllItems($first: Int = ${perPage}, $skip: Int = 0 ) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      description
      largeImage
      image
      price
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

export default class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page} />
        <Query
          variables={{
            skip: this.props.page * perPage - perPage,
            first: perPage
          }}
          query={ALL_ITEMS_QUERY}
        >
          {({ error, loading, data }) => {
            if (error) return <p>Error: {error}</p>;
            if (loading) return <p>Loading...</p>;

            return (
              <ItemList>
                {data.items.map(item => {
                  return <Item key={item.id} item={item} />;
                })}
              </ItemList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

export { ALL_ITEMS_QUERY };
