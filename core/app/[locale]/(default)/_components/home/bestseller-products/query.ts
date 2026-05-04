import { graphql } from '~/client/graphql';
export const BestSellingProductsQuery = graphql(`
  query BestSellingProductsQuery {
    site {
      bestSellingProducts(first: 10) {
        edges {
          node {
            entityId
            id
            name
            sku
            path
            brand {
              entityId
              name
            }
            defaultImage {
              url(width: 800)
              altText
            }
            images(first: 10) {
              edges {
                node {
                  url(width: 800)
                  altText
                }
              }
            }
            prices {
              price {
                value
                currencyCode
              }
              salePrice {
                value
                currencyCode
              }
              basePrice {
                value
                currencyCode
              }
              retailPrice {
                value
                currencyCode
              }
            }
            priceRanges {
              priceRange {
                min {
                  value
                  currencyCode
                }
                max {
                  value
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
    customer {
      wishlists {
        edges {
          node {
            entityId
            name
            items {
              edges {
                node {
                  product {
                    entityId
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);
