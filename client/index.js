import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';
import {HashRouter as Router} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { DarkModeContextProvider } from './components/DarkModeContext';

ReactDom.render((
  <DarkModeContextProvider>
  <Router>
    <App />
  </Router>
</DarkModeContextProvider>
), document.getElementById('root'));
