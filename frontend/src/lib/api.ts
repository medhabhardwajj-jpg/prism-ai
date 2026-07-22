import { useQuery, useMutation } from '@tanstack/react-query';

// ==========================================
// DREAM ARCHITECT
// ==========================================
export const useGetDreamStats = () => {
  return useQuery({
    queryKey: ['dreamStats'],
    queryFn: async () => {
      const res = await fetch('/api/dream-stats');
      if (!res.ok) throw new Error('Failed to fetch Dream stats');
      return res.json();
    },
  });
};

// ==========================================
// VOICE OF LEGENDS
// ==========================================
export const useListVoiceSessions = () => {
  return useQuery({
    queryKey: ['voiceSessions'],
    queryFn: async () => {
      const res = await fetch('/api/voice/sessions');
      if (!res.ok) throw new Error('Failed to fetch sessions');
      return res.json();
    },
  });
};

export const useGetVoiceSession = (sessionId: number | null) => {
  return useQuery({
    queryKey: ['voiceSession', sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/voice/sessions/${sessionId}`);
      if (!res.ok) throw new Error('Failed to fetch session');
      return res.json();
    },
    // Only run this query if a sessionId actually exists
    enabled: !!sessionId,
  });
};

export const useCreateVoiceSession = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: { personaId: string, personaName: string } }) => {
      const res = await fetch('/api/voice/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create session');
      return res.json();
    },
  });
};

// ==========================================
// PERSONA X
// ==========================================
export const useCreateAssessment = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: { answers: Record<string, string> } }) => {
      const res = await fetch('/api/personax/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save assessment');
      return res.json();
    },
  });
};

// ==========================================
// ALTVERSE
// ==========================================
export const useCreateScenario = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const res = await fetch('/api/altverse/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create scenario');
      return res.json();
    },
  });
};