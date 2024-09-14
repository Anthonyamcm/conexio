import { spacing } from '@/src/utlis';
import React, { useMemo } from 'react';
import { StyleProp, ViewProps, ViewStyle, View as RNView } from 'react-native';

type Presets = keyof typeof viewPresets;

export interface Props extends ViewProps {
  style?: StyleProp<ViewStyle>;
  preset: Presets;
  children?: React.ReactNode;
}

export function View({
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
    <RNView style={memoizedViewStyle} {...rest}>
      {children}
    </RNView>
  );
}

const baseStyle: ViewStyle = {
  overflow: 'hidden',
};

const rowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 15,
};

const columnStyle: ViewStyle = {
  flexDirection: 'column',
  gap: 15,
  paddingBottom: spacing.xl,
};

const viewPresets = {
  default: [baseStyle] as StyleProp<ViewStyle>,
  row: [baseStyle, rowStyle] as StyleProp<ViewStyle>,
  column: [baseStyle, columnStyle] as StyleProp<ViewStyle>,
};
