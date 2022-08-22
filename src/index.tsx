import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/tailwind-light/theme.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from "./firebase/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
        <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
