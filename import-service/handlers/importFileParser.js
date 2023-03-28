const AWS = require('aws-sdk');
const csv = require('csv-parser');
const { get } = require('lodash');
const BUCKET = 'orlov-vitalii-import';

module.exports.importFileParser = async (event) => {
    const key = get(event, 'Records[0].s3.object.key');
    
    const params = {
        Bucket: BUCKET,
        Key: key
    }
    
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new AWS.SQS();
    const s3Stream = s3.getObject(params).createReadStream();
    
    return await new Promise((resolve, reject) => {
        const result = [];
        
        s3Stream
        .pipe(csv())
        .on('data', (data) => {
            result.push(data);
        })
        .on('end', () => {
            console.log('RESULT: ', result);
            sqs.sendMessage({
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(result)
            }, (err, data) => {
                console.log('SQS-ERROR: ', err, 'SQS: ', data)
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'S3 object was succesfully received, parsed and sent to SQS.' })
                })
            })
        })
        .on('error', (error) => {
            console.error(error, error.errorMessage);
            reject({
                statusCode: 500,
                body: JSON.stringify({ message: `Error when reading S3 stream` })
            })
        })
    })     
}