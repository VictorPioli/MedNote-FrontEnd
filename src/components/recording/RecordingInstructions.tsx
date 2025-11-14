import React from 'react';
import { RecordingMode } from '../../services/audioRecorder';
import './RecordingInstructions.css';

interface RecordingInstructionsProps {
  mode: RecordingMode;
  isVisible: boolean;
}

export const RecordingInstructions: React.FC<RecordingInstructionsProps> = ({
  mode,
  isVisible
}) => {
  if (!isVisible) return null;

  const getInstructions = () => {
    switch (mode) {
      case 'microphone':
        return {
          title: '🎤 Gravação com Microfone',
          steps: [
            'Certifique-se de que o microfone está funcionando',
            'Fale claramente e próximo ao microfone',
            'Evite ruídos de fundo quando possível',
            'Clique em "Iniciar Gravação" quando estiver pronto'
          ],
          tips: 'Dica: O áudio é otimizado automaticamente para melhor transcrição.'
        };

      case 'system':
        return {
          title: '🖥️ Gravação de Reunião/Sistema',
          steps: [
            'Abra sua reunião (Meet, Zoom, Teams, etc.)',
            'Clique em "Iniciar Gravação"',
            'Selecione a ABA da reunião na lista',
            '⚠️ IMPORTANTE: Marque "Compartilhar áudio"',
            'Confirme a seleção'
          ],
          tips: '⚠️ Atenção: Se não marcar "Compartilhar áudio", a gravação será silenciosa!'
        };

      case 'both':
        return {
          title: '🎤+🖥️ Gravação Híbrida',
          steps: [
            'Abra sua reunião (Meet, Zoom, Teams, etc.)',
            'Certifique-se de que o microfone está funcionando',
            'Clique em "Iniciar Gravação"',
            'Permita acesso ao microfone',
            'Selecione a ABA da reunião',
            '⚠️ IMPORTANTE: Marque "Compartilhar áudio"',
            'Confirme ambas as seleções'
          ],
          tips: 'Ideal para reuniões onde você participa ativamente falando.'
        };

      default:
        return { title: '', steps: [], tips: '' };
    }
  };

  const instructions = getInstructions();

  return (
    <div className="recording-instructions">
      <h3>{instructions.title}</h3>
      <div className="instruction-content">
        <div className="steps">
          <h4>Passos:</h4>
          <ol>
            {instructions.steps.map((step, index) => (
              <li key={index} className={step.includes('IMPORTANTE') ? 'important' : ''}>
                {step}
              </li>
            ))}
          </ol>
        </div>
        {instructions.tips && (
          <div className="tips">
            <p>{instructions.tips}</p>
          </div>
        )}
      </div>
    </div>
  );
};