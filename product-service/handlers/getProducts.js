'use strict';

const { mockProducts } = require("../constants/mockData");

module.exports.getProducts = async (event) => {
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    body: JSON.stringify(mockProducts),
  };
};
