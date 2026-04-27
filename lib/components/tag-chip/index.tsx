import React, { FunctionComponent } from 'react';
import SmallCrossIcon from '../../icons/cross-small';
import classNames from 'classnames';

import type * as T from '../../types';

type OwnProps = {
  /**
   * Fires when the chip body is clicked. In the bottom-of-note tag editor this
   * means "filter the note list by this tag" (jump). Other consumers may use
   * different semantics.
   */
  onSelect?: (event: React.MouseEvent<HTMLDivElement>) => any;
  /**
   * Optional remove handler. When provided AND `interactive` is true, the small
   * × icon becomes a real button that calls this handler (with event
   * propagation stopped so the body click doesn't also fire).
   */
  onRemove?: (tagName: T.TagName) => any;
  selected?: boolean;
  interactive?: boolean;
  deleted?: boolean;
  tagName: T.TagName | undefined;
};

const TagChip: FunctionComponent<OwnProps> = ({
  onSelect,
  onRemove,
  selected = false,
  interactive = true,
  deleted = false,
  tagName,
}) => {
  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (tagName !== undefined) {
      onRemove?.(tagName);
    }
  };

  const handleRemoveMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Stop propagation so the parent div's onClick (jump) doesn't fire on the
    // mousedown phase in some browsers / focus handlers.
    e.stopPropagation();
  };

  return (
    <div
      className={classNames('tag-chip', { selected, interactive, deleted })}
      data-tag-name={tagName}
      onClick={onSelect}
    >
      {tagName}
      {interactive &&
        (onRemove ? (
          <button
            type="button"
            className="remove-tag-icon"
            aria-label={tagName ? `Remove tag ${tagName}` : 'Remove tag'}
            title={tagName ? `Remove tag "${tagName}"` : 'Remove tag'}
            onClick={handleRemoveClick}
            onMouseDown={handleRemoveMouseDown}
          >
            <SmallCrossIcon />
          </button>
        ) : (
          <span className="remove-tag-icon" aria-hidden="true">
            <SmallCrossIcon />
          </span>
        ))}
    </div>
  );
};

export default TagChip;
