const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || process.env.FOOD_TABLE_NAME || "FoodItems";

exports.handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const {
            shelterId = "shelter-1",
            itemId = `item-${Date.now()}`,
            foodName,
            category = "Other",
            quantity = 1,
            unit = "pieces",
            expiryDate = null,
            status = "available",
            createdAt = new Date().toISOString(),
        } = body;

        if (!foodName || typeof foodName !== "string") {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "foodName is required" }),
            };
        }

        const item = {
            shelterId,
            itemId,
            foodName,
            category,
            quantity,
            unit,
            expiryDate,
            status,
            createdAt,
        };

        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: item,
            })
        );

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: "Item added", item }),
        };
    } catch (error) {
        console.error("Add item error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Failed to add item",
                error: error.message,
            }),
        };
    }
};
