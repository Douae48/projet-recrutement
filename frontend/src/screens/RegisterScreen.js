// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../api/auth';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS, getThemeColors } from '../utils/theme';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ route, navigation }) => {
  const { role } = route.params || { role: 'Candidate' };
  const themeColors = getThemeColors(role);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!name || !email || !password) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password, role });
      setSuccessMessage("Compte créé avec succès ! 🎉");
      // Redirection vers la page de connexion après 1.5s
      setTimeout(() => {
        navigation.navigate('Login', { role });
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || "Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.white} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Bouton retour */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.neutral.text} />
        </TouchableOpacity>
        
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={[styles.iconCircle, { backgroundColor: themeColors.primaryLight + '20' }]}>
            <Ionicons 
              name={role === 'Recruiter' ? 'business-outline' : 'person-add-outline'} 
              size={40} 
              color={themeColors.primary} 
            />
          </View>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={[styles.roleLabel, { color: themeColors.primary }]}>
            {role === 'Recruiter' ? 'Recruteur' : 'Candidat'}
          </Text>
        </View>
        
        {/* Formulaire */}
        <View style={styles.formSection}>
          {/* Nom */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <View style={[styles.inputWrapper, name && styles.inputWrapperFocused]}>
              <Ionicons name="person-outline" size={20} color={COLORS.neutral.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                placeholderTextColor={COLORS.neutral.placeholder}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>
          
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.inputWrapper, email && styles.inputWrapperFocused]}>
              <Ionicons name="mail-outline" size={20} color={COLORS.neutral.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor={COLORS.neutral.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
          </View>
          
          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={[styles.inputWrapper, password && styles.inputWrapperFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.neutral.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 caractères"
                placeholderTextColor={COLORS.neutral.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.neutral.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
            <View style={[styles.inputWrapper, confirmPassword && styles.inputWrapperFocused]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.neutral.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Retapez le mot de passe"
                placeholderTextColor={COLORS.neutral.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.neutral.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Messages d'erreur et de succès */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={COLORS.status.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          {successMessage ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.status.success} />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}
          
          {/* Bouton Inscription */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: themeColors.primary }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.neutral.white} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Créer mon compte</Text>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.neutral.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Lien connexion */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
            <Text style={[styles.linkText, { color: themeColors.primary }]}>
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + SPACING.md : SPACING.xxl,
    paddingBottom: SPACING.xl,
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.neutral.text,
  },
  roleLabel: {
    ...TYPOGRAPHY.bodyBold,
    marginTop: SPACING.xs,
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.text,
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: COLORS.neutral.border,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.text,
    marginLeft: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.status.error + '10',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.md,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.status.error,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.status.success + '10',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.md,
  },
  successText: {
    ...TYPOGRAPHY.body,
    color: COLORS.status.success,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
    ...SHADOWS.medium,
  },
  submitButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.white,
    marginRight: SPACING.sm,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    marginRight: SPACING.xs,
  },
  linkText: {
    ...TYPOGRAPHY.bodyBold,
  },
});

export default RegisterScreen;