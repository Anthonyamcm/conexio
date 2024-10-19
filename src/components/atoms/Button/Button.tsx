import React, { ComponentType, useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '@/src/utils';

type Presets = keyof typeof viewPresets;

export interface ButtonAccessoryProps {
  style: StyleProp<any>;
  pressableState: PressableStateCallbackType;
}

export interface ButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pressedTextStyle?: StyleProp<TextStyle>;
  preset: Presets;
  isLoading?: boolean;
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
  gradient?: string[];
  children?: React.ReactNode;
}

export function Button({
  style: viewStyleOverride,
  pressedStyle: pressedViewStyleOverride,
  textStyle: textStyleOverride,
  pressedTextStyle: pressedTextStyleOverride,
  children,
  RightAccessory,
  LeftAccessory,
  isLoading = false,
  gradient,
  preset,
  ...rest
}: ButtonProps) {
  const currentPreset = viewPresets[preset] ? preset : 'default';

  const memoizedViewStyle = useMemo(
    () =>
      ({ pressed }: PressableStateCallbackType) => [
        viewPresets[currentPreset],
        viewStyleOverride,
        pressed && [
          pressedViewPresets[currentPreset],
          pressedViewStyleOverride,
        ],
      ],
    [currentPreset, viewStyleOverride, pressedViewStyleOverride],
  );

  const memoizedTextStyle = useMemo(
    () =>
      ({ pressed }: PressableStateCallbackType) => [
        textPresets[currentPreset],
        textStyleOverride,
        pressed && [
          pressedTextPresets[currentPreset],
          pressedTextStyleOverride,
        ],
      ],
    [currentPreset, textStyleOverride, pressedTextStyleOverride],
  );

  const content = (state: PressableStateCallbackType) => (
    <>
      {LeftAccessory && (
        <LeftAccessory style={leftAccessoryStyle} pressableState={state} />
      )}
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.palette.neutral100} />
      ) : (
        <Text style={memoizedTextStyle(state)}>{children}</Text>
      )}
      {RightAccessory && (
        <RightAccessory style={rightAccessoryStyle} pressableState={state} />
      )}
    </>
  );

  return (
    <>
      {gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 1, y: 0.25 }}
          style={{ borderRadius: 16, flex: 1 }}
        >
          <Pressable
            style={memoizedViewStyle}
            accessibilityRole="button"
            {...rest}
          >
            {content}
          </Pressable>
        </LinearGradient>
      ) : (
        <Pressable
          style={memoizedViewStyle}
          accessibilityRole="button"
          {...rest}
        >
          {content}
        </Pressable>
      )}
    </>
  );
}

// Base styles
const baseViewStyle: ViewStyle = {
  minHeight: 32,
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  overflow: 'hidden',
};

const baseTextStyle: TextStyle = {
  fontSize: 18,
  fontFamily: typography.primary.medium,
  textAlign: 'center',
  zIndex: 2,
};

const rightAccessoryStyle: ViewStyle = {
  marginStart: spacing.xs,
  alignSelf: 'center',
  zIndex: 1,
};
const leftAccessoryStyle: ViewStyle = {
  marginEnd: spacing.xs,
  alignSelf: 'center',
  zIndex: 1,
};

// TODO: Fix typings
const viewPresets = {
  default: [
    baseViewStyle,
    { backgroundColor: colors.palette.neutral300 },
  ] as StyleProp<TextStyle>,
  filled: [
    baseViewStyle,
    { backgroundColor: colors.palette.neutral200 },
  ] as StyleProp<TextStyle>,
  reversed: [
    baseViewStyle,
    {
      backgroundColor: colors.palette.neutral200,
    },
  ] as StyleProp<TextStyle>,
  gradient: [baseViewStyle] as StyleProp<TextStyle>,
};

const textPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: [baseTextStyle, { color: colors.palette.neutral600 }],
  filled: [baseTextStyle, { color: colors.palette.neutral300 }],
  reversed: [baseTextStyle, { color: colors.palette.neutral900 }],
  gradient: [baseTextStyle, { color: colors.palette.neutral100 }],
};

const pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { backgroundColor: colors.palette.neutral200 },
  filled: { backgroundColor: colors.palette.neutral400 },
  reversed: { backgroundColor: colors.palette.neutral300 },
  gradient: { backgroundColor: colors.palette.neutral200 },
};

const pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { opacity: 0.9, color: colors.palette.neutral400 },
  filled: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
  gradient: { opacity: 0.9 },
};
