import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDropzone } from 'react-dropzone';

import CloudIcon from '../../../icons/cloud';
import FileIcon from '../../../icons/file-small';
import * as importers from '../importers';
import WarningIcon from '../../../icons/warning';
import { t } from '../../../i18n';

function ImporterDropzone({
  acceptedTypes,
  locked,
  multiple,
  onAccept,
  onReset,
}) {
  const [acceptedFile, setAcceptedFile] = useState();
  const [errorMessage, setErrorMessage] = useState(new Array<string>());

  const handleAccept = (acceptedFiles) => {
    const filteredFiles = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];

      const importer = importers.forFilename(file.name);
      if (!importer) {
        setErrorMessage([
          ...errorMessage,
          t('import.fileTypeNotRecognized').replace('{name}', file.name),
        ]);
        continue;
      }

      filteredFiles.push(file);
    }
    setAcceptedFile(filteredFiles);
    onAccept(filteredFiles);
  };

  const handleReject = (rejectedFiles) => {
    if (!multiple && rejectedFiles.length > 1) {
      setErrorMessage([...errorMessage, t('import.chooseSingleFile')]);
    } else {
      setErrorMessage([...errorMessage, t('import.fileTypeIncorrect')]);
    }
    setAcceptedFile(undefined);
    onReset();
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length === 0) {
      handleReject(rejectedFiles);
    } else {
      handleAccept(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedTypes,
    disabled: locked,
    multiple,
    onDrop,
  });

  const DropzonePlaceholder = () => {
    return (
      <Fragment>
        {errorMessage.length > 0 ? <WarningIcon /> : <CloudIcon />}
        {isDragActive ? (
          t('import.dropFiles')
        ) : (
          <div
            className="drop-instructions"
            dangerouslySetInnerHTML={{
              __html: t('import.dragAndDrop').replace(
                '{browse}',
                `<span>${t('import.browse')}</span>`
              ),
            }}
          />
        )}
      </Fragment>
    );
  };

  const FilesWithIcon = () => {
    const fileList = acceptedFile.map((file: File) => (
      <li key={file.name} title={file.name}>
        <FileIcon />
        <span>{file.name}</span>
      </li>
    ));

    const errorList = errorMessage.map((error) => (
      <li key={error}>
        <WarningIcon />
        {error}
      </li>
    ));

    return (
      <Fragment>
        <div className="accepted-files-header">
          {acceptedFile.length > 1
            ? t('import.importFiles')
            : t('import.importFile')}
        </div>
        <ul className="accepted-files">{fileList}</ul>
        {errorMessage.length > 0 && (
          <ul className="error-message">{errorList}</ul>
        )}
      </Fragment>
    );
  };

  return (
    <div
      {...getRootProps()}
      className={classnames(
        { 'is-accepted': acceptedFile },
        'importer-dropzone'
      )}
    >
      <input {...getInputProps()} />
      {acceptedFile ? <FilesWithIcon /> : <DropzonePlaceholder />}
    </div>
  );
}

ImporterDropzone.propTypes = {
  acceptedTypes: PropTypes.string,
  locked: PropTypes.bool.isRequired,
  multiple: PropTypes.bool,
  onAccept: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ImporterDropzone;
