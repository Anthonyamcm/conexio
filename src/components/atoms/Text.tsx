import { colors, typography } from '@/src/utils';
import React, { useMemo } from 'react';
import {
  StyleProp,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';

type Sizes = keyof typeof $sizeStyles;
type Weights = keyof typeof typography.primary;
type Presets = keyof typeof $presets;

export interface TextProps extends RNTextProps {
  tx?: string;
  text?: string;
  style?: StyleProp<TextStyle>;
  preset?: Presets;
  weight?: Weights;
  size?: Sizes;
  children?: React.ReactNode;
}

export function Text({
  tx,
  text,
  children,
  weight,
  size,
  style: $styleOverride,
  preset = 'default',
  ...rest
}: TextProps) {
  // i18n translation if tx is provided
  const content = text || children;

  // Memoizing styles to avoid recalculating on every render
  const $styles = useMemo(() => {
    return [
      $presets[preset],
      weight && $fontWeightStyles[weight],
      size && $sizeStyles[size],
      $styleOverride,
    ];
  }, [preset, weight, size, $styleOverride]);

  return (
    <RNText {...rest} style={$styles}>
      {content}
    </RNText>
  );
}

const $sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
};

const $fontWeightStyles = Object.entries(typography.primary).reduce(
  (acc, [weight, fontFamily]) => {
    acc[weight as Weights] = { fontFamily };
    return acc;
  },
  {} as Record<Weights, TextStyle>,
);

const $baseStyle: StyleProp<TextStyle> = [
  $sizeStyles.sm,
  $fontWeightStyles.normal,
  { color: colors.text },
];

const $presets = {
  default: $baseStyle,
  bold: [$baseStyle, $fontWeightStyles.medium] as StyleProp<TextStyle>,
  heading: [
    $baseStyle,
    $sizeStyles.xxl,
    $fontWeightStyles.medium,
  ] as StyleProp<TextStyle>,
  subheading: [
    $baseStyle,
    $sizeStyles.lg,
    $fontWeightStyles.medium,
  ] as StyleProp<TextStyle>,
  formLabel: [$baseStyle, $fontWeightStyles.medium] as StyleProp<TextStyle>,
  formHelper: [
    $baseStyle,
    $sizeStyles.sm,
    $fontWeightStyles.normal,
  ] as StyleProp<TextStyle>,
};
