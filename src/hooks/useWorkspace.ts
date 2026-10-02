import { useEffect, useState } from 'react';
import { allInterests, defaultInterests, majors, type InterestProfile, type RankingMode } from '../data/majors';

function readStorage(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

function readProfile(): InterestProfile {
  const raw = readStorage('wayfinder-interests');
  if (!raw || typeof raw !== 'object') return { ...defaultInterests };
  const profile = { ...defaultInterests };
  for (const { key } of allInterests) {
    const value = (raw as Record<string, unknown>)[key];
    if (typeof value === 'number' && Number.isFinite(value)) profile[key] = Math.max(0, Math.min(100, value));
  }
  return profile;
}

export function useWorkspace() {
  const [profile, setProfile] = useState<InterestProfile>(readProfile);
  const [personalized, setPersonalized] = useState(() => readStorage('wayfinder-personalized') === true);
  const [saved, setSaved] = useState<string[]>(() => {
    const raw = readStorage('wayfinder-saved');
    return Array.isArray(raw) ? [...new Set(raw.filter((id): id is string => typeof id === 'string' && majors.some(major => major.id === id)))] : [];
  });
  const [mode, setMode] = useState<RankingMode>(() => {
    const raw = readStorage('wayfinder-mode');
    return raw === 'passion' || raw === 'outlook' ? raw : 'balanced';
  });
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('wayfinder-interests', JSON.stringify(profile));
      localStorage.setItem('wayfinder-personalized', JSON.stringify(personalized));
      localStorage.setItem('wayfinder-saved', JSON.stringify(saved));
      localStorage.setItem('wayfinder-mode', JSON.stringify(mode));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [profile, personalized, saved, mode]);

  return { profile, setProfile, personalized, setPersonalized, saved, setSaved, mode, setMode, storageError };
}