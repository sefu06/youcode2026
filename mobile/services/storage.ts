import * as FileSystem from 'expo-file-system/legacy';
import { API_BASE_URL, API_KEY, API_TOKEN } from '../config/api';
import { FoodItem } from '../components/InventoryCard';

const FILE_PATH = `${FileSystem.documentDirectory}pantry.json`;

export async function getItems(): Promise<FoodItem[]> {
  // Try API first if configured; fall back to local storage.
  if (API_BASE_URL) {
    try {
      const headers: Record<string, string> = {};
      if (API_TOKEN) headers.Authorization = `Bearer ${API_TOKEN}`;
      if (API_KEY) headers['x-api-key'] = API_KEY;

      const res = await fetch(`${API_BASE_URL}/items`, { headers });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Request failed: ${res.status}`);
      }

      const items = (await res.json()) as any[];
      return Array.isArray(items)
        ? items.map((item) => ({
            itemId: item.itemId ?? `item-${Math.random().toString(36).slice(2)}`,
            foodName: item.foodName ?? 'Unknown',
            category: item.category ?? 'Other',
            quantity: item.quantity ?? 1,
            unit: item.unit ?? 'pieces',
            expiryDate: item.expiryDate ?? '',
            status: item.status ?? 'available',
            createdAt: item.createdAt ?? new Date().toISOString(),
          }))
        : [];
    } catch (error) {
      console.warn('Falling back to local pantry cache:', (error as any)?.message);
    }
  }

  try {
    const info = await FileSystem.getInfoAsync(FILE_PATH);
    if (!info.exists) return [];
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(raw) as FoodItem[];
  } catch {
    return [];
  }
}

export async function addItem(
  data: Pick<FoodItem, 'foodName' | 'category' | 'quantity' | 'unit' | 'expiryDate'>
): Promise<FoodItem> {
  const existing = await getItems();

  const newItem: FoodItem = {
    itemId: `item-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };

  console.log('=== New pantry item scanned ===');
  console.log(JSON.stringify(newItem, null, 2));

  const updated = [newItem, ...existing];
  await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(updated, null, 2));

  return newItem;
}
