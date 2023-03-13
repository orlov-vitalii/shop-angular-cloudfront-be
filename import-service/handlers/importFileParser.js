const AWS = require('aws-sdk');
const csv = require('csv-parser');
const { get } = require('lodash');
const BUCKET = 'orlov-vitalii-import';

module.exports.importFileParser = async (event) => {
    const key = get(event, 'Records[0].s3.object.key');
    console.log(JSON.stringify(event), key);
    
    const params = {
        Bucket: BUCKET,
        Key: key
    }

    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const s3Stream = s3.getObject(params).createReadStream();

    return await new Promise((resolve) => {
        const results = [];
    
        s3Stream
            .pipe(csv())
            .on('data', (data) => {
                console.log('DATA:', data);
                results.push(data);
            })
            .on('end', () => {
                console.log('RESULT:', results);
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'S3 object was succesfully received and parsed.' })
                })
            })
            .on('error', (error) => {
                console.error(error);
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ message: `Error when reading S3 stream` })
                })
            })
    })     
}