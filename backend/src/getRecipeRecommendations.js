const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const FOOD_TABLE = process.env.FOOD_TABLE_NAME || "FoodItems";
const RECIPES_TABLE = process.env.RECIPES_TABLE_NAME || "Recipes";

function daysUntil(dateStr) {
    if (!dateStr) return 9999;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(dateStr);
    if (Number.isNaN(expiry.getTime())) return 9999;

    expiry.setHours(0, 0, 0, 0);

    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function scoreRecipe(recipe, foodItems) {
    let score = 0;
    const matchedIngredients = [];
    const expiringIngredients = [];

    const recipeIngredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients.map((i) => String(i).toLowerCase())
        : [];

    for (const item of foodItems) {
        const foodName = String(item.foodName || "").toLowerCase().trim();
        if (!foodName) continue;

        if (recipeIngredients.includes(foodName)) {
            matchedIngredients.push(item.foodName);

            const days = daysUntil(item.expiryDate);

            if (days <= 2) {
                score += 3;
                expiringIngredients.push(item.foodName);
            } else if (days <= 5) {
                score += 2;
            } else {
                score += 1;
            }
        }
    }

    return {
        score,
        matchedIngredients,
        expiringIngredients,
    };
}

exports.handler = async () => {
    try {
        const foodResult = await docClient.send(
            new ScanCommand({
                TableName: FOOD_TABLE,
            })
        );

        const recipeResult = await docClient.send(
            new ScanCommand({
                TableName: RECIPES_TABLE,
            })
        );

        const foodItems = foodResult.Items || [];
        const recipes = recipeResult.Items || [];

        const rankedRecipes = recipes
            .map((recipe) => {
                const { score, matchedIngredients, expiringIngredients } = scoreRecipe(
                    recipe,
                    foodItems
                );

                return {
                    recipeId: recipe.recipeId,
                    recipeName: recipe.recipeName,
                    imageUrl: recipe.imageUrl,
                    score,
                    matchedIngredients,
                    expiringIngredients,
                };
            })
            .filter((recipe) => recipe.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(rankedRecipes),
        };
    } catch (error) {
        console.error("Recommendation error:", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Internal server error",
                error: error.message,
            }),
        };
    }
};