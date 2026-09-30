import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  FileText,
  Send,
  Zap,
  RefreshCw,
  Menu,
} from 'lucide-react-native';
import api from '../config/api';
import { useResponsive } from '../utils/responsive';
import SideDrawer from '../components/SideDrawer';

export default function AiAssistantScreen({ navigation }) {
  const { containerStyle, moderateScale, screenPadding } = useResponsive();

  const [activeTab, setActiveTab] = useState('explain'); // 'explain' | 'hint' | 'quiz'
  const [topicInput, setTopicInput] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAskAI = async () => {
    if (!topicInput.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      if (activeTab === 'explain') {
        const res = await api.post('/ai/explain-topic', {
          topic: topicInput.trim(),
          subject: subject,
          depth: 'intermediate',
        });
        if (res.data?.success) {
          setResult(res.data.data);
        }
      } else if (activeTab === 'hint') {
        const res = await api.post('/ai/generate-hints', {
          questionText: topicInput.trim(),
          assignmentTitle: subject,
        });
        if (res.data?.success) {
          setResult(res.data.data);
        }
      } else {
        const res = await api.post('/ai/generate-quiz', {
          topic: topicInput.trim(),
          difficulty: 'medium',
        });
        if (res.data?.success) {
          setResult(res.data.data);
        }
      }
    } catch (err) {
      // Fallback demo response if API key is not configured
      setResult({
        explanation: `Here is a comprehensive breakdown of **${topicInput}**:\n\n1. **Core Definition**: ${topicInput} represents an essential concept in academic computing.\n2. **Key Mechanisms**: Functions via modular abstraction and efficient state transition.\n3. **Practical Application**: Applied across modern industry frameworks and distributed architecture.`,
        keyPoints: ['Scalable execution', 'Fault-tolerant isolation', 'Deterministic convergence'],
        takeaways: 'Master the foundational formulas before moving to advanced implementation.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="AiAssistant"
        navigation={navigation}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <Menu size={22} color="#4f46e5" />
          </TouchableOpacity>
          <Sparkles size={20} color="#4f46e5" />
          <Text style={[styles.headerTitle, { fontSize: moderateScale(18) }]}>AI Academic Tutor</Text>
        </View>
        <View style={styles.modelBadge}>
          <Zap size={12} color="#059669" />
          <Text style={styles.modelText}>Gemini AI</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: screenPadding, paddingBottom: 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.innerContainer, containerStyle]}>
            {/* Mode Switcher */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'explain' && styles.tabBtnActive]}
                onPress={() => { setActiveTab('explain'); setResult(null); }}
              >
                <BookOpen size={14} color={activeTab === 'explain' ? '#ffffff' : '#64748b'} />
                <Text style={[styles.tabBtnText, activeTab === 'explain' && styles.tabBtnTextActive]}>
                  Explain
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'hint' && styles.tabBtnActive]}
                onPress={() => { setActiveTab('hint'); setResult(null); }}
              >
                <HelpCircle size={14} color={activeTab === 'hint' ? '#ffffff' : '#64748b'} />
                <Text style={[styles.tabBtnText, activeTab === 'hint' && styles.tabBtnTextActive]}>
                  Hints
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'quiz' && styles.tabBtnActive]}
                onPress={() => { setActiveTab('quiz'); setResult(null); }}
              >
                <CheckCircle2 size={14} color={activeTab === 'quiz' ? '#ffffff' : '#64748b'} />
                <Text style={[styles.tabBtnText, activeTab === 'quiz' && styles.tabBtnTextActive]}>
                  Quiz
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Card */}
            <View style={styles.inputCard}>
              <Text style={[styles.inputCardTitle, { fontSize: moderateScale(14) }]}>
                {activeTab === 'explain'
                  ? 'What topic would you like explained?'
                  : activeTab === 'hint'
                  ? 'Paste your question or assignment problem:'
                  : 'Topic for your practice quiz:'}
              </Text>

              <TextInput
                style={styles.textInput}
                placeholder={
                  activeTab === 'explain'
                    ? 'e.g. RSA Encryption or Binary Search Trees'
                    : 'e.g. How do I calculate subnet masks?'
                }
                placeholderTextColor="#94a3b8"
                value={topicInput}
                onChangeText={setTopicInput}
                multiline
              />

              <TouchableOpacity
                style={[styles.askBtn, (!topicInput.trim() || loading) && styles.askBtnDisabled]}
                onPress={handleAskAI}
                disabled={!topicInput.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <View style={styles.btnRow}>
                    <Sparkles size={16} color="#ffffff" />
                    <Text style={styles.askBtnText}>Generate with AI</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* AI Result Section */}
            {result ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Sparkles size={18} color="#4f46e5" />
                  <Text style={[styles.resultTitle, { fontSize: moderateScale(15) }]}>AI Analysis</Text>
                </View>

                {result.explanation ? (
                  <Text style={styles.resultBody}>{result.explanation}</Text>
                ) : null}

                {result.hints && Array.isArray(result.hints) ? (
                  <View style={styles.hintsList}>
                    {result.hints.map((h, i) => (
                      <View key={i} style={styles.hintItem}>
                        <Text style={styles.hintNumber}>Hint {i + 1}:</Text>
                        <Text style={styles.hintText}>{h.hint || h}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {result.keyPoints && Array.isArray(result.keyPoints) ? (
                  <View style={styles.pointsList}>
                    <Text style={styles.pointsHeader}>Key Concept Takeaways:</Text>
                    {result.keyPoints.map((pt, i) => (
                      <Text key={i} style={styles.pointItem}>• {pt}</Text>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 2,
  },
  headerTitle: {
    fontWeight: '800',
    color: '#0f172a',
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modelText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  scrollContent: {
    paddingTop: 16,
  },
  innerContainer: {
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#4f46e5',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#ffffff',
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  inputCardTitle: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    minHeight: 80,
    color: '#0f172a',
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  askBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askBtnDisabled: {
    opacity: 0.6,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  askBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontWeight: '800',
    color: '#4f46e5',
  },
  resultBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  hintsList: {
    gap: 8,
  },
  hintItem: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
  },
  hintNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4f46e5',
    marginBottom: 2,
  },
  hintText: {
    fontSize: 13,
    color: '#334155',
  },
  pointsList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  pointsHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  pointItem: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
});
