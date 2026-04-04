const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async () => {
    const items = [
        {
            shelterId: "shelter-1",
            itemId: "item-001",
            foodName: "Milk",
            category: "Dairy",
            quantity: 12,
            unit: "cartons",
            expiryDate: "2026-04-06",
            status: "available",
            createdAt: "2026-04-04T20:00:00Z",
        },
        {
            shelterId: "shelter-1",
            itemId: "item-002",
            foodName: "Bananas",
            category: "Produce",
            quantity: 20,
            unit: "bunches",
            expiryDate: "2026-04-05",
            status: "available",
            createdAt: "2026-04-04T20:05:00Z",
        },
        {
            shelterId: "shelter-1",
            itemId: "item-003",
            foodName: "Bread",
            category: "Bakery",
            quantity: 15,
            unit: "loaves",
            expiryDate: "2026-04-07",
            status: "available",
            createdAt: "2026-04-04T20:10:00Z",
        },
        {
            shelterId: "shelter-1",
            itemId: "item-004",
            foodName: "Soup Cans",
            category: "Canned Goods",
            quantity: 30,
            unit: "cans",
            expiryDate: "2026-10-01",
            status: "available",
            createdAt: "2026-04-04T20:15:00Z",
        },
        {
            shelterId: "shelter-1",
            itemId: "item-005",
            foodName: "Yogurt",
            category: "Dairy",
            quantity: 18,
            unit: "cups",
            expiryDate: "2026-04-03",
            status: "available",
            createdAt: "2026-04-04T20:20:00Z",
        },
    ];

    for (const item of items) {
        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: item,
            })
        );
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Seeded items successfully",
            count: items.length,
        }),
    };
};