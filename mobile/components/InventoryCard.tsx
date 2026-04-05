import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { FONT } from '../constants/typography';
import { STATUS_CONFIG } from './StatusPill';
import type { StatusType } from './StatusPill';
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
  if (days < 0)   return 'expired';
  if (days <= 2)  return 'expiring';
  if (days <= 5)  return 'use-soon';
  return 'fresh';
}

function getExpiryLabel(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days < 0)   return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  return `${days} days left`;
}

function getFreshnessRatio(dateStr: string): number {
  const days = daysUntil(dateStr);
  if (days <= 0) return 0;
  return Math.min(days / 14, 1);
}

function getCategoryIcon(category: string): string {
  return CATEGORIES.find((c) => c.id === category)?.icon ?? 'shape-outline';
}

type Props = { item: FoodItem };

export default function InventoryCard({ item }: Props) {
  const status = getExpiryStatus(item.expiryDate);
  const expiryLabel = getExpiryLabel(item.expiryDate);
  const freshnessRatio = getFreshnessRatio(item.expiryDate);
  const cfg = STATUS_CONFIG[status];

  return (
    <View style={styles.card}>
      {/* Status accent bar */}
      <View style={[styles.accentBar, { backgroundColor: cfg.dot }]} />

      <View style={styles.content}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
            <MaterialCommunityIcons
              name={getCategoryIcon(item.category) as any}
              size={20}
              color={cfg.dot}
            />
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.name} numberOfLines={1}>{item.foodName}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>

          <View style={styles.qtyBlock}>
            <Text style={styles.qtyNum}>{item.quantity}</Text>
            <Text style={styles.qtyUnit}>{item.unit}</Text>
          </View>
        </View>

        {/* Freshness bar + label */}
        <View style={styles.bottomRow}>
          <Text style={[styles.expiryLabel, { color: cfg.text }]}>{expiryLabel}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${Math.round(freshnessRatio * 100)}%`, backgroundColor: cfg.dot },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#1A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  accentBar: {
    width: 5,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  content: {
    flex: 1,
    padding: 14,
    paddingLeft: 12,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONT,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  category: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    fontFamily: FONT,
    textTransform: 'capitalize',
  },
  qtyBlock: {
    alignItems: 'flex-end',
    gap: 1,
  },
  qtyNum: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: FONT,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  qtyUnit: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    fontFamily: FONT,
  },
  bottomRow: {
    gap: 5,
  },
  expiryLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONT,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  barTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
});
