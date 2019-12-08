import React, {Component} from 'react';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';

import CreatorView from '../CreatorView';
import UserView from '../UserView';

import ModalWindow from '../Modal';
import Message from '../Message';

// import AuthUserContext from '../Session';

import '../../App.css';
import { Modal, Grid,Button} from 'semantic-ui-react'



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
      messageOpen: false,
      messageText: '',
      modalOpen: false,
      modalType: 'newTempProfile',
      reduceApiCalls: true,
    }
  }
  componentDidMount(){
    console.log('home did mount', this.state);
    if(!this.state.authUser){
      //send back to signin if creator is not authenicated
      this.props.history.push('/signin');
    } else {
      this.getPlaylists(this.state.authUser);
      if(!this.state.reduceApiCalls){
        //retrieve and populate users and playlists for this creator
        this.getUsers(this.state.activePlaylistId);
        // this.getPlaylists(this.state.authUser);
      }
    }
  }
  checkForActivePlaylist = () => {
    console.log('looking for active playlist for: ' + this.state.authUser);
    const itemsRef = this.props.firebase.db.collection('playlists');
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
    //console.log('activating playlist in home: ' + playlistId);
    this.setState({
      activatePlaylistId: playlistId
    })
  }
  toggleViewMode = () => {
    console.log('toggling view mode');
    this.setState({creatorMode: !this.state.creatorMode})
  }
  openModal = (modalType) => {
    this.setState({
        modalOpen: true,
        modalType: modalType
    })
  }
  closeModal = () => {
      this.setState({modalOpen: false})
    }
  openMessage = (messageText) => {
      this.setState({
          messageOpen: true,
          messageText: messageText
      })
  }
  closeMessage = () => {
      this.setState({
          messageOpen: false,
          messageText: ''
      })
  }
  render(){
    // console.log('home props', this.props)
    const view = this.state.creatorMode ? 
                <CreatorView authUser={this.state.authUser}
                             playlistId={this.state.activePlaylistId} 
                             toggleViewMode={this.toggleViewMode} 
                             addPlaylist={this.addPlaylist}
                             history={this.props.history} match={this.props.match} location={this.props.location}
                             playlists={this.state.playlists}
                             players={this.state.players}
                             activatePlaylist={this.activatePlaylist}
                             reduceApiCalls={this.state.reduceApiCalls}
                             /> 
                : 
                <UserView authUser={this.state.authUser}
                          toggleViewMode={this.toggleViewMode}
                          playlistId={this.state.activePlaylistId}
                          reduceApiCalls={this.state.reduceApiCalls}
                          />;
    return (
      <React.Fragment>
        <Grid columns={1} fluid={'true'} centered style={{textAlign:"centered"}}>
           <Grid.Row>
              <Button onClick={this.toggleViewMode}
                      style={{float:"left"}}
              >
                {
                    //toggle states
                    this.state.creatorMode ? 
                    "go to user view" :
                    "go to creator view"
                }
              </Button>
              {
                // add button if there is no active playlist
                 !this.state.activatePlaylistId ? 
                 <Button onClick={()=>this.openModal('newPlaylist')}>create new playlist to start</Button> : ""
              }
              {
                // add button if creator has not set their temp_user profile for this round
                 !this.state.authUserDisplayName || !this.state.authUserSecretName ?
                 <Button onClick={()=>this.openModal('newTempProfile')}>create your profile</Button> :
                 <React.Fragment>
                    <h3>{this.state.authUserDisplayName}</h3>
                    <h3>{this.state.authUserSecretName}</h3>
                 </React.Fragment>
              }
              
           </Grid.Row>
           <Grid.Row>
              {view}
            </Grid.Row>
        </Grid>
        {
                    !this.state.modalOpen ? "" :
                    <Modal open={this.state.modalOpen}>
                        <Button onClick={this.closeModal}>X</Button>
                        <ModalWindow closeModal={this.closeModal} 
                                    modalType={this.state.modalType} 
                                    userProps={this.state}/>
                    </Modal>
        }
        {
                    !this.state.messageOpen ? "" :
                    <Message 
                        open={this.state.messageOpen}
                        text={this.state.messageText}
                        closeMessage={this.closeMessage}
                    />
                } 
      </React.Fragment>
    );
  }
}

const Home = withRouter(HomeBase)
export default HomePage;
export {Home};