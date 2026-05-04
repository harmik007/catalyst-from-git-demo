import { graphql } from '~/client/graphql';

export const GetCategoryProductsQuery = graphql(`
query GetCategoryProducts($categoryId: Int!) {
  site {
    category(entityId: $categoryId) {
      entityId
      name
      products(first: 4) {
        edges {
          node {
            entityId
            name
            path
            sku

            prices {
              price {
                value
                currencyCode
                formatted
              }
            }

            defaultImage {
              url(width: 300)
              altText
            }

            productOptions {
              edges {
                node {
                  entityId
                  displayName
                  isRequired
                  __typename

                  ... on MultipleChoiceOption {
                    displayStyle
                    values {
                      edges {
                        node {
                          entityId
                          label
                          isDefault
                        }
                      }
                    }
                  }

                  ... on CheckboxOption {
                    label
                  }

                  ... on DateFieldOption {
                    dateDefault: defaultValue
                  }

                  ... on NumberFieldOption {
                    numberDefault: defaultValue
                  }

                  ... on TextFieldOption {
                    textDefault: defaultValue
                    maxLength
                  }
                }
              }
            }

            variants(first: 50) {
              edges {
                node {
                  entityId
                  sku
                  prices {
                    price {
                      value
                      currencyCode
                      formatted
                    }
                  }
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