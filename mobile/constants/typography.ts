import { Platform } from 'react-native';

// Avenir Next on iOS: geometric, clean, distinctly different from SF Pro
// sans-serif on Android: Roboto, the standard clean Android font
export const FONT = Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif';
