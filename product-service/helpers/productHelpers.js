module.exports.putProduct = async (item, client) => {
    console.log('PUT PRODUCT:', item);

    return await client.put({
        TableName: process.env.PRODUCT_TABLE_NAME,
        Item: item,
    }).promise();
};

module.exports.putStock = async (item, client) => {
    console.log('PUT STOCK: ', item);

    return await client.put({
        TableName: process.env.STOCK_TABLE_NAME,
        Item: item,
    }).promise();
};
