// src/components/JobCard.js
// Carte d'offre d'emploi avec score de matching coloré

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS, getMatchColor } from '../utils/theme';

const JobCard = ({ job, onPress }) => {
  const matchColor = getMatchColor(job.matchScore);
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Badge de score */}
      <View style={[styles.scoreBadge, { backgroundColor: matchColor }]}>
        <Text style={styles.scoreText}>{job.matchScore}%</Text>
        <Text style={styles.matchLabel}>Match</Text>
      </View>
      
      {/* Contenu principal */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
        
        <View style={styles.companyRow}>
          <Ionicons name="business-outline" size={16} color={COLORS.neutral.textSecondary} />
          <Text style={styles.company}>{job.companyName}</Text>
        </View>
        
        <View style={styles.salaryRow}>
          <Ionicons name="cash-outline" size={16} color={COLORS.status.success} />
          <Text style={styles.salary}>{job.salaryRange || job.salary}</Text>
        </View>
        
        {/* Skills requis */}
        {job.skills && job.skills.length > 0 && (
          <View style={styles.skillsContainer}>
            {job.skills.slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {job.skills.length > 3 && (
              <View style={styles.moreSkillsBadge}>
                <Text style={styles.moreSkillsText}>+{job.skills.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      {/* Indicateur de niveau de match */}
      <View style={[styles.matchIndicator, { backgroundColor: matchColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  scoreBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    minWidth: 60,
  },
  scoreText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.white,
    fontSize: 18,
  },
  matchLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.white,
    opacity: 0.9,
    fontSize: 10,
  },
  content: {
    paddingRight: 80,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginBottom: SPACING.sm,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  company: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginLeft: SPACING.xs,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  salary: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.status.success,
    marginLeft: SPACING.xs,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  skillBadge: {
    backgroundColor: COLORS.neutral.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  skillText: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.textSecondary,
  },
  moreSkillsBadge: {
    backgroundColor: COLORS.candidate.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  moreSkillsText: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.white,
  },
  matchIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
  },
});

export default JobCard;