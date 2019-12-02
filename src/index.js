import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import Firebase, { FirebaseContext } from './components/Firebase';
ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);
serviceWorker.unregister();
