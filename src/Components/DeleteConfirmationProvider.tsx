import { ConfirmDialog } from 'primereact/confirmdialog';
import React, { ReactNode } from 'react';

export const DeleteConfirmationProvider = ({ children }: { children: ReactNode }) => {
  return (
    <React.Fragment>
      {children}
      <ConfirmDialog />
    </React.Fragment>
  );
};