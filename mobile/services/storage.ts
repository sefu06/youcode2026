import * as FileSystem from 'expo-file-system/legacy';
import { FoodItem } from '../components/InventoryCard';

const FILE_PATH = `${FileSystem.documentDirectory}pantry.json`;

export async function getItems(): Promise<FoodItem[]> {
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
