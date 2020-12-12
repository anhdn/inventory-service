const {
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} = require('graphql');

const { ProductType } = require('../types');
const { Product } = require('../../models');
const { pushTrackingEvent } = require('../../services/tracking.sqs.service');

const productQuery = {
  type: new GraphQLList(ProductType),
  args: {
    id: {
      name: 'id',
      type: GraphQLInt,
    },
    userId: {
      name: 'userId',
      type: GraphQLInt,
    },
    title: {
      name: 'title',
      type: GraphQLString,
    },
    price: {
      name: 'title',
      type: GraphQLFloat,
    },
    createdAt: {
      name: 'createdAt',
      type: GraphQLString,
    },
    updatedAt: {
      name: 'updatedAt',
      type: GraphQLString,
    },
  },
  resolve: (user, args) => {
    pushTrackingEvent(args);
    return Product.findAll({ where: args });
  },
};

module.exports = { productQuery };
