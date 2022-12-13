import axios from 'axios';
import React from 'react';
import {StrictMode} from 'react';
import ReactDom from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import {HashRouter as Router} from 'react-router-dom';

ReactDom.render((
<Router>
  <App />
</Router>
), document.getElementById('root'));
