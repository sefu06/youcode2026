import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import StatusPill, { StatusType } from './StatusPill';
import { CATEGORIES } from '../constants/categories';

export type FoodItem = {
  itemId: string;
  foodName: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  createdAt: string;
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(dateStr: string): StatusType {
  const days = daysUntil(dateStr);
  if (days < 0)  return 'expired';
  if (days === 0) return 'expiring';
  if (days <= 2)  return 'expiring';
  if (days <= 5)  return 'use-soon';
  return 'fresh';
}

function getExpiryLabel(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < 0)   return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return 'Expires today!';
  if (days === 1) return 'Expires tomorrow';
  return `Expires in ${days}d`;
}

function getCategoryEmoji(category: string): string {
  return CATEGORIES.find((c) => c.id === category)?.emoji ?? '📦';
}

type Props = { item: FoodItem };

export default function InventoryCard({ item }: Props) {
  const status = getExpiryStatus(item.expiryDate);
  const expiryLabel = getExpiryLabel(item.expiryDate);

  return (
    <View style={styles.card}>
      <View style={styles.emojiBox}>
        <Text style={styles.emoji}>{getCategoryEmoji(item.category)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.foodName}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.row}>
          <Text style={styles.qty}>{item.quantity} {item.unit}</Text>
          <StatusPill status={status} />
        </View>
        <Text style={styles.expiry}>{expiryLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.deepForest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  category: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  qty: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  expiry: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
