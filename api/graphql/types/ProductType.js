const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Product',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (product) => product.id,
    },
    userId: {
      type: GraphQLInt,
      resolve: (product) => product.userId,
    },
    title: {
      type: GraphQLString,
      resolve: (product) => product.title,
    },
    description: {
      type: GraphQLString,
      resolve: (product) => product.description,
    },
    price: {
      type: GraphQLFloat,
      resolve: (product) => product.price,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (product) => product.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (product) => product.createdAt,
    },
  }),
});

module.exports = { ProductType };
