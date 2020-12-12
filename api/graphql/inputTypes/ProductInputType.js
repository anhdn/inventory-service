const {
  GraphQLInputObjectType,
} = require('graphql');


const ProductInputType = (type) => {
  // eslint-disable-next-line no-shadow
  const ProductInputType = new GraphQLInputObjectType({
    title: `ProductInputType${type[0].toUpperCase() + type.slice(1, type.length - 1)}`,
    description: 'This represents a ProductInputType',
    price: 'This represents a ProductInputType',
  });

  return ProductInputType;
};

module.exports = { ProductInputType };
