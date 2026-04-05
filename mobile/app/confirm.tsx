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
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { FONT } from '../constants/typography';
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <MaterialIcons name="close" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
            <Text style={styles.title}>Review Item</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Photo */}
          {imageUri ? (
            <View style={styles.photoWrap}>
              <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
              <View style={styles.aiBadge}>
                <MaterialIcons name="auto-awesome" size={11} color={Colors.white} />
              <Text style={styles.aiBadgeText}>Gemini AI</Text>
              </View>
            </View>
          ) : (
            <View style={styles.aiBadgeStandalone}>
              <MaterialIcons name="auto-awesome" size={11} color={Colors.forest} />
              <Text style={styles.aiBadgeTextDark}>Filled by Gemini AI — review below</Text>
            </View>
          )}

          {/* Form card */}
          <View style={styles.card}>
            {/* Food name */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Food Name</Text>
              <TextInput
                style={styles.input}
                value={foodName}
                onChangeText={setFoodName}
                placeholder="e.g. Whole Milk"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.fieldDivider} />

            {/* Quantity + Unit */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.qtyInput]}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={Colors.textLight}
                />
                <TextInput
                  style={[styles.input, styles.unitInput]}
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="pieces"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            <View style={styles.fieldDivider} />

            {/* Expiry date */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>

          {/* Category */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, category === cat.id && styles.catPillActive]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catLabel, category === cat.id && styles.catLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>Add to Pantry</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    padding: 20,
    paddingBottom: 52,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    fontFamily: FONT,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  photoWrap: {
    marginBottom: 14,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    backgroundColor: Colors.mist,
  },
  aiBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.forest,
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  aiBadgeStandalone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.freshBg,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.mist,
  },
  aiBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONT,
    letterSpacing: 0.5,
  },
  aiBadgeTextDark: {
    color: Colors.forest,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONT,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#1A2A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  field: {
    paddingVertical: 14,
    gap: 6,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONT,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    fontFamily: FONT,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.bg,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  qtyInput: {
    width: 80,
  },
  unitInput: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: FONT,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.bgCard,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  catPillActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  catEmoji: {
    fontSize: 13,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FONT,
    color: Colors.text,
  },
  catLabelActive: {
    color: Colors.white,
  },
  saveBtn: {
    backgroundColor: Colors.forest,
    borderRadius: 100,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: Colors.forest,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontFamily: FONT,
    color: Colors.white,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
