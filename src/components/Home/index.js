import React, {Component} from 'react';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';

import CreatorView from '../CreatorView';
import UserView from '../UserView';
import ModalWindow from '../Modal';
import AddTempUser from '../AddTempUser';

// import AuthUserContext from '../Session';

import '../../App.css';
import { Modal, Grid, Label, Feed, Button, Header } from 'semantic-ui-react'
import { AddPlaylist } from '../AddPlaylist';


const HomePage = (props) => {
  // console.log('home wrapper props', props)
  return (
  <div>
    {/* <AuthUserContext.Consumer> */}
      <FirebaseContext.Consumer>
        {firebase => <Home firebase={firebase} authUser={props.authUser} />}
      </FirebaseContext.Consumer>
    {/* </AuthUserContext.Consumer> */}
  </div>
)};

//POTENTIAL GAME SETTINGS
//give eliminated users a change to replay: Second chance
//sudden death
//end song immediately on vote completion or play through
//speed through? Or should this be default?

class HomeBase extends Component {
  constructor(props) {
    super(props);
    console.log('Constructor Props are:', props)
    this.state = {
      authUser: props.authUser,
      authUserDisplayName: '',
      authUserSecretName: '',
      players: [],
      activePlaylist: '',
      activePlaylistId: 'rEZzXFXXfADqn5shewsm',
      playlists: [],
      creatorMode: true,
      secondChance: true,
      playThrough: false,
      suddenDeath: false,
      reduceApiCalls: true,
    }
  }
  componentDidMount(){
    console.log('home did mount', this.state);
    if(!this.state.authUser){
      this.props.history.push('/signin');
    } else {
      if(this.state.activePlaylistId){
        if(!this.state.reduceApiCalls){
          this.getUsers(this.state.activePlaylistId);
          this.getPlaylists(this.state.authUser);
        }
      }
    }
  }
  getAuthUser = () => {
    console.log('getting authorized user info:' + this.state.authUser);
    // const itemsRef = this.props.firebase.db.collection('temp_users');
    // const query = await itemsRef.where('playlistId', '==', playlistId).get().then((snapshot) => {
    //   console.log('getUsers snapshot',snapshot)
    //   let newUsers = [];
    //   snapshot.forEach((i) => {
    //     const item = i.data()
    //     const id = i.id;
    //     newUsers.push({
    //       username: item.username,
    //       secretname: item.secretname,
    //       songId: item.songId,
    //       downvotes: item.downvotes,
    //       upvotes: item.upvotes,
    //       id: id,
    //     });
    //   });
    //   console.log('users',newUsers);
    //   this.setState({
    //     players: newUsers
    //   });
    // });
  }
  getPlaylists = (userId) => {
    console.log('getting playlists for: ' + userId);
    const itemsRef = this.props.firebase.db.collection('playlists');
    console.log('playlists item ref', itemsRef)
    const query = itemsRef.get().then((snapshot) => {
      console.log('getPlaylists snapshot',snapshot)
      let newItems = [];
      snapshot.forEach((i) => {
        const item = i.data()
        console.log('playlist item', item)
        const id = i.id;
        newItems.push({
          date: item.date,
          userId: item.userId,
          title: item.title,
          mood: item.mood,
          id: id,
        });
      });
      console.log('newItems',newItems)
      this.setState({
        playlists: newItems
      });
    });
  }
  getUsers = async (playlistId) => {
    console.log('getting users for playlist:' + playlistId);
    const itemsRef = this.props.firebase.db.collection('temp_users');
    const query = await itemsRef.where('playlistId', '==', playlistId).get().then((snapshot) => {
      console.log('getUsers snapshot',snapshot)
      let newUsers = [];
      snapshot.forEach((i) => {
        const item = i.data()
        const id = i.id;
        newUsers.push({
          username: item.username,
          secretname: item.secretname,
          songId: item.songId,
          downvotes: item.downvotes,
          upvotes: item.upvotes,
          id: id,
        });
      });
      console.log('users',newUsers);
      this.setState({
        players: newUsers
      });
    });
  }
  activatePlaylist = (playlistId) => {
    console.log('activating playlist');
    this.getPlaylist(playlistId);
  }
  addPlaylist = () => {
    console.log('adding playlist');
    // this.props.history.push(ROUTES.PLAYLIST)
  }
  toggleViewMode = () => {
    console.log('toggling view mode');
    this.setState({creatorMode: !this.state.creatorMode})
  }
  render(){
    // console.log('home props', this.props)
    const view = this.state.creatorMode ? 
                <CreatorView userId={this.state.authUser} 
                             toggleViewMode={this.toggleViewMode} 
                             addPlaylist={this.addPlaylist}
                             history={this.props.history} match={this.props.match} location={this.props.location}
                             playlistId={this.state.activePlaylistId}
                             playlists={this.state.playlists}
                             players={this.state.players}
                             reduceApiCalls={this.state.reduceApiCalls}
                             /> 
                : 
                <UserView userId={this.state.authUser}
                          toggleViewMode={this.toggleViewMode}
                          playlistId={this.state.activePlaylistId}
                          reduceApiCalls={this.state.reduceApiCalls}
                          />;
    return (
      <React.Fragment>
        <Grid columns={1} fluid={'true'} centered style={{textAlign:"centered"}}>
           <Grid.Row>
              <h3>{this.state.authUser}</h3>
           </Grid.Row>
           <Grid.Row>
              {view}
            </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

const Home = withRouter(HomeBase)
export default HomePage;
export {Home};