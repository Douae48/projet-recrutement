import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';

const Card = ({ 
  children, 
  title, 
  subtitle,
  onPress, 
  style,
  headerColor = COLORS.candidate.primary,
  showHeader = false,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {showHeader && title && (
        <View style={[styles.cardHeader, { backgroundColor: headerColor }]}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.cardContent}>
        {!showHeader && title && (
          <Text style={styles.title}>{title}</Text>
        )}
        {!showHeader && subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        {children}
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.card,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
  },
  headerTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.white,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  cardContent: {
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.md,
  },
});

export default Card;
