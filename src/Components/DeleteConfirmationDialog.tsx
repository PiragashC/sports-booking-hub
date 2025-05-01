import { confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';

export const useDeleteConfirmation = () => {
  // Use a ref to track if dialog is already open
  const dialogOpenRef = useRef(false);

  const showDeleteConfirmation = (options: {
    message: string;
    header: string;
    accept: () => void;
  }) => {
    // Prevent multiple dialogs
    if (dialogOpenRef.current) return;
    dialogOpenRef.current = true;

    confirmDialog({
      message: options.message,
      header: options.header,
      icon: 'bi bi-info-circle',
      acceptClassName: 'p-button-danger',
      rejectClassName: 'p-button-secondary',
      dismissableMask: true,
      accept: () => {
        options.accept();
        dialogOpenRef.current = false;
      },
      reject: () => {
        dialogOpenRef.current = false;
      }
    });
  };

  return showDeleteConfirmation;
};