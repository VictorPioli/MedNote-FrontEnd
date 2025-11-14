/**
 * Constantes da API
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://mednote-backend.onrender.com',
  TIMEOUT: 30000,
  ENDPOINTS: {
    TRANSCRIBE: '/api/transcribe',
    DIAGNOSE: '/api/diagnose',
    CHAT: '/api/chat',
    CONSULTATIONS: '/api/consultations',
    HEALTH: '/api/health'
  }
} as const;

/**
 * Constantes da aplicação
 */
export const APP_CONFIG = {
  MAX_RECORDS: 50,
  RECORDING_MAX_DURATION: 300000, // 5 minutos
  DEFAULT_LANGUAGE: 'pt' as const,
  SUPPORTED_LANGUAGES: ['pt', 'en'] as const
} as const;

/**
 * Constantes de UI
 */
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000
} as const;