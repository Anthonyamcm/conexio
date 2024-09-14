import { spacing } from '@/src/utlis';
import React, { ComponentType, useMemo } from 'react';
import { StyleProp, ViewProps, ViewStyle, View } from 'react-native';

type Presets = keyof typeof viewPresets;

export interface Props extends ViewProps {
  style?: StyleProp<ViewStyle>;
  preset: Presets;
  children?: React.ReactNode;
}

export function ViewContainer({
  style: viewStyleOverride,
  children,
  preset,
  ...rest
}: Props) {
  const currentPreset = viewPresets[preset] ? preset : 'default';

  const memoizedViewStyle = useMemo(
    () => [viewPresets[currentPreset], viewStyleOverride],
    [currentPreset, viewStyleOverride],
  );

  return (
    <View style={memoizedViewStyle} {...rest}>
      {children}
    </View>
  );
}

const baseStyle: ViewStyle = {
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  overflow: 'hidden',
};

const rowStyle: ViewStyle = {
  flexDirection: 'row',
};

const columnStyle: ViewStyle = {
  flexDirection: 'column',
};

const viewPresets = {
  default: [baseStyle] as StyleProp<ViewStyle>,
  row: [baseStyle, rowStyle] as StyleProp<ViewStyle>,
  column: [baseStyle, columnStyle] as StyleProp<ViewStyle>,
};
