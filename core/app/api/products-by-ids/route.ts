import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { ids } = await req.json();

  // ⚠️ Replace with your actual Catalyst client
  const query = `
    query getProducts($ids: [Int!]) {
      site {
        products(entityIds: $ids) {
          edges {
            node {
              entityId
              name
              path
              defaultImage {
                url(width: 300)
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(process.env.BC_GRAPHQL_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.BC_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: { ids: ids.map(Number) },
    }),
  });

  const json = await response.json();

  const products =
    json.data.site.products.edges.map((edge: any) => ({
      id: edge.node.entityId,
      name: edge.node.name,
      path: edge.node.path,
      defaultImage: edge.node.defaultImage,
    }));

  return NextResponse.json({ products });
}