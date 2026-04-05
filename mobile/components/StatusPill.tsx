import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export type StatusType = 'fresh' | 'use-soon' | 'expiring' | 'expired' | 'in-stock' | 'low-stock';

const STATUS_CONFIG: Record<StatusType, { bg: string; text: string; label: string }> = {
  'fresh':     { bg: Colors.sage,      text: Colors.deepForest, label: '✨ Fresh'      },
  'use-soon':  { bg: Colors.duskBlue,  text: Colors.white,      label: '⏰ Use Soon'   },
  'expiring':  { bg: Colors.expiring,  text: Colors.white,      label: '⚠️ Expiring'   },
  'expired':   { bg: Colors.expired,   text: Colors.white,      label: '❌ Expired'    },
  'in-stock':  { bg: Colors.tealFern,  text: Colors.white,      label: '✅ In Stock'   },
  'low-stock': { bg: Colors.low,       text: Colors.deepForest, label: '📉 Low Stock'  },
};

type Props = { status: StatusType };

export default function StatusPill({ status }: Props) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['fresh'];
  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.label, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
