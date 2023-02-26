'use strict';

const { mockProducts } = require("../constants/mockData");

module.exports.getProductById = async (event) => {
  const { id } = event.pathParameters;
  const requestedProduct = mockProducts.find(product => product.id === parseInt(id));

  if (!requestedProduct) {
    return {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Product with requested id not found'
        })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(requestedProduct),
  };
};
