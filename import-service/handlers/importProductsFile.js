'use strict'

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-1' });

const BUCKET = 'orlov-vitalii-import';

module.exports.importProductsFile = async (event) => {
    let statusCode, body;
    const { name } = event.queryStringParameters;
    const params = {
        Bucket: BUCKET,
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: 'text/csv'
    };

    try {
        const url = await s3.getSignedUrlPromise('putObject', params);
        
        statusCode = 200;
        body = JSON.stringify({ url });
    } catch (e) {
        console.error(e);
        statusCode = 500;
        body = JSON.stringify({ message: e.message });
    }

    return { statusCode, body }
}