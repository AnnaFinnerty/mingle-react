import React, {Component} from 'react';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';

import CreatorView from '../CreatorView';
import UserView from '../UserView';

import ModalWindow from '../Modal';
import Options from '../Options';
import AddPlaylist from '../AddPlaylist';
import AddTempUser from '../AddTempUser';
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

class HomeBase extends Component {
  constructor(props) {
    super(props);
    // console.log('Constructor Props are:', props)
    this.state = {
      authUser: props.authUser,
      authUserDisplayName: '',
      authUserSecretName: '',
      authUserTempId: null,
      gameMode: false,
      players: [],
      activePlaylist: '',
      activePlaylistId: '',
      playlists: [],
      creatorMode: true,
      secondChance: true,
      playThrough: false,
      suddenDeath: false,
      messageOpen: false,
      messageText: '',
      modalOpen: false,
      modalType: 'newTempProfile',
      reduceApiCalls: false,
      settings: {
        speedThrough: true,
        endSongOnVoteEnd: false,
        suddenDeath: false,
        secondChance: true,
        voteDelay: false,
        voteDelayLength: 30,
      }
    }
    this.activatePlaylist = this.activatePlaylist.bind(this);
  }
  componentDidMount(){
    console.log('home did mount', this.state);
    if(!this.state.authUser){
      // send back to signin if creator is not authenicated
      this.props.history.push('/signin');
    } 
    this.checkForActivePlaylist();
  }
  checkForActivePlaylist = () => {
    console.log('looking for active playlist for: ' + this.state.authUser);
    const itemsRef = this.props.firebase.db.collection('playlists');
    let defaultPlaylistId;
    const query = itemsRef.where('userId', '==', this.state.authUser).get().then((snapshot) => {
      console.log('getPlaylists snapshot',snapshot)
      let activePlaylistId = null;
      snapshot.forEach((i,x) => {
        //capture the id of the default playlist, in case we don't find an active one
        if(x === 0){
          defaultPlaylistId = i.id;
        }
        const item = i.data()
        console.log('playlist item', item)
        activePlaylistId = i.id;
        if(item.active){
          console.log('active playlist found: ' + activePlaylistId);
          const playlistRef = this.props.firebase.db.doc(`/playlists/${activePlaylistId}`);
          let query = playlistRef.get()
          .then(snapshot => {
              if (snapshot.empty) {
              console.log('No matching playlist');
              return;
              }  
              console.log('playlist snapshot', snapshot.data())
              const data = snapshot.data();
              data['id'] = activePlaylistId;
              this.setState({
                  activePlaylistId: activePlaylistId,
                  activePlaylist: data,
              })
          })
          .catch(err => {
              console.log('Error getting playlist', err);
          });
        } else {
          console.log('no active playlists found');
          console.log('activating default playlist: ' + defaultPlaylistId);
          this.activatePlaylist(defaultPlaylistId);
        }
      });
    });
  }
  activatePlaylist = (playlistId, tempUserId, displayName, secretName) => {
    console.log('activating playlist in home: ' + playlistId);
    //deactivate all playlists in users' collection
    const db = this.props.firebase.db;
    const self = this;
    db.collection("playlists").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // var ref = this.props.firebase.db.collection("playlists").doc(doc.id);
          const ref = db.doc(`/playlists/${doc.id}`);
          ref.update({
              active: doc.id === playlistId
          });
          self.setState({
            activePlaylistId: doc.id,
            authUserDisplayName: displayName,
            authUserSecretName: secretName,
            authUserTempId: tempUserId,
            modalOpen: false
          })
      });
    });
  }
  getPlaylist = (playlistId) => {
    console.log("getting playlist information in home");
    const playlistRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
    let query = playlistRef.get()
    .then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching playlist');
        return;
        }  
        console.log('playlist snapshot', snapshot.data())
        const data = snapshot.data();
        this.setState({
            activePlaylist: snapshot.data(),
        })
    })
    .catch(err => {
        console.log('Error getting playlist', err);
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
  addCreatorNames = (username,secretname, tempId) => {
    console.log("adding names", username, secretname, tempId);
    this.setState({
      authUserDisplayName: username,
      authUserSecretName: secretname,
      authUserTempId: tempId
    })
  }
  updateSettings = (newSettings) => {
    console.log('updating settings')
    console.log(newSettings);
    this.setState({
      settings: newSettings,
      modalOpen: false,
    })
  }
  toggleViewMode = () => {
    console.log('toggling view mode');
    this.setState({creatorMode: !this.state.creatorMode})
  }
  toggleGameMode = () => {
    this.setState({
      gameMode: !this.state.gameMode
    })
  }
  openModal = (modalType) => {
    console.log('open modal: ' + modalType)
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
    console.log('home state', this.state)
    const userData = {
      authUser: this.state.authUser,
      userId: this.state.authUser,
      tempId: this.state.authUserTempId,
      displayName: this.state.authUserDisplayName,
      // secretName: this.state.authUser.authUserSecretName,
    }
    let modal;
    switch(this.state.modalType){
      case "newTempProfile":
        modal = <AddTempUser userProps={this.state} callback={this.addCreatorNames} authUser={true}/>
        break

      case "newPlaylist":
        modal = <AddPlaylist userProps={this.state} callback={this.activatePlaylist} gameMode={this.props.game}/>
        break

      default: 
      modal =  <Options settings={this.state.settings} updateSettings={this.updateSettings}/>
    }
    const view = this.state.creatorMode ? 
                <CreatorView authUser={this.state.authUser}
                             gameMode={this.state.gameMode}
                             userData={userData}
                             settings={this.state.settings}
                             playlistId={this.state.activePlaylistId}
                             activePlaylist={this.state.activePlaylist} 
                             toggleViewMode={this.toggleViewMode} 
                             addPlaylist={this.addPlaylist}
                             history={this.props.history} match={this.props.match} location={this.props.location}
                             playlists={this.state.playlists}
                             players={this.state.players}
                             activatePlaylist={this.activatePlaylist}
                             reduceApiCalls={this.state.reduceApiCalls}
                             firebase={this.props.firebase}
                             /> 
                : 
                <UserView authUser={true}
                          gameMode={this.state.gameMode}
                          userData={userData}
                          playlistId={this.state.activePlaylistId}
                          playlist={this.state.activePlaylist} 
                          toggleViewMode={this.toggleViewMode}
                          reduceApiCalls={this.state.reduceApiCalls}
                          firebase={this.props.firebase}
                          />;
    return (
      <React.Fragment>
        <Grid columns={1} fluid={'true'} centered style={{textAlign:"centered"}}>
           <Grid.Row style={{paddingBottom:"0"}}>
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
                 <Button onClick={()=>this.openModal('newPlaylist')}>create playlist</Button> : ""
              }
              {/* {
                // add button if creator has not set their temp_user profile for this round
                 !this.state.authUserDisplayName || !this.state.authUserSecretName ?
                 <Button onClick={()=>this.openModal('newTempProfile')}>create your profile</Button> :
                 <React.Fragment>
                    <h3>{this.state.authUserDisplayName}</h3>
                    <h3>{this.state.authUserSecretName}</h3>
                 </React.Fragment>
              } */}
              {
                !this.state.gameMode ? 
                <Button onClick={this.toggleGameMode}>start game</Button>
                :
                <React.Fragment>
                  <Button onClick={()=>this.openModal('options')}>game options</Button>
                  <Button onClick={this.toggleGameMode}>stop game</Button>
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
              {modal}
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