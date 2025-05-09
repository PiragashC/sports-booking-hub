import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import "primeicons/primeicons.css";

import "./Css/common.css";
import "./Css/common-responsive.css";
import "./Css/element.css";
import "./Css/Web/index.css";
import "./Css/Web/responsive.css";
import "./Css/App/index.css";
import "./Css/App/responsive.css";
import "./Css/Admin/index.css";
import "./Css/Admin/responsive.css";
import "./Css/primereact.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
