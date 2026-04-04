const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

function daysUntil(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffMs = expiry - today;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

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

    const items = result.Items || [];

    let expiredItems = 0;
    let expiringIn7Days = 0;
    const categoryMap = {};

    for (const item of items) {
        const days = daysUntil(item.expiryDate);

        if (days < 0) expiredItems++;
        if (days >= 0 && days <= 7) expiringIn7Days++;

        categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
    }

    const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
        category,
        count,
    }));

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            totalItems: items.length,
            expiredItems,
            expiringIn7Days,
            categoryBreakdown,
        }),
    };
};