'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { omit } = require('lodash');
const { productSchema } = require('../constants/productSchema');

const dynamo = new AWS.DynamoDB.DocumentClient();
const { mockProducts } = require('../constants/mockData');

const putProduct = async (item) => {
    console.log(item);

    return await dynamo.put({
        TableName: process.env.PRODUCT_TABLE_NAME,
        Item: item,
    }).promise();
}

const putStock = async (item) => {
    console.log(item);

    return await dynamo.put({
        TableName: process.env.STOCK_TABLE_NAME,
        Item: item,
    }).promise();
}

const fillTableWithMockValues = async () => {
    const putProductResult = await Promise.all(mockProducts.map(async item => {
        return await putProduct(omit(item, 'count'))
    }));
    const putStockResult = await Promise.all(mockProducts.map(async item => {
        return await putStock({ product_id: item.id, count: item.count })
    }));

    console.log(putProductResult, putStockResult);
}

module.exports.createProduct = async (event) => {
    const item = JSON.parse(event.body);
    const itemId = uuidv4();

    let statusCode, body;

    console.log(event);

    const { error: validationError} = productSchema.validate(item);

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


    try {

        await putProduct({
            id: itemId,
            ...omit(item, 'count')
        });

        await putStock({
            product_id: itemId,
            count: item.count
        })

        statusCode = 200;
        body = JSON.stringify({
            message: 'New product was successfully added to Product and Stock tables'
        });

    } catch (e) {
        console.error(e);
        statusCode = 500;
        body = JSON.stringify({ message: `Error when creating new product: ${e.message}`})
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            message: 'New product was successfully added to Product and Stock tables'
        }),
    };
}