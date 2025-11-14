import React, { useEffect, useState } from 'react';
import './AudioVisualizer.css';

interface AudioVisualizerProps {
  isRecording: boolean;
  mode: 'microphone' | 'system' | 'both';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  mode
}) => {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    
    if (isRecording) {
      // Simular níveis de áudio para indicar que está gravando
      const animate = () => {
        const level = Math.random() * 0.7 + 0.1; // Entre 0.1 e 0.8
        setAudioLevel(level);
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setAudioLevel(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRecording]);

  if (!isRecording) {
    return null;
  }

  const getModeIcon = () => {
    switch (mode) {
      case 'microphone':
        return '🎤';
      case 'system':
        return '🖥️';
      case 'both':
        return '🎤+🖥️';
      default:
        return '🎤';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'microphone':
        return 'Gravando Microfone';
      case 'system':
        return 'Gravando Sistema';
      case 'both':
        return 'Gravando Ambos';
      default:
        return 'Gravando';
    }
  };

  return (
    <div className="audio-visualizer">
      <div className="visualizer-header">
        <span className="mode-icon">{getModeIcon()}</span>
        <span className="mode-label">{getModeLabel()}</span>
        <span className="recording-indicator">🔴 REC</span>
      </div>
      
      <div className="audio-bars">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="audio-bar"
            style={{
              height: `${Math.max(10, (audioLevel * 100) * (Math.random() * 0.5 + 0.5))}%`,
              animationDelay: `${index * 50}ms`
            }}
          />
        ))}
      </div>
      
      <div className="recording-time">
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};