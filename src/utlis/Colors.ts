const palette = {
  neutral100: '#FFFFFF',
  neutral200: '#ECF2F5',
  neutral300: '#E0E0E0',
  neutral400: '#CCCCCC',
  neutral500: '#B3B3B3',
  neutral600: '#999999',
  neutral700: '#808080',
  neutral800: '#666666',
  neutral900: '#4D4D4D',

  primary100: '#00c6ff',
  primary200: '#00A3E0',
  primary300: '#33BFFF',
  primary400: '#66D4FF',
  primary500: '#99E8FF',
  primary600: '#CCEFFF',

  secondary100: '#0072ff',
  secondary200: '#2D71D6 ',
  secondary300: '#4A85E0',
  secondary400: '#6699E6',
  secondary500: '#85B3F0',
  secondary600: '#A3C6F4',

  error100: '#F54B5E',
  error200: '#C11C32',
  error300: '#D12F4A',

  overlay20: 'rgba(25, 16, 21, 0.2)',
  overlay50: 'rgba(25, 16, 21, 0.5)',
} as const;

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: 'rgba(0, 0, 0, 0)',
  /**
   * The default text color in many components.
   */
  text: palette.neutral900,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.error100,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.error100,
};
