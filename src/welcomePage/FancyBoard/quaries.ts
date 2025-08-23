import { gql } from "@apollo/client";

export const FancyOrderListQuery = gql`
  query FancyOrderList($first: Int, $sort: OrderSortingInput, $filter: OrderFilterInput) {
    orders(first: $first, sortBy: $sort, filter: $filter) {
      edges {
        node {
          id
          number
          created
          total {
            gross {
              amount
              currency
            }
          }
        }
      }
    }
  }
`;
