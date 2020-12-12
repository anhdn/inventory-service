const request = require('supertest');

const {
  beforeAction,
  afterAction,
} = require('../../helpers/setup');
const { getAccessToken } = require('../../helpers/getAccessToken');

const { User } = require('../../../api/models');
const { Product } = require('../../../api/models');

let api;
let token;

beforeAll(async () => {
  api = await beforeAction();
  token = await getAccessToken();
});

afterAll(() => {
  afterAction();
});

test('Product | create, update, delete', async () => {
  const user = await User.create({
    email: 'test1@nab.au',
  });

  const createMutation = `
    mutation {
      createProduct(
        userId: ${user.id},
        title: "Iphone x",
        description: "Apple iPhone X smartphone. Announced Sep 2017. Features 5.8″ display, Apple A11 Bionic chipset, Dual: 12 MP (f/1.8, 28mm, 1.22µm) + 12 MP primary ..."
        price: 2000
      ) {
        id
        title
        description 
        price
        userId
      }
    }
  `;

  const res = await request(api)
    .post('/graphql')
    .set('Accept', /json/)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send({ query: createMutation })
    .expect(200);
  expect(res.body.data.createProduct.userId).toBe(user.id);
  expect(res.body.data.createProduct.title).toBe('Iphone x');
});

test('Product | updateProduct', async () => {
  const user = await User.create({
    email: 'test2@nab.au',
  });

  const product = await Product.create({
    userId: user.id,
    product: 'update Product',
  });

  const updateMutation = `
    mutation {
      updateProduct(
        id: ${product.id}
        userId: ${user.id}
        title: "Iphone 12 new"
      ) {
        userId
        title
      }
    }
  `;

  const res = await request(api)
    .post('/graphql')
    .set('Accept', /json/)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send({ query: updateMutation })
    .expect(200)
    .expect('Content-Type', /json/);

  expect(res.body.data.updateProduct.userId).toBe(user.id);
  expect(res.body.data.updateProduct.title).toBe('Iphone 12 new');
});

test('Product | updateProduct | Product does not exist', async () => {
  const updateMutation = `
    mutation {
      updateProduct(
        id: 9999
        userId: 1
        title: "update iphone x"
      ) {
        title
      }
    }
  `;

  const res = await request(api)
    .post('/graphql')
    .set('Accept', /json/)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send({ query: updateMutation })
    .expect(200)
    .expect('Content-Type', /json/);

  expect(res.body.data.updateProduct).toBe(null);
  expect(res.body.errors[0].message).toBe('Product with id: 9999 not found!');
});

test('Product | deleteProduct', async () => {
  const user = await User.create({
    email: 'test@mailtest.com',
  });

  const product = await Product.create({
    userId: user.id,
    title: 'delete product',
  });

  const deleteMutation = `
    mutation {
      deleteProduct(
        id: ${product.id}
      ) {
        title
      }
    }
  `;

  const res = await request(api)
    .post('/graphql')
    .set('Accept', /json/)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send({ query: deleteMutation })
    .expect(200)
    .expect('Content-Type', /json/);
  expect(res.body.data.deleteProduct.title).toBe('delete product');
});

test('Product | deleteProduct | product does not exist', async () => {
  const deleteMutation = `
    mutation {
      deleteProduct(
        id: 9999
      ) {
        title
      }
    }
  `;

  const res = await request(api)
    .post('/graphql')
    .set('Accept', /json/)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send({ query: deleteMutation })
    .expect(200)
    .expect('Content-Type', /json/);

  expect(res.body.data.deleteProduct).toBe(null);
  expect(res.body.errors[0].message).toBe('Product with id: 9999 not found!');
});
