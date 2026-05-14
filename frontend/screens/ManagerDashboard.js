import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  clearSession,
  getIssuesRequest,
  logoutRequest,
} from '../services/api';

const STATUS_OPTIONS = ['all', 'Pending', 'In Progress', 'Resolved'];
const SORT_OPTIONS = [
  { label: 'Date', value: 'date' },
  { label: 'Status', value: 'status' },
  { label: 'Category', value: 'category' },
];

function formatDate(value) {
  if (!value) return 'No date';

  const date = new Date(value);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusStyle(status) {
  const cleanStatus = String(status || '').toLowerCase();

  if (cleanStatus.includes('progress')) {
    return styles.statusInProgress;
  }

  if (cleanStatus.includes('resolved') || cleanStatus.includes('closed')) {
    return styles.statusResolved;
  }

  return styles.statusPending;
}

function SummaryTile({ label, value }) {
  return (
    <View style={styles.summaryTile}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function FilterChip({ label, selected, onPress }) {
  return (
    <Pressable
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterChipText,
          selected && styles.filterChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function IssueCard({ issue, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBox}>
          <Text style={styles.category}>{issue.category || 'General'}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {issue.title || 'Campus Issue'}
          </Text>
        </View>

        <View style={[styles.statusBadge, getStatusStyle(issue.status)]}>
          <Text style={styles.statusText}>{issue.status || 'Pending'}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {issue.description || 'No description was added for this issue.'}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Location: {issue.location || 'Not specified'}
        </Text>
        <Text style={styles.footerText}>
          Reported: {formatDate(issue.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ManagerDashboard({ onLogout }) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutRequest();
    } catch {
      // Clear local session even if request fails
    } finally {
      await clearSession();
      onLogout();
      setIsLoggingOut(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facility manager dashboard</Text>
      <Text style={styles.body}>Assign and manage maintenance issues.</Text>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log out</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  list: {
    padding: 16,
    paddingBottom: 28,
  },
  emptyList: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    paddingBottom: 14,
  },
  headerTextBox: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  screenSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  logoutButton: {
    minWidth: 82,
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  summaryTile: {
    flex: 1,
    minHeight: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  summaryLabel: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
  },
  searchInput: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    color: '#111827',
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  compactInput: {
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    color: '#111827',
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  filterSection: {
    marginTop: 14,
  },
  filterLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    minHeight: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  filterChipSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#DBEAFE',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  filterChipTextSelected: {
    color: '#1E3A8A',
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    minHeight: 38,
    borderRadius: 10,
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitleBox: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    marginTop: 10,
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusInProgress: {
    backgroundColor: '#DBEAFE',
  },
  statusResolved: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  centered: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },
  errorBox: {
    marginBottom: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    padding: 14,
  },
  errorText: {
    color: '#991B1B',
    marginBottom: 10,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#991B1B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyBox: {
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

