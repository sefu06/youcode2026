import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { FONT } from '../constants/typography';

export type StatusType = 'fresh' | 'use-soon' | 'expiring' | 'expired' | 'in-stock' | 'low-stock';

export const STATUS_CONFIG: Record<
  StatusType,
  { bg: string; text: string; dot: string; label: string }
> = {
  'fresh':     { bg: Colors.freshBg,    text: Colors.forest,     dot: Colors.fresh,     label: 'Fresh'     },
  'use-soon':  { bg: Colors.useSoonBg,  text: Colors.amber,      dot: Colors.useSoon,   label: 'Use Soon'  },
  'expiring':  { bg: Colors.expiringBg, text: Colors.coral,      dot: Colors.expiring,  label: 'Expiring'  },
  'expired':   { bg: Colors.expiredBg,  text: Colors.terracotta, dot: Colors.expired,   label: 'Expired'   },
  'in-stock':  { bg: Colors.freshBg,    text: Colors.forest,     dot: Colors.fresh,     label: 'In Stock'  },
  'low-stock': { bg: Colors.goldLight,  text: Colors.gold,       dot: Colors.gold,      label: 'Low Stock' },
};

type Props = { status: StatusType };

export default function StatusPill({ status }: Props) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['fresh'];
  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONT,
    letterSpacing: 0.4,
  },
});
