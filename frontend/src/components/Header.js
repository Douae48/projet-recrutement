// src/components/Header.js
// En-tête personnalisable avec support des thèmes

import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';

const { width } = Dimensions.get('window');

const Header = ({ 
  title, 
  subtitle, 
  backgroundColor = COLORS.candidate.primary,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      
      <View style={styles.headerRow}>
        {/* Bouton retour */}
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color={COLORS.neutral.white} />
          </TouchableOpacity>
        )}
        
        {/* Contenu central */}
        <View style={[styles.content, showBack && styles.contentWithBack]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        
        {/* Bouton droit optionnel */}
        {rightIcon && (
          <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
            <Ionicons name={rightIcon} size={24} color={COLORS.neutral.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + SPACING.md : SPACING.xl + SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.medium,
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: SPACING.xs,
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    padding: SPACING.xs,
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  contentWithBack: {
    marginHorizontal: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.neutral.white,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white,
    opacity: 0.9,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default Header;
