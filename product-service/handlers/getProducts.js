'use strict';

const { mockProducts } = require("../constants/mockData");
const AWS = require('aws-sdk');
const { get } = require('lodash');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.getProducts = async (event) => {
  let statusCode, body;

  console.log(event);

  try {
    const productsResponse = await dynamo.scan({
      TableName: process.env.PRODUCT_TABLE_NAME,
    }).promise();

    const stocksResponse = await dynamo.scan({
      TableName: process.env.STOCK_TABLE_NAME,
    }).promise();

    const products = get(productsResponse, 'Items', []);
    const stocks = get(stocksResponse, 'Items', []);

    const joinedProducts = products.map(product => {
      const stock = stocks.find(item => item.product_id === product.id);

      return { ...product, count: stock.count }
    })

    statusCode = 200;
    body = JSON.stringify(joinedProducts);
  } catch (e) {
    console.error(e);
    statusCode = 500;
    body = JSON.stringify({ message: `Error when getting products: ${e.message}` });
  }

  return {
    statusCode,
    body,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};
