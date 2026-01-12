// src/components/SkillBadge.js
// Badge de compétence avec option de suppression

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';

const SkillBadge = ({ 
  label, 
  onRemove, 
  removable = false,
  variant = 'default',
  size = 'md', 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: COLORS.candidate.primaryLight + '20', borderColor: COLORS.candidate.primary },
          text: { color: COLORS.candidate.primary },
        };
      case 'success':
        return {
          container: { backgroundColor: COLORS.status.success + '20', borderColor: COLORS.status.success },
          text: { color: COLORS.status.success },
        };
      default:
        return {
          container: { backgroundColor: COLORS.neutral.background, borderColor: COLORS.neutral.border },
          text: { color: COLORS.neutral.text },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingH: SPACING.sm, paddingV: 4, fontSize: 11 };
      case 'lg':
        return { paddingH: SPACING.lg, paddingV: SPACING.sm, fontSize: 15 };
      default:
        return { paddingH: SPACING.md, paddingV: SPACING.xs, fontSize: 13 };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View 
      style={[
        styles.container, 
        variantStyles.container,
        { 
          paddingHorizontal: sizeStyles.paddingH, 
          paddingVertical: sizeStyles.paddingV 
        }
      ]}
    >
      <Text style={[styles.label, variantStyles.text, { fontSize: sizeStyles.fontSize }]}>
        {label}
      </Text>
      
      {removable && onRemove && (
        <TouchableOpacity 
          onPress={() => {
            console.log('Suppression skill:', label);
            onRemove();
          }} 
          style={styles.removeButton}
          activeOpacity={0.6}
        >
          <Ionicons 
            name="close-circle" 
            size={18} 
            color={COLORS.status.error} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.small,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: SPACING.xs,
    padding: 4,
    cursor: 'pointer',
  },
});

export default SkillBadge;
