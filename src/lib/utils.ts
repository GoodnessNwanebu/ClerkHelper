import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(date);
}

// Debounce function for search
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Capitalize first letter of each word
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

// Sanitize diagnosis input
export function sanitizeDiagnosis(diagnosis: string): string {
  return diagnosis
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch (fallbackErr) {
      console.error('Copy to clipboard failed:', fallbackErr);
      return false;
    }
  }
}

// Check if running in browser
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (!isBrowser()) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

// Format history section for copying
export function formatSectionForCopy(title: string, questions: (string | { question: string; hint?: string })[]): string {
  const formattedQuestions = questions.map((q, i) => {
    const questionText = typeof q === 'string' ? q : q.question;
    const hint = typeof q === 'object' ? q.hint : undefined;
    
    let formatted = `${i + 1}. ${questionText}`;
    if (hint) {
      formatted += `\n   💡 ${hint}`;
    }
    return formatted;
  });
  
  return `${title}:\n${formattedQuestions.join('\n')}\n`;
}

// ==============================
// OFFLINE STORAGE INFRASTRUCTURE
// ==============================

export interface HPCQuestion {
  question: string;
  rationale: string;
}

export interface PresentingComplaint {
  complaint: string;
  description: string;
  questions: HPCQuestion[];
}

export interface HPCResponse {
  diagnosis: string;
  specialty: 'cardiology' | 'respiratory' | 'gastroenterology' | 'neurology' | 'endocrinology' | 'nephrology' | 'rheumatology' | 'hematology' | 'infectious diseases' | 'emergency medicine' | 'pediatrics' | 'obs & gynae';
  patient_age: number;
  presenting_complaints: PresentingComplaint[];
}

export interface OfflineConversation {
  id: string;
  timestamp: string;
  hpc: HPCResponse;
}

const OFFLINE_STORAGE_KEY = 'clerkSmart_offlineConversations';
const MAX_OFFLINE_CONVERSATIONS = 20;

export const offlineStorage = {
  // Save a new conversation with smart deduplication
  saveConversation: (hpcData: HPCResponse): string => {
    if (!isBrowser()) return '';
    
    try {
      const conversations = offlineStorage.getConversations();
      const conversationId = generateId();
      
      // Check for duplicate by diagnosis (prevent saving same diagnosis multiple times)
      const existingIndex = conversations.findIndex(
        conv => conv.hpc.diagnosis.toLowerCase() === hpcData.diagnosis.toLowerCase()
      );
      
      const newConversation: OfflineConversation = {
        id: conversationId,
        timestamp: new Date().toISOString(),
        hpc: hpcData
      };
      
      if (existingIndex !== -1) {
        // Replace existing conversation with same diagnosis
        conversations[existingIndex] = newConversation;
      } else {
        // Add new conversation
        conversations.unshift(newConversation);
        
        // Keep only the most recent MAX_OFFLINE_CONVERSATIONS
        if (conversations.length > MAX_OFFLINE_CONVERSATIONS) {
          conversations.splice(MAX_OFFLINE_CONVERSATIONS);
        }
      }
      
      storage.set(OFFLINE_STORAGE_KEY, conversations);
      return conversationId;
    } catch (error) {
      console.error('Failed to save offline conversation:', error);
      return '';
    }
  },

  // Get all conversations sorted by timestamp (newest first)
  getConversations: (): OfflineConversation[] => {
    if (!isBrowser()) return [];
    
    try {
      const conversations = storage.get<OfflineConversation[]>(OFFLINE_STORAGE_KEY, []);
      return conversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Failed to get offline conversations:', error);
      return [];
    }
  },

  // Get a specific conversation by ID
  getConversationById: (id: string): OfflineConversation | null => {
    if (!isBrowser()) return null;
    
    try {
      const conversations = offlineStorage.getConversations();
      return conversations.find(conv => conv.id === id) || null;
    } catch (error) {
      console.error('Failed to get offline conversation:', error);
      return null;
    }
  },

  // Delete a specific conversation
  deleteConversation: (id: string): boolean => {
    if (!isBrowser()) return false;
    
    try {
      const conversations = offlineStorage.getConversations();
      const filteredConversations = conversations.filter(conv => conv.id !== id);
      storage.set(OFFLINE_STORAGE_KEY, filteredConversations);
      return true;
    } catch (error) {
      console.error('Failed to delete offline conversation:', error);
      return false;
    }
  },

  // Export conversation as formatted text for download
  exportConversation: (conversation: OfflineConversation): string => {
    const { hpc, timestamp } = conversation;
    const date = formatDate(timestamp);
    
    const content = `ClerkSmart HPC Guide - ${hpc.diagnosis}
Generated: ${date}
Specialty: ${hpc.specialty}
${hpc.patient_age ? `Patient Age: ${hpc.patient_age} years` : ''}

=====================================

${hpc.presenting_complaints.map((pc, i) => 
  `${i + 1}. ${pc.complaint}
   ${pc.description}

   Questions to ask:
${pc.questions.map((q, qi) => 
  `   ${qi + 1}. "${q.question}"
      → ${q.rationale}`
).join('\n')}
`
).join('\n')}

=====================================
Generated by ClerkSmart - AI Medical History Assistant
Remember: Always adapt questions based on patient responses and clinical context.`;

    return content;
  },

  // Clear all offline conversations
  clearAll: (): boolean => {
    if (!isBrowser()) return false;
    
    try {
      storage.remove(OFFLINE_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear offline conversations:', error);
      return false;
    }
  }
}; 