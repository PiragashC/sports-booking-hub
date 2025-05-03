import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

type SpinnerColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
type SpinnerSize = 'small' | 'medium' | 'large';

interface AppLoaderProps {
  visible: boolean;
  message?: string;
  spinnerColor?: SpinnerColor;
  size?: SpinnerSize;
  backdropBlur?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({ 
  visible, 
  message = 'Processing your request...', 
  spinnerColor = 'primary',
  size = 'large',
  backdropBlur = true
}) => {
  const spinnerSize = {
    'small': '40px',
    'medium': '60px',
    'large': '80px'
  } as const;

  const spinnerColorClass = {
    'primary': 'text-primary-500',
    'secondary': 'text-secondary-500',
    'success': 'text-green-500',
    'info': 'text-blue-500',
    'warning': 'text-yellow-500',
    'danger': 'text-red-500'
  } as const;

  const animationStyles = `
    @keyframes progressBarAnimation {
      0% { width: 0%; margin-left: 0; }
      50% { width: 100%; margin-left: 0; }
      100% { width: 0%; margin-left: 100%; }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <Dialog 
        visible={visible} 
        onHide={() => {}} 
        closable={false} 
        modal 
        style={{ width: '400px' }}
        footer={null}
        className={classNames({ 'backdrop-blur-sm': backdropBlur })}
        contentClassName="border-round"
        breakpoints={{ '960px': '75vw', '640px': '90vw' }}
      >
        <div className="flex flex-column align-items-center py-6 px-4">
          <div className="relative">
            <ProgressSpinner 
              style={{ 
                width: spinnerSize[size], 
                height: spinnerSize[size] 
              }} 
              strokeWidth="6"
              fill="var(--surface-ground)"
              animationDuration=".8s"
              className={spinnerColorClass[spinnerColor]}
            />
            {size !== 'small' && (
              <i 
                className={classNames(
                  'pi pi-spin pi-spinner absolute',
                  spinnerColorClass[spinnerColor]
                )}
                style={{
                  fontSize: `calc(${spinnerSize[size]} / 2.5)`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
          </div>
          
          <h3 className="mt-4 mb-2 text-900">{message}</h3>
          <p className="text-600 text-sm">Please wait while we process your request</p>
          
          {size !== 'small' && (
            <div className="mt-3 w-full bg-gray-100 border-round" style={{ height: '4px' }}>
              <div 
                className="bg-primary-500 border-round h-full" 
                style={{ 
                  width: '0%',
                  animation: 'progressBarAnimation 2s infinite ease-in-out'
                }}
              />
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default AppLoader; // This is the key line that makes it a module