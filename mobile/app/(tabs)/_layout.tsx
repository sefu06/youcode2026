import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FONT } from '../../constants/typography';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.forest,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 66,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          paddingTop: 8,
          shadowColor: '#1A2A1E',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          fontFamily: FONT,
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.pantryBtn, focused && styles.pantryBtnActive]}>
              <MaterialIcons
                name="kitchen"
                size={22}
                color={focused ? Colors.forest : Colors.textLight}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.scanBtn, focused && styles.scanBtnActive]}>
              <MaterialIcons
                name="camera-alt"
                size={24}
                color={focused ? Colors.white : Colors.fern}
              />
            </View>
          ),
          tabBarActiveTintColor: Colors.fern,
          tabBarInactiveTintColor: Colors.textMuted,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  pantryBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pantryBtnActive: {
    backgroundColor: Colors.freshBg,
  },
  scanBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.dew,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: Colors.mist,
    shadowColor: Colors.forest,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  scanBtnActive: {
    backgroundColor: Colors.fern,
    borderColor: Colors.fern,
    shadowOpacity: 0.3,
    elevation: 8,
  },
});
