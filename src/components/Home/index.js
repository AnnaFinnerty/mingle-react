import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';

import CreatorView from '../CreatorView';
import UserView from '../UserView';


import '../../App.css';
import { Modal, Grid, Button, Header } from 'semantic-ui-react'
import { Playlist } from '../Playlist';


const HomePage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <Home firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class HomeBase extends Component {
  constructor() {
    super();
    this.state = {
      activePlaylist: '5hVQsD4OxSa8KgtJGXVb',
      playlists: [],
      creatorMode: false,
    }
  }
  componentDidMount(){
    this.getPlaylists();
  }
  getPlaylists() {
    const itemsRef = this.props.firebase.db.collection('playlists');
    itemsRef.get().then((snapshot) => {
      //let items = snapshot.val();
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
  activatePlaylist = (playlistName) => {
    this.setState({activePlaylist: playlistName})
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
    //!TODO wait until saving playlists works, this was just to test route
    // const playlists = !this.state.playlists.length ?
    // <Label>no playlists</Label> :
    // this.state.playlists.map((playlist)=>{
    //   console.log(playlist);
    //   return(
    //     <Feed.Event style={{backgroundColor:"lightgray", padding:"2% 5%", margin:"0 5%", width:"90%"}}>
    //       <Feed.Label>
    //         {playlist.title}
    //       </Feed.Label>
    //     </Feed.Event>
    //   )
    // })
    const view = this.state.creatorMode ? <CreatorView toggleViewMode={this.toggleViewMode}/> : <UserView toggleViewMode={this.toggleViewMode}/>;
    return (
      <React.Fragment>
        <Grid columns={1} fluid centered style={{textAlign:"centered"}}>
           {
                !this.state.activePlaylist ?
                <React.Fragment>
                  <Button onClick={this.addPlaylist}>create playlist to start</Button>
                  <Playlist activatePlaylist={this.activatePlaylist}/>
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