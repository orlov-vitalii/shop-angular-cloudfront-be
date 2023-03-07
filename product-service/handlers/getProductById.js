'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.getProductById = async (event) => {
  const { id } = event.pathParameters;
  let statusCode, body;

  console.log(event);

  try {
    const productResponse = await dynamo.query({
      TableName: process.env.PRODUCT_TABLE_NAME,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id }
    }).promise();

    const stockResponse = await dynamo.query({
      TableName: process.env.STOCK_TABLE_NAME,
      KeyConditionExpression: 'product_id = :product_id',
      ExpressionAttributeValues: { ':product_id': id }
    }).promise();

    const product = productResponse.Items[0] || null;
    const stock = stockResponse.Items[0] || null

    if (product && stock) {
      statusCode = 200;
      body = JSON.stringify({ ...product, count: stock.count });
    } else {
      statusCode = 404;
      body = JSON.stringify({ message: 'Product or stock with given id not found!' });
    }

  } catch (e) {
    console.error(e);
    statusCode = 500;
    body = JSON.stringify({ message: `Error when getting product by id: ${e.message}`});
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
