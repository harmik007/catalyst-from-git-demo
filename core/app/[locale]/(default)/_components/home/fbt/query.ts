import { graphql } from '~/client/graphql';

export const GetFBTProductsQuery = graphql(`
  query GetFBTProducts($entityIds: [Int!]) {
    site {
      products(entityIds: $entityIds) {
        edges {
          node {
            id
            entityId
            description
            sku
            name
            path
            prices {
              basePrice {
                currencyCode
                formatted
                value
              }
              price {
                currencyCode
                formatted
                value
              }
              retailPrice {
                currencyCode
                formatted
                value
              }
              salePrice {
                currencyCode
                formatted
                value
              }
              saved {
                currencyCode
                formatted
                value
              }
              priceRange {
                max {
                  currencyCode
                  formatted
                  value
                }
                min {
                  currencyCode
                  formatted
                  value
                }
              }
            }
            images(first: 10) {
              edges {
                node {
                  altText
                  urlOriginal
                }
              }
            }

            inventory {
              aggregated {
                availableToSell
                warningLevel
              }
              hasVariantInventory
              isInStock
            }

            productOptions(first: 25) {
              edges {
                node {
                  entityId
                  displayName
                  isRequired

                  ... on CheckboxOption {
                    checkedByDefault
                    __typename
                    checkedOptionValueEntityId
                    displayName
                    entityId
                    isRequired
                    isVariantOption
                    label
                    uncheckedOptionValueEntityId
                  }

                  ... on MultipleChoiceOption {
                    __typename
                    displayStyle
                    values(first: 10) {
                      edges {
                        node {
                          entityId
                          label
                          isDefault
                          ... on SwatchOptionValue {
                            hexColors
                            imageUrl(width: 200)
                          }
                          ... on ProductPickListOptionValue {
                            isSelected
                            defaultImage {
                              urlOriginal
                              altText
                              isDefault
                              url(width: 10, height: 10)
                            }
                          }
                        }
                      }
                    }
                  }

                  ... on MultiLineTextFieldOption {
                    __typename
                    defaultValue
                    minLength
                    displayName
                    entityId
                    isRequired
                    isVariantOption
                    maxLength
                    maxLines
                  }

                  ... on FileUploadFieldOption {
                    __typename
                    displayName
                    entityId
                    fileTypes
                    isRequired
                    isVariantOption
                    maxFileSize
                  }

                  ... on TextFieldOption {
                    __typename
                    defaultValue
                    minLength
                    displayName
                    entityId
                    isRequired
                    isVariantOption
                    maxLength
                  }

                  ... on DateFieldOption {
                    __typename
                    earliest
                    displayName
                    entityId
                    isRequired
                    isVariantOption
                    latest
                    limitDateBy
                  }

                  ... on NumberFieldOption {
                    __typename
                    lowest
                    displayName
                    entityId
                    highest
                    isIntegerOnly
                    isRequired
                    isVariantOption
                    limitNumberBy
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