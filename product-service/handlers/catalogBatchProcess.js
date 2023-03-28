const AWS = require('aws-sdk');
const { uniqBy, map } = require('lodash');
const { v4 } = require('uuid');
const { productSchema } = require('../constants/productSchema');
const { putProduct, putStock } = require('../helpers/productHelpers');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports.catalogBatchProcess = async (event) => {
    const uniqRecordBodies = map(uniqBy(event.Records, 'messageId'), el => JSON.parse(el.body));

    for (body of uniqRecordBodies) {
        for (product of body) {
            const { validationError } = productSchema.validate(product);

            if (validationError) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid product data' }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                }
            }
            const newProduct = { ...product, id: v4() };

            try {
                await putProduct(newProduct, dynamo);
                await putStock({product_id: newProduct.id, count: newProduct.count}, dynamo);

                await sns.publish({
                    Subject: 'New product was created',
                    Message: `Product with title ${newProduct.title} was succesfully created in Products and Stock tables`,
                    TopicArn: process.env.SNS_ARN
                }).promise();
            } catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
                    body: `Error when creating new product or stock: ${error}`
                }
            }

        }
    }

    return {
        statusCode: 200,
        body: `New products were succesfully parsed and uploaded into DynamoDB tables`
    }
}