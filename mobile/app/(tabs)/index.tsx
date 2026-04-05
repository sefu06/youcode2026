import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FONT } from '../../constants/typography';
import BloomLogo from '../../components/BloomLogo';
import InventoryCard, { FoodItem } from '../../components/InventoryCard';
import CategoryFilter from '../../components/CategoryFilter';
import { getItems } from '../../services/storage';

function getExpiryDays(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PantryScreen() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await getItems();
      setItems(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load pantry');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered =
    selectedCategory === 'all'
      ? items
      : items.filter((i) => i.category === selectedCategory);

  const urgentCount = items.filter((i) => {
    const d = getExpiryDays(i.expiryDate);
    return d >= 0 && d <= 2;
  }).length;

  const expiredCount = items.filter((i) => getExpiryDays(i.expiryDate) < 0).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BloomLogo size={32} />
          <View>
            <Text style={styles.title}>Bloom Pantry</Text>
            <Text style={styles.subtitle}>{items.length} items tracked</Text>
          </View>
        </View>

        {/* Alert badges */}
        {items.length > 0 && (
          <View style={styles.alertRow}>
            {urgentCount > 0 && (
              <View style={[styles.alertBadge, { backgroundColor: Colors.expiringBg }]}>
                <View style={[styles.alertDot, { backgroundColor: Colors.expiring }]} />
                <Text style={[styles.alertText, { color: Colors.coral }]}>
                  {urgentCount} expiring
                </Text>
              </View>
            )}
            {expiredCount > 0 && (
              <View style={[styles.alertBadge, { backgroundColor: Colors.expiredBg }]}>
                <View style={[styles.alertDot, { backgroundColor: Colors.expired }]} />
                <Text style={[styles.alertText, { color: Colors.terracotta }]}>
                  {expiredCount} expired
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Category filter */}
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.fern} />
          <Text style={styles.loadingText}>Loading pantry…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={52} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Couldn't load pantry</Text>
          <Text style={styles.emptyMsg}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.itemId}
          renderItem={({ item }) => <InventoryCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor={Colors.fern}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialIcons
                name={selectedCategory === 'all' ? 'kitchen' : 'filter-list'}
                size={52}
                color={Colors.textLight}
              />
              <Text style={styles.emptyTitle}>
                {selectedCategory === 'all' ? 'Pantry is empty' : 'Nothing here'}
              </Text>
              <Text style={styles.emptyMsg}>
                {selectedCategory === 'all'
                  ? 'Tap Scan to add your first item'
                  : 'Try a different category'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: FONT,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    fontFamily: FONT,
    marginTop: 1,
  },
  alertRow: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 42,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 100,
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  alertText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONT,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONT,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyMsg: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: FONT,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textMuted,
    fontFamily: FONT,
    fontSize: 14,
  },
});
