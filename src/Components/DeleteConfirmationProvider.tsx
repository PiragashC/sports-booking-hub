import { ConfirmDialog } from 'primereact/confirmdialog';
import { ReactNode } from 'react';

export const DeleteConfirmationProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ConfirmDialog />
    </>
  );
};