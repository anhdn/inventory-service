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

test('Product | query', async () => {
  const user = await User.create({
    email: 'test@nab.au',
  });

  await Product.create({
    userId: user.id,
    title: 'Iphone 12',
    description: 'We compare cameras, performance, battery life and more between Apple\'s newest Pro phones and last year\'s models: the iPhone 12 Pro and Pro Max and the iPhone 11 Pro and Pro Max.',
    price: 2000,
  });

  const query = `
    {
      product (
        userId: ${user.id}
      ) {
        id
        title
        description 
        price
      }
    }
  `;

  const res = await request(api)
    .post('/graphql')
    .set('Accept', /json/)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .send({ query })
    .expect(200)
    .expect('Content-Type', /json/);
  expect(res.body.data.product[0].title).toBe('Iphone 12');
});
