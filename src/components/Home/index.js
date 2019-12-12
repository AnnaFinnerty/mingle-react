import React, {Component} from 'react';

import { withRouter, useParams } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';

import CreatorView from '../CreatorView';
import UserView from '../UserView';

import Options from '../Options';
import AddPlaylist from '../AddPlaylist';
import AddTempUser from '../AddTempUser';
import Message from '../Message';

// import AuthUserContext from '../Session';

import '../../App.css';
import { Modal, Grid,Button} from 'semantic-ui-react'



const HomePage = (props) => {
  return (
  <div>
      <FirebaseContext.Consumer>
        {firebase => <Home firebase={firebase} authUser={props.authUser} />}
      </FirebaseContext.Consumer>
  </div>
)};

class HomeBase extends Component {
  constructor(props) {
    super(props);
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
    if(!this.state.authUser){
      // send back to signin if creator is not authenticated
      this.props.history.push('/signin');
    } 
    this.checkForActivePlaylist();
  }
  checkForActivePlaylist = () => {
    const itemsRef = this.props.firebase.db.collection('playlists');
    let defaultPlaylistId;
    const query = itemsRef.where('userId', '==', this.state.authUser).get().then((snapshot) => {
      //find all of the creator's playlists
      let activePlaylistId = null;
      snapshot.forEach((i,x) => {
        //capture the id of the default playlist, in case we don't find an active one
        if(x === 0){
          defaultPlaylistId = i.id;
        }
        const item = i.data()
        activePlaylistId = i.id;
        if(item.active){
          //get information for the first active playlist found
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
          //if no active playlist found, activate default playlist
          this.activatePlaylist(defaultPlaylistId);
        }
      });
    });
  }
  activatePlaylist = (playlistId, tempUserId, displayName, secretName) => {
    const db = this.props.firebase.db;
    const self = this;
    db.collection("playlists").get().then(function(querySnapshot) {
      //find all playlists in users' collection
      querySnapshot.forEach(function(doc) {
          const ref = db.doc(`/playlists/${doc.id}`);
          //deactivate all except the one matching playlistId
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
    const playlistRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
    playlistRef.get()
    .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching playlist');
        return;
        }  
          console.log('playlist snapshot', snapshot.data())
        snapshot.data();
        this.setState({
            activePlaylist: snapshot.data(),
        })
    })
    .catch(err => {
        console.log('Error getting playlist', err);
    });
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
        modal = <AddPlaylist userProps={this.state} callback={this.activatePlaylist} gameMode={this.state.game}/>
        break

      default: 
      modal =  <Options settings={this.state.settings} updateSettings={this.updateSettings}/>
    }
    //build view
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
        <Grid columns={1} centered style={{textAlign:"centered"}}>
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