import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  size = 'medium', // 'small', 'medium', 'large'
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  color = COLORS.candidate.primary,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push({ backgroundColor: color }, SHADOWS.colored(color));
        break;
      case 'secondary':
        baseStyle.push({ backgroundColor: COLORS.neutral.background });
        break;
      case 'outline':
        baseStyle.push(styles.outline, { borderColor: color });
        break;
      case 'danger':
        baseStyle.push({ backgroundColor: COLORS.status.error }, SHADOWS.colored(COLORS.status.error));
        break;
      default:
        baseStyle.push({ backgroundColor: color });
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
      case 'danger':
        baseStyle.push({ color: COLORS.neutral.white });
        break;
      case 'secondary':
        baseStyle.push({ color: color });
        break;
      case 'outline':
        baseStyle.push({ color: color });
        break;
      default:
        baseStyle.push({ color: COLORS.neutral.white });
    }
    
    return baseStyle;
  };

  const iconColor = variant === 'primary' || variant === 'danger' 
    ? COLORS.neutral.white 
    : color;

  return (
    <TouchableOpacity 
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={20} color={iconColor} style={styles.iconLeft} />
          )}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={20} color={iconColor} style={styles.iconRight} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  // Tailles
  small: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  medium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  large: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  // Variantes
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  // Texte
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Icônes
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});

export default CustomButton;