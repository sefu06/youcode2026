import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CATEGORIES, Category } from '../constants/categories';
import { FONT } from '../constants/typography';

type Props = {
  selected: string;
  onSelect: (id: string) => void;
};

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat: Category) => {
        const active = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[styles.pill, active && styles.pillActive]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={cat.icon as any}
              size={14}
              color={active ? Colors.white : Colors.textMuted}
            />
            <Text style={[styles.label, active && styles.labelActive]}>{cat.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    backgroundColor: Colors.bgCard,
    borderRadius: 100,
    paddingHorizontal: 13,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: FONT,
    color: Colors.text,
    letterSpacing: -0.1,
  },
  labelActive: {
    color: Colors.white,
  },
});
