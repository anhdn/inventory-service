
const get = require('lodash.get');
const { parse } = require('graphql');
const JWTService = require('../services/auth.service');

const ALLOW_NON_TOKEN = {
  query: [
    'product',
  ],
  mutation: [
  ],
};
// check query public or private
const isAllowNonAuthenticationQuery = (req) => {
  const queryString = get(req, 'body.query');
  if (queryString) {
    const doc = parse(queryString);
    // eslint-disable-next-line no-restricted-syntax
    for (const def of doc.definitions) {
      const { operation } = def;
      // eslint-disable-next-line no-restricted-syntax
      for (const field of def.selectionSet.selections) {
        const { value } = field.name;
        if (ALLOW_NON_TOKEN[operation].includes(value)) {
          return true;
        }
      }
    }
  }
  // eslint-disable-next-line consistent-return
  return false;
};

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = async (req, res, next) => {
  let tokenToVerify;
  if (isAllowNonAuthenticationQuery(req)) {
    return next();
  }
  if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ');

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
      }
    } else {
      return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
    }
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    delete req.query.token;
  } else {
    return res.status(401).json({ msg: 'No Authorization was found' });
  }
  return JWTService().verify(tokenToVerify, (err, thisToken) => {
    if (err) return res.status(401).json({ err });
    req.token = thisToken;
    return next();
  });
};
