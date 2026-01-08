// src/screens/WelcomeScreen.js
// Écran d'accueil moderne et dynamique - JobMatch Morocco

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const cardSlide1 = useRef(new Animated.Value(100)).current;
  const cardSlide2 = useRef(new Animated.Value(100)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation séquentielle au chargement
    Animated.sequence([
      // Logo et titre
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Tagline
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      // Cartes
      Animated.stagger(200, [
        Animated.spring(cardSlide1, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(cardSlide2, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Stats
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRoleSelect = (role) => {
    navigation.navigate('Login', { role });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.candidate.primary} />
      
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient}>
        <View style={styles.gradientCircle1} />
        <View style={styles.gradientCircle2} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Hero */}
        <Animated.View style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}>
          {/* Logo animé */}
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Ionicons name="briefcase" size={42} color={COLORS.neutral.white} />
              </View>
            </View>
            <View style={styles.logoPulse} />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>JobMatch</Text>
            <View style={styles.countryBadge}>
              <Text style={styles.appCountry}>Morocco</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tagline avec animation */}
        <Animated.View style={[
          styles.taglineContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}>
          <Text style={styles.tagline}>
            Le matching intelligent au service de votre carrière
          </Text>
          <View style={styles.taglineDivider} />
        </Animated.View>

        {/* Section choix du rôle */}
        <View style={styles.rolesSection}>
          <Text style={styles.sectionTitle}>Commencez votre parcours</Text>
          
          {/* Carte Candidat */}
          <Animated.View style={{
            transform: [{ translateX: cardSlide1 }],
            opacity: fadeAnim,
          }}>
            <TouchableOpacity 
              style={[styles.roleCard, styles.candidateCard]}
              onPress={() => handleRoleSelect('Candidate')}
              activeOpacity={0.95}
            >
              <View style={styles.cardGlow} />
              <View style={styles.roleHeader}>
                <View style={[styles.roleIconCircle, styles.candidateIcon]}>
                  <Ionicons name="person" size={28} color={COLORS.neutral.white} />
                </View>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>Candidat</Text>
                </View>
              </View>
              
              <Text style={styles.roleTitle}>Trouvez votre emploi idéal</Text>
              <Text style={styles.roleDescription}>
                Notre algorithme analyse vos compétences pour vous proposer les offres les plus adaptées à votre profil.
              </Text>
              
              <View style={styles.roleFeatures}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.candidate.primary} />
                  <Text style={styles.featureText}>Matching intelligent</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.candidate.primary} />
                  <Text style={styles.featureText}>Recommandations personnalisées</Text>
                </View>
              </View>
              
              <View style={[styles.cardButton, styles.candidateButton]}>
                <Text style={styles.cardButtonText}>Commencer</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.neutral.white} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Carte Recruteur */}
          <Animated.View style={{
            transform: [{ translateX: cardSlide2 }],
            opacity: fadeAnim,
          }}>
            <TouchableOpacity 
              style={[styles.roleCard, styles.recruiterCard]}
              onPress={() => handleRoleSelect('Recruiter')}
              activeOpacity={0.95}
            >
              <View style={[styles.cardGlow, styles.recruiterGlow]} />
              <View style={styles.roleHeader}>
                <View style={[styles.roleIconCircle, styles.recruiterIcon]}>
                  <Ionicons name="business" size={28} color={COLORS.neutral.white} />
                </View>
                <View style={[styles.roleBadge, styles.recruiterBadge]}>
                  <Text style={[styles.roleBadgeText, { color: COLORS.recruiter.primary }]}>Recruteur</Text>
                </View>
              </View>
              
              <Text style={[styles.roleTitle, { color: COLORS.recruiter.primary }]}>
                Recrutez les meilleurs talents
              </Text>
              <Text style={styles.roleDescription}>
                Publiez vos offres et accédez à un vivier de candidats qualifiés correspondant à vos besoins.
              </Text>
              
              <View style={styles.roleFeatures}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.recruiter.primary} />
                  <Text style={styles.featureText}>Candidats pré-qualifiés</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.recruiter.primary} />
                  <Text style={styles.featureText}>Gestion simplifiée des offres</Text>
                </View>
              </View>
              
              <View style={[styles.cardButton, styles.recruiterButton]}>
                <Text style={styles.cardButtonText}>Commencer</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.neutral.white} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Section Stats */}
        <Animated.View style={[
          styles.statsSection,
          { opacity: statsAnim }
        ]}>
          <Text style={styles.statsTitle}>Rejoignez notre communauté</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: COLORS.candidate.background }]}>
                <Ionicons name="people" size={24} color={COLORS.candidate.primary} />
              </View>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Candidats actifs</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: COLORS.recruiter.background }]}>
                <Ionicons name="business" size={24} color={COLORS.recruiter.primary} />
              </View>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Entreprises</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: COLORS.status.success + '20' }]}>
                <Ionicons name="checkmark-done" size={24} color={COLORS.status.success} />
              </View>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>Taux de match</Text>
            </View>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.copyright}>© 2026 JobMatch Morocco</Text>
          <Text style={styles.footerTagline}>Connecter les talents aux opportunités</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    overflow: 'hidden',
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  gradientCircle1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.candidate.primary + '15',
  },
  gradientCircle2: {
    position: 'absolute',
    top: 50,
    right: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.recruiter.primary + '10',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + SPACING.xl : SPACING.xxl + SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: COLORS.candidate.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPulse: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: COLORS.candidate.primary + '30',
  },
  titleContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.neutral.text,
    letterSpacing: -1,
  },
  countryBadge: {
    backgroundColor: COLORS.candidate.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
  },
  appCountry: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  
  // Tagline
  taglineContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  taglineDivider: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.candidate.primary,
    borderRadius: 2,
    marginTop: SPACING.lg,
  },
  
  // Roles Section
  rolesSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.neutral.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  roleCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.candidate.primary,
  },
  recruiterGlow: {
    backgroundColor: COLORS.recruiter.primary,
  },
  candidateCard: {
    borderColor: COLORS.candidate.primary + '30',
  },
  recruiterCard: {
    borderColor: COLORS.recruiter.primary + '30',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  roleIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidateIcon: {
    backgroundColor: COLORS.candidate.primary,
  },
  recruiterIcon: {
    backgroundColor: COLORS.recruiter.primary,
  },
  roleBadge: {
    marginLeft: SPACING.md,
    backgroundColor: COLORS.candidate.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  recruiterBadge: {
    backgroundColor: COLORS.recruiter.background,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.candidate.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.candidate.primary,
    marginBottom: SPACING.sm,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.neutral.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  roleFeatures: {
    marginBottom: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.neutral.text,
    marginLeft: SPACING.sm,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  candidateButton: {
    backgroundColor: COLORS.candidate.primary,
  },
  recruiterButton: {
    backgroundColor: COLORS.recruiter.primary,
  },
  cardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral.white,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    ...SHADOWS.small,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.neutral.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  footerDivider: {
    width: 100,
    height: 1,
    backgroundColor: COLORS.neutral.border,
    marginBottom: SPACING.lg,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.neutral.textLight,
    fontWeight: '500',
  },
  footerTagline: {
    fontSize: 11,
    color: COLORS.neutral.textLight,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
});

export default WelcomeScreen;