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
      settings: {
        speedThrough: true,
        endSongOnVoteEnd: false,
        suddenDeath: false,
        secondChance: true,
        voteDelay: false,
        voteDelayLength: 30,
      }
    }
  }
  componentDidMount(){
    console.log('home did mount', this.state);
    if(!this.state.authUser){
      //send back to signin if creator is not authenicated
      this.props.history.push('/signin');
    } 
    this.checkForActivePlaylist();
  }
  checkForActivePlaylist = () => {
    console.log('looking for active playlist for: ' + this.state.authUser);
    const itemsRef = this.props.firebase.db.collection('playlists');
    const query = itemsRef.get().then((snapshot) => {
      console.log('getPlaylists snapshot',snapshot)
      let activePlaylistId = null;
      snapshot.forEach((i) => {
        const item = i.data()
        console.log(item);
        console.log('playlist item', item)
        const id = i.id;
        if(item.active){
          console.log('active playlist found: ' + id);
          activePlaylistId = id;
        } else {
          console.log('no active playlist found');
        }
      });
      this.setState({
        activePlaylistId: activePlaylistId
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
  addCreatorNames = (username,secretname) => {
    console.log("adding names", username, secretname);
    this.setState({
      authUserDisplayName: username,
      authUserSecretName: secretname
    })
  }
  activatePlaylist = (playlistId) => {
    console.log('activating playlist in home: ' + playlistId);
    //deactivate all playlists in users' collection
    const listRef = this.props.firebase.db.collection("playlists")
    listRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          var ref = this.props.firebase.db.collection("playlists").doc(doc.id);
          return ref.update({
              activatePlaylistId: false
          });
      });
    });
    //activate active playlist
    const itemRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
    let query = itemRef.get()
    .then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }  
        console.log('active playlist snapshot', snapshot.data())
        this.setState({
            activePlaylist: snapshot.data(),
            activatePlaylistId: playlistId,
            modalOpen: false,
        })
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
  }
  updateSettings = (newSettings) => {
    console.log('updating settings')
    console.log(newSettings);
  }
  toggleViewMode = () => {
    console.log('toggling view mode');
    this.setState({creatorMode: !this.state.creatorMode})
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
      displayName: this.state.authUserDisplayName,
      secretName: this.state.authUser.authUserSecretName,
    }
    let modal;
    switch(this.state.modalType){
      case "newTempProfile":
        modal = <AddTempUser userProps={this.state} callback={this.addCreatorNames} authUser={true}/>
        break

      case "newPlaylist":
        modal = <AddPlaylist userProps={this.state} callback={this.activatePlaylist}/>
        break

      default: 
      modal =  <Options settings={this.state.settings} updateSettings={this.updateSettings}/>
    }
    const view = this.state.creatorMode ? 
                <CreatorView authUser={this.state.authUser}
                             userData={userData}
                             settings={this.state.settings}
                             playlistId={this.state.activePlaylistId} 
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
                <UserView authUser={this.state.authUser}
                          userData={userData}
                          playlistId={this.state.activePlaylistId}
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
              <Button onClick={()=>this.openModal('options')}>game options</Button>
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