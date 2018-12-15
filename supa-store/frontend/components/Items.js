import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';

const ALL_ITEMS_QUERY = gql`
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
        <Query query={ALL_ITEMS_QUERY}>
          {({ error, loading, data }) => {
            if (error) return <p>Error: {error}</p>;
            if (loading) return <p>Loading...</p>;
            console.log(this.props);
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
