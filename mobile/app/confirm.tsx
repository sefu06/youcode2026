import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { CATEGORIES } from '../constants/categories';
import { GeminiResult } from '../services/gemini';
import { API_BASE_URL, API_KEY, API_TOKEN } from '../config/api';

export default function ConfirmScreen() {
  const { imageUri, data } = useLocalSearchParams<{ imageUri: string; data: string }>();
  const parsed: GeminiResult = JSON.parse(data ?? '{}');

  const [foodName, setFoodName] = useState(parsed.foodName ?? '');
  const [category, setCategory] = useState(parsed.category ?? 'Other');
  const [quantity, setQuantity] = useState(String(parsed.quantity ?? 1));
  const [unit, setUnit] = useState(parsed.unit ?? 'pieces');
  const [expiryDate, setExpiryDate] = useState(parsed.expiryDate ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!foodName.trim()) {
      Alert.alert('Missing name', 'Please enter a food name.');
      return;
    }

    setSaving(true);
    try {
      if (!API_BASE_URL) {
        throw new Error('Missing API URL. Set EXPO_PUBLIC_API_BASE_URL in mobile/.env.');
      }
      if (!API_TOKEN && !API_KEY) {
        console.warn('No API auth configured. Set EXPO_PUBLIC_API_TOKEN or EXPO_PUBLIC_API_KEY if required.');
      }

      const payload = {
        foodName: foodName.trim(),
        category,
        quantity: parseInt(quantity, 10) || 1,
        unit: unit.trim(),
        expiryDate,
      };

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (API_TOKEN) headers.Authorization = `Bearer ${API_TOKEN}`;
      if (API_KEY) headers['x-api-key'] = API_KEY;

      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Request failed: ${response.status}`);
      }

      router.dismissAll();
    } catch (e: any) {
      Alert.alert('Save Failed', e.message ?? 'Could not save item. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const categories = CATEGORIES.slice(1); // skip 'all'

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Confirm Item</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Photo */}
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
          ) : null}

          {/* AI badge */}
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>✨ Filled by Gemini AI — review & edit below</Text>
          </View>

          {/* Fields */}
          <View style={styles.card}>
            <Field label="Food Name" emoji="🍽️">
              <TextInput
                style={styles.input}
                value={foodName}
                onChangeText={setFoodName}
                placeholder="e.g. Whole Milk"
                placeholderTextColor={Colors.textMuted}
              />
            </Field>

            <Field label="Quantity" emoji="🔢">
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.qtyInput]}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={Colors.textMuted}
                />
                <TextInput
                  style={[styles.input, styles.unitInput]}
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="pieces"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </Field>

            <Field label="Expiry Date" emoji="📅">
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textMuted}
              />
            </Field>
          </View>

          {/* Category picker */}
          <Text style={styles.sectionLabel}>📂 Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, category === cat.id && styles.catPillActive]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catLabel, category === cat.id && styles.catLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>🌿 Add to Pantry</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  emoji,
  children,
}: {
  label: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {emoji} {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 20, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mist,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: Colors.text, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: Colors.mist,
  },
  aiBadge: {
    backgroundColor: Colors.duskBlue,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  aiBadgeText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    shadowColor: Colors.deepForest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  field: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  row: { flexDirection: 'row', gap: 10 },
  qtyInput: { width: 80 },
  unitInput: { flex: 1 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.bgCard,
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  catPillActive: {
    backgroundColor: Colors.tealFern,
    borderColor: Colors.tealFern,
  },
  catEmoji: { fontSize: 13 },
  catLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
  catLabelActive: { color: Colors.white },
  saveBtn: {
    backgroundColor: Colors.tealFern,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.tealFern,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: Colors.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
});
