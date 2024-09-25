import React, {
  ComponentType,
  forwardRef,
  Ref,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '@/src/utlis';
import { Text, TextProps } from './Text';

export interface InputAccessoryProps {
  style: StyleProp<any>;
  multiline: boolean;
  editable: boolean;
}

export interface InputProps extends Omit<TextInputProps, 'ref'> {
  error?: boolean;
  errorText?: string;
  ref?: React.RefObject<TextInput>;
  label?: TextProps['text'];
  LabelTextProps?: TextProps;
  helper?: TextProps['text'];
  HelperTextProps?: TextProps;
  placeholder?: TextProps['text'];
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  RightAccessory?: ComponentType<InputAccessoryProps>;
  LeftAccessory?: ComponentType<InputAccessoryProps>;
}

const Input = forwardRef(function TextField(
  {
    label,
    placeholder,
    helper,
    error = false,
    errorText,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    style: $inputStyleOverride,
    containerStyle: containerStyleOverride,
    inputWrapperStyle: inputWrapperStyleOverride,
    ...TextInputProps
  }: InputProps,
  ref: Ref<TextInput>,
) {
  const inputRef = useRef<TextInput>(null);

  const disabled = TextInputProps.editable === false;
  const multiline = TextInputProps.multiline ?? false;

  useImperativeHandle(ref, () => inputRef.current as TextInput);

  // Memoize styles to avoid re-calculating them unnecessarily
  const containerStyles = useMemo(
    () => [containerStyleOverride],
    [containerStyleOverride],
  );

  const labelStyles = useMemo(
    () => [labelStyle, LabelTextProps?.style],
    [LabelTextProps?.style],
  );

  const inputWrapperStyles = useMemo(
    () => [
      inputWrapperStyle,
      error && { borderColor: colors.palette.error100 },
      multiline && { minHeight: 112 },
      LeftAccessory && { paddingStart: 0 },
      RightAccessory && { paddingEnd: 0 },
      inputWrapperStyleOverride,
    ],
    [
      error,
      multiline,
      LeftAccessory,
      RightAccessory,
      inputWrapperStyleOverride,
    ],
  );

  const inputStyles = useMemo(
    () => [
      inputStyle,
      disabled && { color: colors.textDim },
      multiline && { minHeight: 112 },
      $inputStyleOverride,
    ],
    [disabled, multiline, $inputStyleOverride],
  );

  const helperStyles = useMemo(
    () => [
      helperStyle,
      error && { color: colors.error },
      HelperTextProps?.style,
    ],
    [error, HelperTextProps?.style],
  );

  const focusInput = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[containerStyles, { paddingVertical: 5 }]}
      onPress={focusInput}
      accessibilityState={{ disabled }}
    >
      {!!label && (
        <Text
          preset="formLabel"
          text={label}
          {...LabelTextProps}
          style={labelStyles}
        />
      )}

      <View style={inputWrapperStyles}>
        {!!LeftAccessory && (
          <LeftAccessory
            style={leftAccessoryStyle}
            editable={!disabled}
            multiline={multiline}
          />
        )}

        <TextInput
          ref={inputRef}
          underlineColorAndroid={colors.transparent}
          textAlignVertical="top"
          placeholder={placeholder}
          placeholderTextColor={
            error ? colors.palette.error100 : colors.textDim
          }
          {...TextInputProps}
          editable={!disabled}
          style={inputStyles}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={rightAccessoryStyle}
            editable={!disabled}
            multiline={multiline}
          />
        )}
      </View>

      {!!errorText && error && (
        <Text
          preset="bold"
          style={{ color: colors.palette.error100, marginTop: spacing.xs }}
          text={errorText}
        />
      )}

      {!!helper && (
        <Text
          preset="formHelper"
          text={helper}
          {...HelperTextProps}
          style={helperStyles}
        />
      )}
    </TouchableOpacity>
  );
});

const labelStyle: TextStyle = {
  marginBottom: spacing.xs,
};

const inputWrapperStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  borderRadius: 12,
  backgroundColor: colors.palette.neutral200,
  overflow: 'hidden',
  borderWidth: 3,
  borderColor: colors.palette.neutral200,
};

const inputStyle: TextStyle = {
  flex: 1,
  alignSelf: 'stretch',
  fontFamily: typography.primary.medium,
  color: colors.text,
  fontSize: 16,
  height: 32,
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
};

const helperStyle: TextStyle = {
  marginTop: spacing.xs,
};

const rightAccessoryStyle: ViewStyle = {
  marginEnd: spacing.xs,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
};

const leftAccessoryStyle: ViewStyle = {
  marginStart: spacing.sm,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
};

export default Input;
