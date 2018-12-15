import React, { Component } from 'react';
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { perPage } from '../config';
import Head from 'next/head';
import Link from 'next/link';

const ITEMS_CONNECTION_QUERY = gql`
  query ITEMS_CONNECTION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

export default class Pagination extends Component {
  render() {
    return (
      <Query query={ITEMS_CONNECTION_QUERY}>
        {({ loading, data, error }) => {
          if (loading) return <p>loading...</p>;
          if (error) return <p>error: {error}</p>;
          const itemsLength = data.itemsConnection.aggregate.count;
          const pages = Math.ceil(itemsLength / perPage);
          const page = this.props.page;
          return (
            <PaginationStyles>
              <Head>
                <title>
                  Supa store - page {page} of {pages}
                </title>
              </Head>
              <Link href={{ pathname: '/items', query: { page: page - 1 } }}>
                <a className="prev" aria-disabled={page <= 1}>
                  &lt;- prev
                </a>
              </Link>
              <p>
                page {this.props.page} of {pages}!
              </p>
              <p>{itemsLength} items total</p>
              <Link href={{ pathname: '/items', query: { page: page + 1 } }}>
                <a className="next" aria-disabled={page >= pages}>
                  next -&gt;
                </a>
              </Link>
            </PaginationStyles>
          );
        }}
      </Query>
    );
  }
}
