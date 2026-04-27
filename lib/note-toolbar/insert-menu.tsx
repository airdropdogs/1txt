import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Overlay } from 'react-overlays';

import IconButton from '../icon-button';
import {
  MARKDOWN_SNIPPETS,
  MarkdownSnippet,
  dispatchInsertMarkdown,
} from './markdown-snippets';

/**
 * The "Insert Markdown" dropdown that replaced the old single-purpose
 * "Insert Checklist" button. The trigger reuses the same `IconButton`
 * styling so it looks at home in the toolbar; clicking it opens a popover
 * with previews of the available snippets. Selecting one fires the global
 * `insertMarkdown` CustomEvent which the active editor (Monaco source mode
 * or Vditor WYSIWYG mode) picks up and applies.
 */

const InsertIcon = () => (
  // The "Markdown badge" — a rounded rectangle with an "M" and a downward
  // arrow inside. This is the canonical Markdown mark (Dustin Curtis's
  // design, used on GitHub, Reddit, Stack Overflow, …) so it reads
  // unambiguously as "Markdown stuff" and won't be confused with the
  // "New Note" icon sitting two slots to its left.
  <svg
    className="icon-insert-markdown"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <rect
      x="2.25"
      y="5.25"
      width="19.5"
      height="13.5"
      rx="2.25"
      ry="2.25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M5.5 15.5 V 8.5 L 8.25 12 L 11 8.5 V 15.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.25 8.5 V 13.5 M 13.75 12 L 16.25 14.75 L 18.75 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const renderPreview = (item: MarkdownSnippet): React.ReactNode => {
  switch (item.id) {
    case 'h1':
      return <span className="insert-menu__preview-h1">H1</span>;
    case 'h2':
      return <span className="insert-menu__preview-h2">H2</span>;
    case 'h3':
      return <span className="insert-menu__preview-h3">H3</span>;
    case 'bold':
      return <strong>Bold</strong>;
    case 'italic':
      return <em>Italic</em>;
    case 'quote':
      return <span className="insert-menu__preview-quote">Quoted text</span>;
    case 'ul':
      return (
        <span className="insert-menu__preview-list">
          <span aria-hidden="true">•</span> Item
        </span>
      );
    case 'ol':
      return (
        <span className="insert-menu__preview-list">
          <span aria-hidden="true">1.</span> Item
        </span>
      );
    case 'checklist':
      return (
        <span className="insert-menu__preview-list">
          <span aria-hidden="true">☐</span> Task
        </span>
      );
    case 'inline-code':
      return <code className="insert-menu__preview-code">code</code>;
    case 'code-block':
      return (
        <span className="insert-menu__preview-codeblock">
          <code>code block</code>
        </span>
      );
    case 'link':
      return <span className="insert-menu__preview-link">Link</span>;
    case 'hr':
      return <span className="insert-menu__preview-hr" aria-hidden="true" />;
    default:
      return item.caption;
  }
};

const InsertMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const handleSelect = useCallback((item: MarkdownSnippet) => {
    dispatchInsertMarkdown(item);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="insert-menu" ref={triggerRef}>
      <div onClick={toggle}>
        <IconButton icon={<InsertIcon />} title="Insert Markdown" />
      </div>
      <Overlay
        show={open}
        onHide={close}
        rootClose
        placement="bottom-end"
        target={triggerRef.current}
        container={document.body}
      >
        {({ props: overlayProps }) => (
          <div
            {...overlayProps}
            className="insert-menu__popover"
            role="menu"
            aria-label="Insert Markdown"
          >
            {MARKDOWN_SNIPPETS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className="insert-menu__item"
                title={item.label}
                onClick={() => handleSelect(item)}
              >
                <span className="insert-menu__item-preview">
                  {renderPreview(item)}
                </span>
                <span className="insert-menu__item-caption">
                  {item.caption}
                </span>
              </button>
            ))}
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default InsertMenu;
