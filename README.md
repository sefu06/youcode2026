# 🌱 Bloom Pantry

> A platform helping women's shelters efficiently track and manage their food inventory — identifying items nearing expiration and turning them into nutritious, thoughtful recipes.

<img width="1935" height="1088" alt="Screenshot 2026-04-05 112055" src="https://github.com/user-attachments/assets/b2aef41b-c8d1-400b-a567-3e17a43c0988" />

> devpost link: https://devpost.com/software/bloom-pantry
---

## About

Bloom Pantry bridges the gap between food waste and food security. Shelter staff scan food items with a mobile app; Gemini AI identifies each item and reads expiration dates. The web dashboard surfaces the top items about to expire and auto-generates recipes, including period-friendly meal adaptations, so nothing goes to waste.

---

## Features

- **Smart scanning** — Snap a photo; Gemini + OCR identify the item and read the expiration date automatically.
- **Expiry dashboard** — Web view highlights the top 5 items nearest expiration so staff can act fast.
- **Recipe generator** — Auto-generates recipes from expiring ingredients, with period-friendly alternatives for each dish.
- **Cloud-synced** — App and website stay in sync via AWS DynamoDB — inventory updates reflected in real time supporting multiple devices simultaneously.

---

## Tech Stack

**Languages & Frameworks**
React · React Native · TypeScript · JavaScript · CSS · Expo Go

**AI & APIs**
Gemini API · Claude / Codex · ChatGPT · OCR

**Infrastructure**
AWS · DynamoDB

---

## What We Learned

- Setting up and connecting AWS DynamoDB under a tight hackathon deadline.
- Integrating the Gemini API into a React Native app and debugging authentication issues in real time.
- Using OCR to extract machine-readable expiration dates from food packaging photos.
- Keeping a mobile app and web dashboard in sync via a shared cloud database.

---

## What's Next

- Expand recipe variety to cover more combinations of expiring ingredients.
- Improve expiration-date OCR accuracy for a wider range of label formats.
- Add push notifications when critical items are about to expire.
- Scale to other shelter types beyond women's shelters.

---

*Built with care at YouCode 2026 thanks to UBC Wics & Wids · Bloom Pantry · Amelie, Nina, Selina F, and Selina J*
