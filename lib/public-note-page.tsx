import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { renderNoteToHtml } from './utils/render-note-to-html';
import './public-note-page.scss';

const ensureSupabase = async () => {
  const { getSupabaseClient } = await import('./sync/supabase-client');
  return getSupabaseClient();
};

type PublicNote = {
  id: string;
  title?: string;
  content?: string;
  updatedAt?: string;
};

const PublicNotePage = ({ noteId }: { noteId: string }) => {
  const [note, setNote] = useState<PublicNote | null>(null);
  const [html, setHtml] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const supabase = await ensureSupabase();
        if (!supabase) {
          throw new Error('Supabase is not configured');
        }

        const { data, error: queryError } = await supabase
          .from('public_notes')
          .select('id,title,content,updated_at')
          .or(`id.eq.${noteId},note_id.eq.${noteId}`)
          .limit(1)
          .maybeSingle();

        if (queryError) throw queryError;
        if (!data) throw new Error('Public note not found');
        if (cancelled) return;

        const noteData: PublicNote = {
          id: data.id,
          title: data.title,
          content: data.content,
          updatedAt: data.updated_at,
        };

        const renderedHtml = await renderNoteToHtml(data.content || '');

        if (!cancelled) {
          setNote(noteData);
          setHtml(renderedHtml);
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
  }, [noteId]);

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
        <div
          className="public-note-page__body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
};

const bootPublicNotePage = (noteId: string) => {
  render(<PublicNotePage noteId={noteId} />, document.getElementById('root'));
};

export default bootPublicNotePage;
