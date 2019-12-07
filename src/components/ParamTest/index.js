import React, { Component } from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';
import { FirebaseContext, withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Label, Button } from 'semantic-ui-react';
import { SignUpLink } from '../SignUp';

const ParamTestPage = (props) => (
  <div>
    <h1>Pick Names</h1>
    <FirebaseContext.Consumer>
      {firebase => <ParamTestBase firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

const INITIAL_STATE = {
    username: '',
    secretname: '',
    showManualPlaylistEntry: false,
  };

class ParamTestBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  componentDidMount = () => {
    console.log('paramtest did mount', this.props)
     
  }
  render() {
    return (
      <h1>TEST PARAMS</h1>
    );
  }
}

const ParamTestForm = withRouter(ParamTestBase);
export default ParamTestPage;
export { ParamTestForm};