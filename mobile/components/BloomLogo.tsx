import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors } from '../constants/colors';

type Props = {
  size?: number;
  variant?: 'badge' | 'normal';
  dark?: boolean;
};

export default function BloomLogo({ size = 48, variant = 'normal', dark = false }: Props) {
  if (variant === 'badge') {
    return (
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="100" fill={Colors.duskBlue} />
        <Circle cx="100" cy="100" r="72" fill={Colors.deepForest} />
        {/* Outer petals */}
        <Circle cx="100" cy="46" r="24" fill={Colors.sage} opacity={0.9} />
        <Circle cx="142" cy="72" r="24" fill={Colors.sage} opacity={0.9} />
        <Circle cx="142" cy="128" r="24" fill={Colors.sage} opacity={0.9} />
        <Circle cx="100" cy="154" r="24" fill={Colors.sage} opacity={0.9} />
        <Circle cx="58" cy="128" r="24" fill={Colors.sage} opacity={0.9} />
        <Circle cx="58" cy="72" r="24" fill={Colors.sage} opacity={0.9} />
        {/* Inner petals */}
        <Circle cx="100" cy="60" r="16" fill={Colors.tealFern} opacity={0.95} />
        <Circle cx="131" cy="79" r="16" fill={Colors.tealFern} opacity={0.95} />
        <Circle cx="131" cy="121" r="16" fill={Colors.tealFern} opacity={0.95} />
        <Circle cx="100" cy="140" r="16" fill={Colors.tealFern} opacity={0.95} />
        <Circle cx="69" cy="121" r="16" fill={Colors.tealFern} opacity={0.95} />
        <Circle cx="69" cy="79" r="16" fill={Colors.tealFern} opacity={0.95} />
        {/* Center */}
        <Circle cx="100" cy="100" r="30" fill={Colors.mist} />
        <Circle cx="100" cy="100" r="20" fill={Colors.tealFern} />
        <Circle cx="100" cy="100" r="10" fill={Colors.deepForest} />
      </Svg>
    );
  }

  const petalOuter = dark ? Colors.tealFern : Colors.sage;
  const petalInner = dark ? Colors.duskBlue : Colors.tealFern;
  const centerFill = dark ? Colors.mist : Colors.deepForest;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {/* Outer petals */}
      <Circle cx="24" cy="7"  r="6.5" fill={petalOuter} opacity={0.85} />
      <Circle cx="37" cy="14" r="6.5" fill={petalOuter} opacity={0.85} />
      <Circle cx="37" cy="34" r="6.5" fill={petalOuter} opacity={0.85} />
      <Circle cx="24" cy="41" r="6.5" fill={petalOuter} opacity={0.85} />
      <Circle cx="11" cy="34" r="6.5" fill={petalOuter} opacity={0.85} />
      <Circle cx="11" cy="14" r="6.5" fill={petalOuter} opacity={0.85} />
      {/* Inner petals */}
      <Circle cx="24" cy="13" r="5" fill={petalInner} opacity={0.9} />
      <Circle cx="33" cy="18" r="5" fill={petalInner} opacity={0.9} />
      <Circle cx="33" cy="30" r="5" fill={petalInner} opacity={0.9} />
      <Circle cx="24" cy="35" r="5" fill={petalInner} opacity={0.9} />
      <Circle cx="15" cy="30" r="5" fill={petalInner} opacity={0.9} />
      <Circle cx="15" cy="18" r="5" fill={petalInner} opacity={0.9} />
      {/* Center */}
      <Circle cx="24" cy="24" r="9"  fill={centerFill} />
      <Circle cx="24" cy="24" r="5.5" fill={petalOuter} opacity={0.5} />
      <Circle cx="24" cy="24" r="3"  fill={centerFill} />
    </Svg>
  );
}
