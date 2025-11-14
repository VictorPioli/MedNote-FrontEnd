// Serviço de internacionalização para o frontend
export interface Translation {
  pt: string;
  en: string;
}

export class LanguageService {
  private static currentLanguage: 'pt' | 'en' = 'pt';

  // Traduções da interface
  static readonly UI_TRANSLATIONS: Record<string, Translation> = {
    // Títulos principais
    appTitle: {
      pt: 'MedNote.IA',
      en: 'MedNote.AI'
    },
    appSubtitle: {
      pt: 'Assistente Médico Inteligente',
      en: 'Intelligent Medical Assistant'
    },
    description: {
      pt: 'Transcreva consultas e obtenha diagnósticos assistidos por IA',
      en: 'Transcribe consultations and get AI-assisted diagnoses'
    },

    // Controles de gravação
    startRecording: {
      pt: 'Iniciar Gravação',
      en: 'Start Recording'
    },
    stopRecording: {
      pt: 'Parar Gravação',
      en: 'Stop Recording'
    },
    recording: {
      pt: '🔴 Gravando...',
      en: '🔴 Recording...'
    },
    
    // Estados de processamento
    processing: {
      pt: '⏳ Processando...',
      en: '⏳ Processing...'
    },
    transcribing: {
      pt: '🎧 Transcrevendo áudio...',
      en: '🎧 Transcribing audio...'
    },
    analyzing: {
      pt: '🧠 Analisando sintomas...',
      en: '🧠 Analyzing symptoms...'
    },

    // Seções de conteúdo
    consultationAnalysis: {
      pt: 'Análise da Consulta',
      en: 'Consultation Analysis'
    },
    transcription: {
      pt: 'Transcrição',
      en: 'Transcription'
    },
    diagnosis: {
      pt: 'Diagnóstico',
      en: 'Diagnosis'
    },
    explanation: {
      pt: 'Explicação Detalhada',
      en: 'Detailed Explanation'
    },
    diseases: {
      pt: 'Possíveis Condições',
      en: 'Possible Conditions'
    },
    exams: {
      pt: 'Exames Sugeridos',
      en: 'Suggested Tests'
    },
    medications: {
      pt: 'Medicações',
      en: 'Medications'
    },
    newConsultation: {
      pt: 'Nova Consulta',
      en: 'New Consultation'
    },
    important: {
      pt: 'Importante:',
      en: 'Important:'
    },
    medicalDisclaimer: {
      pt: 'Este sistema é apenas uma ferramenta de apoio. O diagnóstico e tratamento definitivos devem sempre ser realizados por um médico qualificado. Em caso de emergência, procure atendimento médico imediatamente.',
      en: 'This system is only a support tool. Final diagnosis and treatment should always be performed by a qualified doctor. In case of emergency, seek medical attention immediately.'
    },
    audioNotSupported: {
      pt: 'Gravação de áudio não é suportada neste navegador',
      en: 'Audio recording not supported in this browser'
    },
    browserRecommendation: {
      pt: 'Use Chrome, Edge, Firefox ou Safari para melhor experiência',
      en: 'Use Chrome, Edge, Firefox or Safari for better experience'
    },
    finishConsultation: {
      pt: 'Finalizar Consulta',
      en: 'Finish Consultation'
    },
    startRecordingPrompt: {
      pt: 'Clique em "Iniciar Gravação" para começar',
      en: 'Click "Start Recording" to begin'
    },
    audioWillBeTranscribed: {
      pt: 'O áudio será gravado e transcrito automaticamente',
      en: 'Audio will be recorded and transcribed automatically'
    },
    recordingStatus: {
      pt: 'GRAVANDO',
      en: 'RECORDING'
    },
    transcribingStatus: {
      pt: 'TRANSCREVENDO',
      en: 'TRANSCRIBING'
    },
    processingAudio: {
      pt: 'Processando áudio...',
      en: 'Processing audio...'
    },
    recordingAudio: {
      pt: 'Gravando áudio...',
      en: 'Recording audio...'
    },
    words: {
      pt: 'palavras',
      en: 'words'
    },
    characters: {
      pt: 'caracteres',
      en: 'characters'
    },
    noDataAvailable: {
      pt: 'Nenhuma informação disponível',
      en: 'No information available'
    },

    // Chat e histórico
    chat: {
      pt: 'Chat com IA',
      en: 'AI Chat'
    },
    chatTitle: {
      pt: 'Chat com IA - Dúvidas sobre sua consulta',
      en: 'AI Chat - Questions about your consultation'
    },
    chatWelcomeIntro: {
      pt: 'Olá! Estou aqui para esclarecer suas dúvidas sobre a consulta realizada. Posso te ajudar com informações sobre:',
      en: 'Hello! I\'m here to clarify your questions about the consultation performed. I can help you with information about:'
    },
    chatWelcomeDiagnosis: {
      pt: 'Seu diagnóstico',
      en: 'Your diagnosis'
    },
    chatWelcomeExams: {
      pt: 'Exames recomendados',
      en: 'Recommended tests'
    },
    chatWelcomeMedications: {
      pt: 'Medicações sugeridas',
      en: 'Suggested medications'
    },
    chatWelcomeEnd: {
      pt: 'Fique à vontade para fazer suas perguntas!',
      en: 'Feel free to ask your questions!'
    },
    noExamsRecommended: {
      pt: 'Nenhum exame específico recomendado',
      en: 'No specific tests recommended'
    },
    noMedicationsRecommended: {
      pt: 'Nenhuma medicação específica sugerida',
      en: 'No specific medications suggested'
    },
    chatPlaceholder: {
      pt: 'Digite sua pergunta sobre a consulta...',
      en: 'Type your question about the consultation...'
    },
    typing: {
      pt: 'Digitando...',
      en: 'Typing...'
    },
    chatInputHint: {
      pt: '💡 Pressione Enter para enviar, Shift+Enter para nova linha',
      en: '💡 Press Enter to send, Shift+Enter for new line'
    },
    chatError: {
      pt: 'Erro ao enviar mensagem',
      en: 'Error sending message'
    },
    send: {
      pt: 'Enviar',
      en: 'Send'
    },
    history: {
      pt: '📋 Histórico',
      en: '📋 History'
    },
    historyTitle: {
      pt: 'Histórico de Consultas',
      en: 'Consultation History'
    },
    historyStats: {
      pt: 'Estatísticas',
      en: 'Statistics'
    },
    consultationsCount: {
      pt: 'Consultas',
      en: 'Consultations'
    },
    lastConsultation: {
      pt: 'Última consulta',
      en: 'Last consultation'
    },
    mostCommonDiagnoses: {
      pt: 'Diagnósticos mais comuns:',
      en: 'Most common diagnoses:'
    },
    loadingHistory: {
      pt: 'Carregando histórico...',
      en: 'Loading history...'
    },
    historyError: {
      pt: 'Não foi possível carregar o histórico de consultas',
      en: 'Could not load consultation history'
    },
    tryAgain: {
      pt: 'Tentar novamente',
      en: 'Try again'
    },
    noConsultationsFound: {
      pt: 'Nenhuma consulta encontrada',
      en: 'No consultations found'
    },
    consultationsWillAppear: {
      pt: 'Suas consultas aparecerão aqui após serem realizadas.',
      en: 'Your consultations will appear here after being performed.'
    },
    clearHistory: {
      pt: 'Limpar Histórico',
      en: 'Clear History'
    },
    viewRecord: {
      pt: 'Ver',
      en: 'View'
    },
    transcriptionLabel: {
      pt: 'Transcrição:',
      en: 'Transcription:'
    },
    diagnosisLabel: {
      pt: 'Diagnóstico:',
      en: 'Diagnosis:'
    },
    diseasesLabel: {
      pt: 'Doenças:',
      en: 'Diseases:'
    },
    confirmDelete: {
      pt: 'Tem certeza que deseja deletar esta consulta?',
      en: 'Are you sure you want to delete this consultation?'
    },
    confirmClearHistory: {
      pt: 'Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.',
      en: 'Are you sure you want to clear all history? This action cannot be undone.'
    },
    deleteError: {
      pt: 'Erro ao deletar consulta',
      en: 'Error deleting consultation'
    },
    clearHistoryError: {
      pt: 'Erro ao limpar histórico',
      en: 'Error clearing history'
    },
    
    // Estatísticas
    totalConsultations: {
      pt: 'Total de Consultas',
      en: 'Total Consultations'
    },
    todayConsultations: {
      pt: 'Hoje',
      en: 'Today'
    },
    weekConsultations: {
      pt: 'Esta Semana',
      en: 'This Week'
    },

    // Botões de ação
    showExplanation: {
      pt: 'Mostrar Explicação',
      en: 'Show Explanation'
    },
    hideExplanation: {
      pt: 'Ocultar Explicação',
      en: 'Hide Explanation'
    },
    toggleLanguage: {
      pt: 'English',
      en: 'Português'
    },
    delete: {
      pt: 'Deletar',
      en: 'Delete'
    },
    confirm: {
      pt: 'Confirmar',
      en: 'Confirm'
    },
    cancel: {
      pt: 'Cancelar',
      en: 'Cancel'
    },

    // Mensagens de status
    noAudioDetected: {
      pt: 'Nenhum áudio detectado. Tente gravar novamente.',
      en: 'No audio detected. Please try recording again.'
    },
    audioTooShort: {
      pt: 'Áudio muito curto para análise médica.',
      en: 'Audio too short for medical analysis.'
    },
    processingError: {
      pt: 'Erro ao processar. Verifique sua conexão.',
      en: 'Processing error. Check your connection.'
    },
    successful: {
      pt: '✅ Processamento concluído!',
      en: '✅ Processing completed!'
    },

    // Avisos importantes
    disclaimerTitle: {
      pt: '⚠️ Importante',
      en: '⚠️ Important'
    },
    disclaimer: {
      pt: 'Este é um diagnóstico preliminar gerado por IA. Sempre consulte um médico para diagnóstico definitivo.',
      en: 'This is a preliminary diagnosis generated by AI. Always consult a doctor for definitive diagnosis.'
    },

    // Explicações de confiança
    highConfidence: {
      pt: 'Alta Confiança',
      en: 'High Confidence'
    },
    mediumConfidence: {
      pt: 'Confiança Média',
      en: 'Medium Confidence'
    },
    lowConfidence: {
      pt: 'Baixa Confiança',
      en: 'Low Confidence'
    }
  };

  /**
   * Define o idioma atual
   */
  static setLanguage(language: 'pt' | 'en'): void {
    this.currentLanguage = language;
    localStorage.setItem('mednote_language', language);
  }

  /**
   * Obtém o idioma atual
   */
  static getLanguage(): 'pt' | 'en' {
    const saved = localStorage.getItem('mednote_language') as 'pt' | 'en';
    return saved || this.currentLanguage;
  }

  /**
   * Inicializa o idioma do localStorage
   */
  static initializeLanguage(): 'pt' | 'en' {
    const saved = localStorage.getItem('mednote_language') as 'pt' | 'en';
    if (saved) {
      this.currentLanguage = saved;
    }
    return this.currentLanguage;
  }

  /**
   * Obtém tradução para a chave especificada
   */
  static translate(key: string, language?: 'pt' | 'en'): string {
    const lang = language || this.getLanguage();
    const translation = this.UI_TRANSLATIONS[key];
    
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    return translation[lang] || translation.pt;
  }

  /**
   * Obtém todas as traduções para o idioma atual
   */
  static getAllTranslations(language?: 'pt' | 'en'): Record<string, string> {
    const lang = language || this.getLanguage();
    const translations: Record<string, string> = {};
    
    Object.keys(this.UI_TRANSLATIONS).forEach(key => {
      translations[key] = this.translate(key, lang);
    });
    
    return translations;
  }

  /**
   * Detecta idioma do texto (versão simplificada para frontend)
   */
  static detectLanguage(text: string): 'pt' | 'en' {
    if (!text || text.trim().length === 0) {
      return this.getLanguage();
    }

    const lowerText = text.toLowerCase();

    // Palavras comuns em português
    const portugueseWords = ['dor', 'febre', 'tosse', 'sinto', 'estou', 'tenho', 'doutor'];
    // Palavras comuns em inglês  
    const englishWords = ['pain', 'fever', 'cough', 'feel', 'have', 'doctor'];

    let ptScore = 0;
    let enScore = 0;

    portugueseWords.forEach(word => {
      if (lowerText.includes(word)) ptScore++;
    });

    englishWords.forEach(word => {
      if (lowerText.includes(word)) enScore++;
    });

    return enScore > ptScore ? 'en' : 'pt';
  }

  /**
   * Alterna entre idiomas
   */
  static toggleLanguage(): 'pt' | 'en' {
    const newLanguage = this.currentLanguage === 'pt' ? 'en' : 'pt';
    this.setLanguage(newLanguage);
    return newLanguage;
  }

  /**
   * Formata data baseada no idioma
   */
  static formatDate(date: Date, language?: 'pt' | 'en'): string {
    const lang = language || this.getLanguage();
    
    if (lang === 'en') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default LanguageService;