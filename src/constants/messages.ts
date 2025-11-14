/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  TRANSCRIPTION: 'Erro ao transcrever áudio. Tente novamente.',
  DIAGNOSIS: 'Erro ao gerar diagnóstico. Tente novamente.',
  CHAT: 'Erro ao enviar mensagem. Tente novamente.',
  HISTORY: 'Erro ao carregar histórico. Tente novamente.',
  DELETE: 'Erro ao deletar consulta. Tente novamente.',
  RECORDING: 'Erro ao gravar áudio. Verifique as permissões.',
  GENERIC: 'Ocorreu um erro inesperado. Tente novamente.'
} as const;

/**
 * Status de carregamento
 */
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;