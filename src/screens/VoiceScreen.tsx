import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Field } from '../components/ui';
import { useApp } from '../store/AppProvider';

export function VoiceScreen() {
  const { t, selectedDate, addVoice, addNote, toast } = useApp();
  const nav = useNavigate();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const recRef = useRef<MediaRecorder | null>(null);
  const timer = useRef<number | null>(null);

  const stopTimer = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  };

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast(t('voice.unsupported'));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      rec.start();
      setRecording(true);
      setSeconds(0);
      timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
      rec.onstop = () => stream.getTracks().forEach((tr) => tr.stop());
    } catch {
      toast(t('voice.unsupported'));
    }
  };

  const stop = () => {
    recRef.current?.stop();
    recRef.current = null;
    setRecording(false);
    stopTimer();
  };

  return (
    <main className="page sub">
      <PageHeader title={t('voice.title')} back />
      <div className={`voice-orb ${recording ? 'live' : ''}`}>🎙️</div>
      <p style={{ textAlign: 'center' }} className="muted">
        {recording ? t('voice.recording') : t('voice.duration', { n: seconds })}
      </p>
      <button type="button" className="btn btn-primary" onClick={recording ? stop : start}>
        {recording ? t('voice.stop') : t('voice.start')}
      </button>
      <Field label={t('voice.transcript')}>
        <textarea
          className="textarea"
          placeholder={t('voice.transcriptPh')}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </Field>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          addVoice({
            title: t('voice.title'),
            transcript,
            durationSec: seconds,
            date: selectedDate,
          });
          addNote({
            spaceId: 'space-work',
            title: t('voice.title'),
            body: transcript || t('voice.title'),
            tags: ['语音'],
            date: selectedDate,
            checklist: [],
          });
          toast(t('voice.saved'));
          nav(-1);
        }}
      >
        {t('voice.save')}
      </button>
    </main>
  );
}
