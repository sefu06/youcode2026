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
import { Colors } from '../../constants/colors';
import BloomLogo from '../../components/BloomLogo';
import InventoryCard, { FoodItem } from '../../components/InventoryCard';
import CategoryFilter from '../../components/CategoryFilter';
import { getItems } from '../../services/storage';

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

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <BloomLogo size={36} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Bloom Pantry</Text>
          <Text style={styles.subtitle}>{items.length} items tracked</Text>
        </View>
      </View>

      {/* Category filter */}
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.tealFern} />
          <Text style={styles.loadingText}>Loading pantry...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>🌿</Text>
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
              tintColor={Colors.tealFern}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.bigEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>
                {selectedCategory === 'all' ? 'Pantry is empty' : 'No items here'}
              </Text>
              <Text style={styles.emptyMsg}>
                {selectedCategory === 'all'
                  ? 'Tap Scan to add your first item!'
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  bigEmoji: {
    fontSize: 52,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  emptyMsg: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textMuted,
    fontSize: 14,
  },
});
