import React, {Component} from 'react';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';

import CreatorView from '../CreatorView';
import UserView from '../UserView';

// import AuthUserContext from '../Session';

import '../../App.css';
import { Grid, Label, Feed, Button, Header } from 'semantic-ui-react'
import { Playlist } from '../Playlist';


const HomePage = (props) => {
  console.log('home wrapper props', props)
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
      players: [],
      activePlaylist: '',
      activePlaylistId: '0I2oIPyR2VHtMtTQSYd4',
      playlists: [],
      creatorMode: true,
      secondChance: true,
      playThrough: false,
      suddenDeath: false,
    }
  }
  componentDidMount(){
    console.log('home did mount', this.state);
    if(!this.state.authUser){
      this.props.history.push('/signin');
    }
    // this.getUsers();
    //this.getPlaylists();
    // instead of checking for a playlist prop we should be authenticating
    // logged in user, then checking to see if they have an active playlist
    // const playlistId = this.props.match.params.playlistId;
    // // const playlistId = this.state.activePlaylistId;
    // if(playlistId){
    //   console.log("found playlistId:  " +  playlistId);
    //   this.getPlaylist(playlistId);
    // } else {
    //   console.log('no playlist to load');
    // }
  }
  // getPlaylist(playlistId) {
  //   console.log('getting playlist');
  //   const itemRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
  //   let query = itemRef.get()
  //     .then(snapshot => {
  //       if (snapshot.empty) {
  //         console.log('No matching documents.');
  //         return;
  //       }  
  //       console.log('get snapshot', snapshot.data())
  //       this.setState({
  //         activePlaylist: snapshot.data(),
  //         activePlaylistId: playlistId
  //       })
  //     })
  //     .catch(err => {
  //       console.log('Error getting documents', err);
  //     });
  // }
  getPlaylists = () => {
    const itemsRef = this.props.firebase.db.collection('playlists');
    itemsRef.where('userId', '==', true).get().then((snapshot) => {
      console.log('snapshot',snapshot)
      let newItems = [];
      snapshot.forEach((i) => {
        const item = i.data()
        const id = i.id;
        newItems.push({
          date: item.date,
          userId: item.userId,
          title: item.title,
          mood: item.mood,
          id: id,
        });
      });
      this.setState({
        playlists: newItems
      });
    });
  }
  getUsers() {
    console.log('getting users');
    const itemsRef = this.props.firebase.db.collection('temp_users');
    itemsRef.where('playlistId', '==', this.state.activePlaylistId).get().then((snapshot) => {
      console.log('snapshot',snapshot)
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
    this.props.history.push(ROUTES.PLAYLIST)
  }
  toggleViewMode = () => {
    console.log('toggling view mode');
    this.setState({creatorMode: !this.state.creatorMode})
  }
  render(){
    console.log('home props', this.props)
    const playlists = !this.state.playlists.length ?
    <Label>no playlists</Label> :
    this.state.playlists.map((playlist)=>{
      console.log(playlist);
      return(
        <Feed.Event style={{backgroundColor:"lightgray", padding:"2% 5%", margin:"0 5%", width:"90%"}}>
          <Feed.Label>
            {playlist.title}
          </Feed.Label>
        </Feed.Event>
      )
    })
    const view = this.state.creatorMode ? 
                <CreatorView userId={this.state.authUser} 
                             toggleViewMode={this.toggleViewMode} 
                             addPlaylist={this.addPlaylist}
                             history={this.props.history} match={this.props.match} location={this.props.location}
                             /> 
                : 
                <UserView userId={this.state.authUser}
                          toggleViewMode={this.toggleViewMode}/>;
    return (
      <React.Fragment>
        <Grid columns={1} fluid={'true'} centered style={{textAlign:"centered"}}>
           {
                !this.state.activePlaylistId ?
                <React.Fragment>
                  
                  <Playlist activatePlaylist={this.activatePlaylist} firebase={this.props.firebase}/>
                </React.Fragment>
                :
                <React.Fragment>
                  {view}
                </React.Fragment>    
            }
        </Grid>
      </React.Fragment>
    );
  }
}

const Home = withRouter(HomeBase)
export default HomePage;
export {Home};