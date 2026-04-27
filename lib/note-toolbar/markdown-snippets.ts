/**
 * Markdown snippets shown in the toolbar's "Insert Markdown" dropdown.
 *
 * Each snippet is plain UTF-8 markdown text. The dropdown component renders
 * a tiny styled "preview" so users can see what the formatting looks like
 * before clicking, and the snippet is then dispatched as an `insertMarkdown`
 * CustomEvent that both editors (Monaco source mode and Vditor WYSIWYG mode)
 * listen to.
 *
 * Conventions:
 *   - `blockLevel: true` means the snippet should start on its own line. The
 *     Monaco listener prepends a "\n" if the cursor is not already at column 1
 *     so block constructs (headings, lists, blockquotes, hr, code blocks)
 *     don't get glued onto the previous line.
 *   - `selectionAnchor` is an optional [start, end] pair (relative to the
 *     beginning of `snippet`) telling the source-mode listener what slice of
 *     the inserted text should end up selected so the user can immediately
 *     start typing the real value (e.g. select "url" inside `[text](url)`).
 */

export type MarkdownSnippet = {
  id: string;
  /** Tooltip / accessible label */
  label: string;
  /** Short label rendered next to the preview */
  caption: string;
  /** The markdown text to insert verbatim */
  snippet: string;
  /** True for block-level constructs that need to start on their own line */
  blockLevel: boolean;
  /**
   * Optional [start, end] inside `snippet` to be selected after insertion.
   * Useful for snippets with placeholder words (e.g. link text/url).
   */
  selectionAnchor?: [number, number];
};

export const MARKDOWN_SNIPPETS: ReadonlyArray<MarkdownSnippet> = [
  {
    id: 'h1',
    label: 'Heading 1',
    caption: 'H1 Heading',
    snippet: '# ',
    blockLevel: true,
  },
  {
    id: 'h2',
    label: 'Heading 2',
    caption: 'H2 Heading',
    snippet: '## ',
    blockLevel: true,
  },
  {
    id: 'h3',
    label: 'Heading 3',
    caption: 'H3 Heading',
    snippet: '### ',
    blockLevel: true,
  },
  {
    id: 'bold',
    label: 'Bold (Ctrl+B)',
    caption: 'Bold',
    snippet: '**bold text**',
    blockLevel: false,
    selectionAnchor: [2, 11],
  },
  {
    id: 'italic',
    label: 'Italic (Ctrl+I)',
    caption: 'Italic',
    snippet: '*italic text*',
    blockLevel: false,
    selectionAnchor: [1, 12],
  },
  {
    id: 'quote',
    label: 'Blockquote',
    caption: 'Quoted text',
    snippet: '> ',
    blockLevel: true,
  },
  {
    id: 'ul',
    label: 'Bulleted list',
    caption: 'Bulleted list',
    snippet: '- ',
    blockLevel: true,
  },
  {
    id: 'ol',
    label: 'Numbered list',
    caption: 'Numbered list',
    snippet: '1. ',
    blockLevel: true,
  },
  {
    id: 'checklist',
    label: 'Task list',
    caption: 'Task list',
    snippet: '- [ ] ',
    blockLevel: true,
  },
  {
    id: 'inline-code',
    label: 'Inline code',
    caption: 'Inline code',
    snippet: '`code`',
    blockLevel: false,
    selectionAnchor: [1, 5],
  },
  {
    id: 'code-block',
    label: 'Code block',
    caption: 'Code block',
    snippet: '```\ncode\n```\n',
    blockLevel: true,
    selectionAnchor: [4, 8],
  },
  {
    id: 'link',
    label: 'Link',
    caption: 'Link',
    snippet: '[text](url)',
    blockLevel: false,
    selectionAnchor: [7, 10],
  },
  {
    id: 'hr',
    label: 'Horizontal rule',
    caption: 'Horizontal rule',
    snippet: '---\n',
    blockLevel: true,
  },
];

/**
 * Detail payload of the `insertMarkdown` CustomEvent. Editors should listen
 * for this event on `window` and translate it into their own insertion API
 * (Monaco's executeEdits, Vditor's insertValue, etc).
 */
export type InsertMarkdownDetail = {
  snippet: string;
  blockLevel: boolean;
  selectionAnchor?: [number, number];
};

export const INSERT_MARKDOWN_EVENT = 'insertMarkdown' as const;

/** Helper used by the menu component to dispatch a uniform event payload. */
export const dispatchInsertMarkdown = (item: MarkdownSnippet): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<InsertMarkdownDetail>(INSERT_MARKDOWN_EVENT, {
      detail: {
        snippet: item.snippet,
        blockLevel: item.blockLevel,
        selectionAnchor: item.selectionAnchor,
      },
    })
  );
};
