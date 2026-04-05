// import * as FileSystem from 'expo-file-system/legacy';
// import { ImageManipulator } from 'expo-image-manipulator';
// import { GEMINI_API_KEY } from '../config/api';

// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

// export type GeminiResult = {
//   foodName: string;
//   category: string;
//   quantity: number;
//   unit: string;
//   expiryDate: string;
// };

// const PROMPT = `You are a food inventory assistant. Analyze this food or grocery item image.
// Return ONLY a valid JSON object — no markdown, no explanation — with exactly these fields:
// {
//   "foodName": "short name of the food item",
//   "category": "one of: Produce, Dairy, Meat & Seafood, Bakery, Canned Goods, Grains & Pasta, Snacks & Sweets, Beverages, Condiments, Frozen Foods, Other",
//   "quantity": <integer, estimate visible units, default 1>,
//   "unit": "appropriate unit: pieces, cartons, bags, cans, bottles, loaves, bunches, cups, jars, boxes, etc.",
//   "expiryDate": "estimated best-before date in YYYY-MM-DD format based on typical shelf life from today"
// }`;

// export async function analyzeFood(imageUri: string): Promise<GeminiResult> {
//   // Resize to max 512px wide before sending to reduce token cost
//   const ctx = ImageManipulator.manipulate(imageUri);
//   ctx.resize({ width: 512 });
//   const ref = await ctx.renderAsync();
//   const saved = await ref.saveAsync({ compress: 0.5, format: 'jpeg' as any });

//   const base64 = await FileSystem.readAsStringAsync(saved.uri, {
//     encoding: 'base64' as const,
//   });

//   const response = await fetch(GEMINI_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             { text: PROMPT },
//             { inlineData: { mimeType: 'image/jpeg', data: base64 } },
//           ],
//         },
//       ],
//       generationConfig: { temperature: 0.1 },
//     }),
//   });

//   if (!response.ok) {
//     const err = await response.text();
//     throw new Error(`Gemini error: ${err}`);
//   }

//   const data = await response.json();
//   const raw: string = data.candidates[0].content.parts[0].text;

//   // Strip any markdown fences just in case
//   const cleaned = raw.replace(/```json|```/g, '').trim();
//   const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
//   if (!jsonMatch) throw new Error('Gemini returned no JSON');

//   return JSON.parse(jsonMatch[0]) as GeminiResult;
// }

import { ImageManipulator } from 'expo-image-manipulator';
import { GEMINI_API_KEY } from '../config/api';

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export type GeminiResult = {
  foodName: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
};

const PROMPT = `You are a food inventory assistant. Analyze this food or grocery item image.
Return ONLY a valid JSON object with exactly these fields:
{
  "foodName": "short name of the food item",
  "category": "one of: Produce, Dairy, Meat & Seafood, Bakery, Canned Goods, Grains & Pasta, Snacks & Sweets, Beverages, Condiments, Frozen Foods, Other",
  "quantity": <integer, estimate visible units, default 1>,
  "unit": "appropriate unit: pieces, cartons, bags, cans, bottles, loaves, bunches, cups, jars, boxes, etc.",
  "expiryDate": "estimated best-before date in YYYY-MM-DD format based on typical shelf life from the provided current date"
}`;

export async function analyzeFood(imageUri: string): Promise<GeminiResult> {
  const today = new Date().toISOString().slice(0, 10);

  const ctx = ImageManipulator.manipulate(imageUri);
  ctx.resize({ width: 512 });

  const ref = await ctx.renderAsync();
  const saved = await ref.saveAsync({
    compress: 0.4,
    format: 'jpeg' as any,
    base64: true,
  });

  if (!saved.base64) {
    throw new Error('Failed to create base64 image');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${PROMPT}\nCurrent date: ${today}` },
            { inlineData: { mimeType: 'image/jpeg', data: saved.base64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error: ${err}`);
  }

  const data = await response.json();

  const raw =
    data?.candidates?.[0]?.content?.parts?.find((p: any) => typeof p?.text === 'string')?.text;

  if (!raw) {
    throw new Error(`Gemini returned no text: ${JSON.stringify(data)}`);
  }

  return JSON.parse(raw) as GeminiResult;
}
