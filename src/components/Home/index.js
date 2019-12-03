import React, {Component} from 'react';
import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';
import '../../App.css';
import { Card, Grid, Button, Label } from 'semantic-ui-react'

const HomePage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <Home firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class Home extends Component {
  constructor() {
    super();
    this.state = {}
  }
  
  render(){
    
    return (
      <React.Fragment>
        <h2>Home</h2>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <h3>Playlists</h3>
            </Grid.Column>
            <Grid.Column>
              <h3>Invites Sent</h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default HomePage;
export {Home};