// Utilitário de Saudação Temporal e Personalizada para o JARVES

export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
};

export const getPersonalizedWelcome = (userName: string, alias?: string): string => {
  const greeting = getTimeGreeting();
  const displayName = alias || userName || 'Comandante';
  return `${greeting}, ${displayName}! Todos os sistemas do JARVES estão operacionais às suas ordens.`;
};

export const speakGreeting = async (text: string, customApiKey?: string): Promise<void> => {
  const keyToUse = customApiKey || localStorage.getItem('jarves_tts_api_key') || 'sk_0db4bf3a189c2745b186a2464108519137e709c5e045a1f9';

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': keyToUse
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.85
        }
      })
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await audio.play();
      return;
    }
  } catch (e) {
    console.warn('ElevenLabs TTS fallback', e);
  }

  // Fallback Web Speech Synthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  }
};
