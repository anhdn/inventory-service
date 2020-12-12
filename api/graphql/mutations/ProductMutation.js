const {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} = require('graphql');
const merge = require('lodash.merge');

const { ProductType } = require('../types');
const { Product } = require('../../models');

const createProduct = {
  type: ProductType,
  description: 'The mutation that allows you to create a new Product',
  args: {
    userId: {
      name: 'userId',
      type: new GraphQLNonNull(GraphQLInt),
    },
    title: {
      name: 'title',
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      name: 'description',
      type: new GraphQLNonNull(GraphQLString),
    },
    price: {
      name: 'price',
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
  resolve: (value, {
    userId, title, price, description,
  }) => (
    Product.create({
      userId,
      title,
      price,
      description,
    })
  ),
};

const updateProduct = {
  type: ProductType,
  description: 'The mutation that allows you to update an existing Product by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      name: 'userId',
      type: new GraphQLNonNull(GraphQLInt),
    },
    title: {
      name: 'title',
      type: GraphQLString,
    },
    description: {
      name: 'description',
      type: GraphQLString,
    },
    price: {
      name: 'description',
      type: GraphQLFloat,
    },
  },
  resolve: async (value, {
    id, userId, title, description, price,
  }) => {
    const foundProduct = await Product.findByPk(id);

    if (!foundProduct) {
      throw new Error(`Product with id: ${id} not found!`);
    }

    const updatedProduct = merge(foundProduct, {
      userId,
      title,
      description,
      price,
    });

    return foundProduct.update(updatedProduct);
  },
};

const deleteProduct = {
  type: ProductType,
  description: 'The mutation that allows you to delete a existing Product by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (value, { id }) => {
    const foundProduct = await Product.findByPk(id);

    if (!foundProduct) {
      throw new Error(`Product with id: ${id} not found!`);
    }

    await Product.destroy({
      where: {
        id,
      },
    });

    return foundProduct;
  },
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
};
