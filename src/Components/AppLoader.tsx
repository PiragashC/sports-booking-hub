import React from 'react';

interface AppLoaderProps {
  visible: boolean;
  title?: string;
  message?: string;
  backdropBlur?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({
  visible,
  title,
  message,
  backdropBlur = false
}) => {
  return (
    <div className={`app_loader_backdrop ${backdropBlur ? 'blurred' : ''} ${visible ? 'show' : 'hide'}`}>
      <div className="app_loader_container">
        <div className="app_loader">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
          <div className="bar4"></div>
          <div className="bar5"></div>
          <div className="bar6"></div>
          <div className="bar7"></div>
          <div className="bar8"></div>
          <div className="bar9"></div>
          <div className="bar10"></div>
          <div className="bar11"></div>
          <div className="bar12"></div>
        </div>

        <div className="app_loader_msg_box">
          <h5>{title}</h5>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;