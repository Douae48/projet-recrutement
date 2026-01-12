// src/screens/PostJobScreen.js
// Écran de publication d'offre d'emploi - Recruteur

import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import SkillBadge from '../components/SkillBadge';
import { postJob } from '../api/jobs';

const { width } = Dimensions.get('window');
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const PostJobScreen = () => {
  const { userData } = useContext(AuthContext);
  const themeColors = COLORS.recruiter;
  
  const [title, setTitle] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Ajouter une compétence requise
  const handleAddSkill = () => {
    const skillLabel = newSkill.trim();
    if (!skillLabel) return;
    
    if (skills.includes(skillLabel)) {
      setErrorMessage('Cette compétence est déjà ajoutée.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setSkills([...skills, skillLabel]);
    setNewSkill('');
  };

  // Supprimer une compétence
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Publier l'offre - Appel à POST /api/data/post-job
  const handlePostJob = async () => {
    setErrorMessage('');
    setSuccessMessage(false);
    
    if (!title.trim()) {
      setErrorMessage('Veuillez saisir un titre pour l\'offre.');
      return;
    }
    
    if (!salaryRange.trim()) {
      setErrorMessage('Veuillez indiquer une fourchette salariale.');
      return;
    }
    
    if (skills.length === 0) {
      setErrorMessage('Ajoutez au moins une compétence requise.');
      return;
    }

    setLoading(true);
    try {
      // Appel API avec les champs attendus par le backend
      await postJob({
        title: title.trim(),
        salaryRange: salaryRange.trim(),
        skills: skills,
      });
      
      setSuccessMessage(true);
      setTimeout(() => {
        resetForm();
        setSuccessMessage(false);
      }, 2500);
    } catch (error) {
      setErrorMessage('Impossible de publier l\'offre.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSalaryRange('');
    setSkills([]);
    setNewSkill('');
  };

  // Suggestions de compétences populaires
  const suggestedSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Agile', 'Communication', 'Leadership'];
  const filteredSuggestions = suggestedSkills.filter(s => !skills.includes(s));

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header 
        title="Nouvelle Offre" 
        subtitle="Publiez une opportunité"
        backgroundColor={themeColors.primary}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Message de succès */}
        {successMessage && (
          <View style={styles.successBanner}>
            <View style={styles.successContent}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.status.success} />
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>Offre publiée !</Text>
                <Text style={styles.successSubtitle}>Visible par les candidats maintenant</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Message d'erreur */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <View style={styles.errorContent}>
              <Ionicons name="alert-circle" size={24} color={COLORS.status.error} />
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorTitle}>Erreur</Text>
                <Text style={styles.errorSubtitle}>{errorMessage}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Titre de l'offre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Titre du poste *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="briefcase-outline" size={20} color={COLORS.neutral.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Développeur Full Stack"
              placeholderTextColor={COLORS.neutral.placeholder}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* Salaire */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fourchette salariale *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={20} color={COLORS.neutral.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 15 000 - 25 000 MAD"
              placeholderTextColor={COLORS.neutral.placeholder}
              value={salaryRange}
              onChangeText={setSalaryRange}
            />
          </View>
        </View>

        {/* Compétences requises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Compétences requises *</Text>
            <Text style={styles.skillCount}>{skills.length} ajoutées</Text>
          </View>
          
          {/* Liste des skills ajoutées */}
          {skills.length > 0 && (
            <View style={styles.skillsGrid}>
              {skills.map((skill, index) => (
                <SkillBadge 
                  key={index}
                  label={skill}
                  variant="success"
                  removable
                  onRemove={() => handleRemoveSkill(skill)}
                />
              ))}
            </View>
          )}
          
          {/* Input pour ajouter */}
          <View style={styles.addSkillRow}>
            <View style={styles.skillInputWrapper}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.neutral.textSecondary} />
              <TextInput
                style={styles.skillInput}
                placeholder="Ajouter une compétence..."
                placeholderTextColor={COLORS.neutral.placeholder}
                value={newSkill}
                onChangeText={setNewSkill}
                onSubmitEditing={handleAddSkill}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: themeColors.primary }]}
              onPress={handleAddSkill}
            >
              <Ionicons name="add" size={24} color={COLORS.neutral.white} />
            </TouchableOpacity>
          </View>
          
          {/* Suggestions rapides */}
          {filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsLabel}>Ajouter rapidement :</Text>
              <View style={styles.suggestionsGrid}>
                {filteredSuggestions.slice(0, 4).map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => {
                      if (!skills.includes(suggestion)) {
                        setSkills([...skills, suggestion]);
                      }
                    }}
                  >
                    <Text style={styles.suggestionText}>+ {suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Aperçu */}
        {(title || salaryRange || skills.length > 0) && (
          <View style={[styles.previewCard, { borderColor: themeColors.primary }]}>
            <Text style={styles.previewTitle}>Aperçu de l'offre</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewJobTitle}>{title || 'Titre du poste'}</Text>
              <Text style={styles.previewSalary}>{salaryRange || 'Salaire non défini'}</Text>
              {skills.length > 0 && (
                <View style={styles.previewSkills}>
                  {skills.map((s, i) => (
                    <View key={i} style={styles.previewSkillBadge}>
                      <Text style={styles.previewSkillText}>{s}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Bouton Publier */}
        <TouchableOpacity
          style={[
            styles.submitButton, 
            { backgroundColor: themeColors.primary },
            loading && styles.submitButtonDisabled
          ]}
          onPress={handlePostJob}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.neutral.white} />
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color={COLORS.neutral.white} />
              <Text style={styles.submitButtonText}>Publier l'offre</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginBottom: SPACING.sm,
  },
  skillCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.text,
    marginLeft: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  addSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  skillInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.text,
    marginLeft: SPACING.sm,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  suggestionsContainer: {
    marginTop: SPACING.md,
  },
  suggestionsLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.sm,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: COLORS.recruiter.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.recruiter.primary,
    borderStyle: 'dashed',
  },
  suggestionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.recruiter.primary,
  },
  previewCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  previewTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.sm,
  },
  previewContent: {},
  previewJobTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginBottom: SPACING.xs,
  },
  previewSalary: {
    ...TYPOGRAPHY.body,
    color: COLORS.status.success,
    marginBottom: SPACING.sm,
  },
  previewSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewSkillBadge: {
    backgroundColor: COLORS.neutral.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  previewSkillText: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.textSecondary,
  },
  successBanner: {
    backgroundColor: COLORS.status.success + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.success,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  successTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.status.success,
  },
  successSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
  },
  errorBanner: {
    backgroundColor: COLORS.status.error + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  errorTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.status.error,
  },
  errorSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: 2,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.white,
    marginLeft: SPACING.sm,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default PostJobScreen;
