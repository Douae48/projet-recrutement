// src/screens/LoginScreen.js

import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../api/auth';

const { width } = Dimensions.get('window');
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS, getThemeColors } from '../utils/theme';

const LoginScreen = ({ route, navigation }) => {
  const { role } = route.params || { role: 'Candidate' };
  const themeColors = getThemeColors(role);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setErrorMessage('');
    setAccountNotFound(false);
    
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        await login(data.token, data.roles, data.user);
      }
    } catch (error) {
      // Si le compte n'existe pas (404)
      if (error.status === 404) {
        setAccountNotFound(true);
        setErrorMessage("Ce compte n'existe pas.");
      } else {
        setErrorMessage(error.message || "Email ou mot de passe incorrect.");
      }
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
              name={role === 'Recruiter' ? 'business' : 'person'} 
              size={40} 
              color={themeColors.primary} 
            />
          </View>
          <Text style={styles.title}>Connexion</Text>
          <Text style={[styles.roleLabel, { color: themeColors.primary }]}>
            {role === 'Recruiter' ? 'Espace Recruteur' : 'Espace Candidat'}
          </Text>
        </View>
        
        {/* Formulaire */}
        <View style={styles.formSection}>
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
                placeholder="••••••••"
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
          
          {/* Message d'erreur */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <View style={styles.errorHeader}>
                <Ionicons name="alert-circle" size={20} color={COLORS.status.error} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
              {accountNotFound && (
                <TouchableOpacity 
                  style={[styles.createAccountBtn, { borderColor: themeColors.primary }]}
                  onPress={() => navigation.navigate('Register', { role })}
                >
                  <Ionicons name="person-add-outline" size={18} color={themeColors.primary} />
                  <Text style={[styles.createAccountText, { color: themeColors.primary }]}>
                    Créer un compte
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          
          {/* Bouton Connexion */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: themeColors.primary }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.neutral.white} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Se connecter</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.neutral.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Lien inscription */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
            <Text style={[styles.linkText, { color: themeColors.primary }]}>
              Créer un compte
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
    marginBottom: SPACING.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
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
    ...TYPOGRAPHY.hero,
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
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.text,
    marginBottom: SPACING.sm,
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
    backgroundColor: COLORS.status.error + '10',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.md,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.status.error,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  createAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1.5,
    backgroundColor: COLORS.neutral.white,
  },
  createAccountText: {
    ...TYPOGRAPHY.bodyBold,
    marginLeft: SPACING.xs,
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

export default LoginScreen;