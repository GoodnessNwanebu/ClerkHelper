'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { HPCButton } from '@/components/ui/HPCButton';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Trash2, 
  WifiOff,
  Wifi,
  Clock
} from 'lucide-react';
import { offlineStorage, formatRelativeTime, type OfflineConversation } from '@/lib/utils';
import { toast } from 'sonner';

export default function OfflinePage() {
  const [conversations, setConversations] = useState<OfflineConversation[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Load conversations
  useEffect(() => {
    const loadConversations = () => {
      const stored = offlineStorage.getConversations();
      setConversations(stored);
      setLoading(false);
    };

    loadConversations();
  }, []);

  const handleDownload = (conversation: OfflineConversation) => {
    try {
      const content = offlineStorage.exportConversation(conversation);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clerksmart-${conversation.hpc.diagnosis.toLowerCase().replace(/\s+/g, '-')}-${new Date(conversation.timestamp).toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download conversation');
    }
  };

  const handleDelete = (id: string) => {
    if (offlineStorage.deleteConversation(id)) {
      setConversations(prev => prev.filter(conv => conv.id !== id));
      toast.success('Conversation deleted');
    } else {
      toast.error('Failed to delete conversation');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading saved conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <HPCButton variant="icon" size="icon" className="rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </HPCButton>
              </Link>
              
              {/* Online Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                isOnline 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-slate-100/50 dark:from-blue-900/30 dark:to-slate-800/30 rounded-2xl blur-xl"></div>
              <div className="relative flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/60 dark:border-slate-700/60 shadow-lg">
                <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Offline History
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {conversations.length} saved conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-blue-100/50 dark:from-slate-800/30 dark:to-blue-900/30 rounded-2xl blur-xl"></div>
              <div className="relative flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/60 dark:border-slate-700/60 shadow-lg">
                <BookOpen className="h-10 w-10 text-slate-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-3">
              No saved conversations yet
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6 max-w-md mx-auto">
              Generate your first HPC guide to see it saved here for offline access.
            </p>
            <Link href="/">
              <HPCButton variant="primary" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </HPCButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className="group overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-5">
                  <Link href={`/hpc/${encodeURIComponent(conversation.hpc.diagnosis)}?offline=true&id=${conversation.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {conversation.hpc.diagnosis}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {formatRelativeTime(conversation.timestamp)}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownload(conversation);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(conversation.id);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 