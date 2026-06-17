import { useEffect, useRef } from 'react';
import { submissionsApi } from '../api/submissions';
import { AUTOSAVE_DELAY_MS } from '../config';

export function useAutosave(
  submissionId: number | null,
  questionId: number,
  answerData: string | undefined,
  onSave?: (status: 'saving' | 'saved' | 'error') => void
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | undefined>(undefined);
  const isFirstRun = useRef(true);

  // Initialize lastSavedRef to the initial answerData on mount/first evaluation
  if (isFirstRun.current && answerData !== undefined) {
    lastSavedRef.current = answerData;
    isFirstRun.current = false;
  }

  useEffect(() => {
    if (submissionId == null) return;
    if (answerData === lastSavedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        onSave?.('saving');
        await submissionsApi.saveAnswer({
          submissionId,
          questionId,
          answerData,
        });
        lastSavedRef.current = answerData;
        onSave?.('saved');
      } catch {
        onSave?.('error');
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [submissionId, questionId, answerData, onSave]);
}

