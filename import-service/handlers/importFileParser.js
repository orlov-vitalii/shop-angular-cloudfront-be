const AWS = require('aws-sdk');
const csv = require('csv-parser');
const { get } = require('lodash');
const BUCKET = 'orlov-vitalii-import';

module.exports.importFileParser = async (event) => {
    let statusCode, body;
    const key = get(event, 'Records[0].s3.object.key');
    console.log(JSON.stringify(event), key);
    
    const params = {
        Bucket: BUCKET,
        Key: key
    }

    try {
        const s3 = new AWS.S3({ region: 'eu-west-1' });
        s3.getObject(params, (err, data) => {
            console.log(data);
            console.log(err);
        });

        const results = [];

        console.log('stream: ', s3Stream);
    
        // s3Stream
        //     .pipe(csv())
        //     .on('data', (data) => {
        //         console.log('DATA:', data);
        //         results.push(data);
        //     })
        //     .on('end', () => {
        //         console.log('RESULT:', results);
        //         statusCode = 200;
        //         body = JSON.stringify({ message: 'S3 object was succesfully received and parsed.' })
        //     })
        //     .on('error', (error) => {
        //         console.error(error);
        //         statusCode = 500;
        //         body = JSON.stringify({ message: `Error when reading S3 stream`})
            // })
    } catch (e) {
        console.error(e);
        statusCode = 500;
        body = JSON.stringify({ message: `Error when getting object from S3: ${e.message}` })
    }

    return { statusCode, body }
}