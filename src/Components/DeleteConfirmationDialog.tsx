import { confirmDialog } from 'primereact/confirmdialog';

export const useDeleteConfirmation = () => {
  const showDeleteConfirmation = (options: {
    message: string;
    header: string;
    accept: () => void;
  }) => {
    confirmDialog({
      message: options.message,
      header: options.header,
      icon: 'bi bi-info-circle',
      acceptClassName: 'p-button-danger',
      rejectClassName: 'p-button-secondary',
      accept: options.accept,
      dismissableMask: true
    });
  };

  return showDeleteConfirmation;
};