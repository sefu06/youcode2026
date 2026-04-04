const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async () => {
    const result = await docClient.send(
        new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "shelterId = :sid",
            ExpressionAttributeValues: {
                ":sid": "shelter-1",
            },
        })
    );

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(result.Items || []),
    };
};