/**
 * AppText.tsx
 *
 * A customizable text component library for consistent typography
 * throughout the application. Provides standardized text styles with
 * variants for headings and paragraphs.
 *
 * @package components/typography
 * @author Your Name
 */

import React, { memo, PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps, TextStyle, StyleProp } from 'react-native';

/**
 * Font weights supported in the application
 */
export type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

/**
 * Theme typography constants shared across the application
 */
export const Typography = {
  FONT_FAMILY: 'System' as const,
  BASE_COLOR: '#000' as const,
  LETTER_SPACING: {
    DEFAULT: 0.5 as const,
    HEADING: 0.25 as const,
  },
  LINE_HEIGHT: {
    H1: 40 as const,
    H2: 32 as const,
    H3: 26 as const,
    PARAGRAPH: 24 as const,
  },
  FONT_SIZE: {
    H1: 32 as const,
    H2: 24 as const,
    H3: 18 as const,
    PARAGRAPH: 16 as const,
  },
  FONT_WEIGHT: {
    NORMAL: 'normal' as FontWeight,
    BOLD: 'bold' as FontWeight,
  },
} as const;

/**
 * Base props interface for the AppText component
 */
export interface AppTextProps extends PropsWithChildren<TextProps> {
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Props interface for text variant components (H1, H2, etc.)
 */
export interface TextVariantProps extends Omit<TextProps, 'children'> {
  text: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityRole?: 'header' | 'text';
  numberOfLines?: number;
}

/**
 * Type definition for the AppText component with its static components
 */
export interface AppTextComponent extends React.FC<AppTextProps> {
  H1: React.FC<TextVariantProps>;
  H2: React.FC<TextVariantProps>;
  H3: React.FC<TextVariantProps>;
  Paragraph: React.FC<TextVariantProps>;
}

/**
 * Creates a text variant component with appropriate accessibility settings
 * @param variantStyles - The styles specific to this text variant
 * @param defaultRole - Default accessibility role for this component
 */
const createTextVariant = (
  variantStyles: StyleProp<TextStyle>,
  defaultRole: 'header' | 'text' = 'text',
): React.FC<TextVariantProps> => {
  return memo(
    ({
      text,
      style,
      accessibilityRole = defaultRole,
      numberOfLines,
      ...props
    }: TextVariantProps) => (
      <Text
        style={[styles.text, variantStyles, style]}
        accessibilityRole={accessibilityRole}
        numberOfLines={numberOfLines}
        {...props}
      >
        {text}
      </Text>
    ),
  );
};

/**
 * Base text component for consistent typography
 */
const BaseAppText: React.FC<AppTextProps> = memo(({ children, style, ...props }) => (
  <Text style={[styles.text, style]} {...props}>
    {children}
  </Text>
));

/**
 * Factory pattern to create the AppText component with its variants
 */
const createAppText = (): AppTextComponent => {
  const AppText = BaseAppText as AppTextComponent;

  // Create variants with appropriate accessibility roles
  AppText.H1 = createTextVariant(styles.h1, 'header');
  AppText.H2 = createTextVariant(styles.h2, 'header');
  AppText.H3 = createTextVariant(styles.h3, 'header');
  AppText.Paragraph = createTextVariant(styles.paragraph);

  return AppText;
};

/**
 * Component styles
 */
const styles = StyleSheet.create({
  text: {
    fontFamily: Typography.FONT_FAMILY,
    color: Typography.BASE_COLOR,
    letterSpacing: Typography.LETTER_SPACING.DEFAULT,
    lineHeight: Typography.LINE_HEIGHT.PARAGRAPH,
  },
  h1: {
    fontSize: Typography.FONT_SIZE.H1,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    letterSpacing: Typography.LETTER_SPACING.HEADING,
    lineHeight: Typography.LINE_HEIGHT.H1,
  },
  h2: {
    fontSize: Typography.FONT_SIZE.H2,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    letterSpacing: Typography.LETTER_SPACING.HEADING,
    lineHeight: Typography.LINE_HEIGHT.H2,
  },
  h3: {
    fontSize: Typography.FONT_SIZE.H3,
    fontWeight: Typography.FONT_WEIGHT.BOLD,
    letterSpacing: Typography.LETTER_SPACING.HEADING,
    lineHeight: Typography.LINE_HEIGHT.H3,
  },
  paragraph: {
    fontSize: Typography.FONT_SIZE.PARAGRAPH,
    letterSpacing: Typography.LETTER_SPACING.DEFAULT,
    lineHeight: Typography.LINE_HEIGHT.PARAGRAPH,
  },
});

// Create and export the AppText component
export const AppText: AppTextComponent = createAppText();
