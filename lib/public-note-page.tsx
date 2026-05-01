import React, { useEffect, useMemo, useState } from 'react';
import { render } from 'react-dom';
import './public-note-page.scss';

type PublicNote = {
  id: string;
  title?: string;
  content?: string;
  updatedAt?: string;
};

const PublicNotePage = ({ noteId }: { noteId: string }) => {
  const [note, setNote] = useState<PublicNote | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const apiUrl = useMemo(() => `/api/public-notes/${noteId}`, [noteId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Public note not found');
        }
        const data = (await response.json()) as PublicNote;
        if (!cancelled) {
          setNote(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load note');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="app public-note-page">
        <main className="public-note-page__content">
          <h1 className="public-note-page__title">Loading...</h1>
          <div className="public-note-page__meta">
            Preparing public note preview.
          </div>
        </main>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="app public-note-page">
        <main className="public-note-page__content">
          <h1 className="public-note-page__title">Public note preview</h1>
          <div className="public-note-page__error">
            {error || 'This public note is unavailable.'}
          </div>
          <div className="public-note-page__meta">Note ID: {noteId}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app public-note-page">
      <main className="public-note-page__content">
        <h1 className="public-note-page__title">{note.title || 'Untitled'}</h1>
        <div className="public-note-page__meta">
          {note.updatedAt ? `Updated ${note.updatedAt}` : null}
        </div>
        <pre className="public-note-page__body">{note.content || ''}</pre>
      </main>
    </div>
  );
};

const bootPublicNotePage = (noteId: string) => {
  render(<PublicNotePage noteId={noteId} />, document.getElementById('root'));
};

export default bootPublicNotePage;
