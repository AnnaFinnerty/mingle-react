import React, { Component, useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import ReactPlayer from 'react-player';

import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';
// import * as admin from 'firebase-admin';

import NewSong from '../NewSong';

import '../../App.css';
import { Modal, Grid, Button, Label, Icon } from 'semantic-ui-react';
import { thisExpression, removeTypeDuplicates } from '@babel/types';


const ActivePlaylistPage = (props) => {
  //console.log('active playlist wrapper props', props);
  return(
    <div>
    <FirebaseContext.Consumer>
      {(firebase) => <ActivePlaylistBase {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
  )
};

class ActivePlaylistBase extends Component {
  constructor(props) {
    console.log("active playlist props in constructor:", props)
    super(props);
    this.unsubscribe = null;
    this.state = {
      authUser: props.authUser,
      userId: props.userId,
      activeUser: props.userData ? props.userData : null,
      playlistId: props.playlistId,
      userSong: props.userSong,
      isLoading: true,
      songs: [],
      playing: false,
      currentSong: 0,
      user: '',
      showSongInfo: true,
      songToEdit: null,
      modalOpen: false,
      modalType: 'newPlaylist',
    };
  }
  componentDidMount(){
    console.log('activeplaylist did mount', this.state);
      //retrieve the active user based on id
      if(!this.state.activeUser){
        this.getUser();
      } 
  }
  componentWillReceiveProps(nextProps){
    console.log('Active playlist will recieve props');
    console.log(nextProps);
    if(nextProps.playlistId){
      this.getPlaylist(nextProps.playlistId);
      this.getSongs(nextProps.playlistId);
    }
    this.setState({
      playlistId: nextProps.playlistId
    })
  }
  getUser = () => {
    // console.log("getting users information", this.props);
    let userId;
    try{
      userId = this.state.authUser ? this.state.userId : this.props.match.params.userId;
    }catch(e){
      console.log('no user to load');
      userId = null;
    }
    
    if(userId){
      console.log('looking for user: ', userId);
      const userRef = this.props.firebase.db.doc(`/temp_users/${userId}`);
      let query = userRef.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching user');
        return;
        }  
        // console.log('user snapshot', snapshot.data())
        const data = snapshot.data();
        this.setState({
            activeUser: snapshot.data(),
            playlistId: data.playlistId
        })
        this.getPlaylist(data.playlistId);
        this.getSongs(data.playlistId);
    })
    .catch(err => {
        console.log('Error getting user', err);
    });
    }
  }
  getPlaylist = (playlistId) => {
    console.log("getting playlist information", this.props);
    console.log('playlist id', playlistId);
    const playlistRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
    let query = playlistRef.get()
    .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching playlist');
        return;
        }  
        // console.log('playlist snapshot', snapshot.data())
        const data = snapshot.data();
        this.setState({
            playlist: snapshot.data(),
        })
    })
    .catch(err => {
        console.log('Error getting playlist', err);
    });
  }
  getSongs = (playlistId) => {
    console.log('getting songs for playlist:  ' + playlistId);
    if(playlistId){
      const itemsRef = this.props.firebase.db.collection('songs');
      itemsRef.where('playlistId', '==', playlistId).get().then((snapshot) => {
        //let items = snapshot.val();
        console.log('songs snapshot',snapshot)
        let newState = [];
        snapshot.forEach((i) => {
          const item = i.data()
          const id = i.id;
          console.log('song id: '+ id)
          newState.push({
            title: item.title,
            url: item.url,
            userId: item.userId,
            playlistId: item.playlistId,
            upvotes: item.upvotes,
            downvotes: item.downvotes,
            votedOn: 0,
            id: id,
          });
        });
        this.setState({
          songs: newState
        });
      });
      }
  }
  addUserSong = (addedSong) => {
    console.log('adding user song in activate playlist', addedSong)
    this.setState({
      userSong: addedSong,
      songs: [...this.state.songs, addedSong],
      modalOpen: false
    })
  }
  upvoteSong = (e,songId) => {
    // console.log('upvoting song: ' + songId);
    // const increment = this.props.firebase.db.FieldValue.increment(1);
    // songRef.update({ upvotes: admin.FieldValue.increment(1) });
    // dumb workaround while decrement won't work
    const songRef = this.props.firebase.db.collection('songs').doc(songId);
    let currentVotes = 0;
    let query = songRef.get().then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching song.');
          return;
        }  
        // console.log('song increment snapshot', snapshot.data())
        const data = snapshot.data();
        const id = snapshot.id;
        currentVotes = data.upvotes + 1;
        songRef.update({ upvotes: currentVotes});
        data['upvotes'] = currentVotes;
        data['id'] = id;
        data['votedOn'] = 1;
        // console.log('updated song vals', data)
        const updatedSongArray = this.state.songs.map((song) => {
          if(song.id === id){
              song = data
          }
          return song;
        });
        // console.log('updated songs',updatedSongArray);
        this.setState({
          songs: updatedSongArray
        })
    })
    .catch(err => {
        console.log('Error getting song', err);
    });
  }
  undoUpvote = (e,songId) => {
    // console.log('undoing downvote song: ' + songId);
    // songRef.update({ downvotes: admin.FieldValue.decrement(1) });
    // dumb workaround while decrement won't work
    const songRef = this.props.firebase.db.collection('songs').doc(songId);
    let currentVotes = 0;
    let query = songRef.get().then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching song.');
        return;
        }  
        // console.log('increment snapshot', snapshot.data())
        const data = snapshot.data();
        const id = snapshot.id;
        currentVotes = data.upvotes - 1;
        songRef.update({ upvotes: currentVotes});
        data['upvotes'] = currentVotes;
        data['id'] = id;
        data['votedOn'] = 0;
        // console.log('updated song vals', data)
        const updatedSongArray = this.state.songs.map((song) => {
          if(song.id === id){
              song = data
          }
          return song;
        });
        // console.log('updated songs',updatedSongArray);
        this.setState({
          songs: updatedSongArray
        })
    })
    .catch(err => {
        console.log('Error getting song', err);
    });
  }
  downvoteSong = (e,songId) => {
    // console.log('downvoting song: ' + songId);
    // songRef.update({ upvotes: admin.FieldValue.decrement(1) });
    // dumb workaround while decrement won't work
    const songRef = this.props.firebase.db.collection('songs').doc(songId);
    let currentVotes = 0;
    let query = songRef.get().then(snapshot => {
        if (snapshot.empty) {
          // console.log('No matching documents.');
        return;
        }  
        console.log('increment snapshot', snapshot.data())
        const data = snapshot.data();
        const id = snapshot.id;
        currentVotes = data.downvotes + 1;
        songRef.update({ downvotes: currentVotes});
        data['downvotes'] = currentVotes;
        data['id'] = id;
        data['votedOn'] = -1;
        console.log('updated song vals', data)
        const updatedSongArray = this.state.songs.map((song) => {
          if(song.id === id){
              song = data
          }
          return song;
        });
        console.log('updated songs',updatedSongArray);
        this.setState({
          songs: updatedSongArray
        })
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
  }
  undoDownvote = (e,songId) => {
    console.log('undoing downvote song: ' + songId);
    // songRef.update({ downvotes: admin.FieldValue.decrement(1) });
    // dumb workaround while decrement won't work
    const songRef = this.props.firebase.db.collection('songs').doc(songId);
    let currentVotes = 0;
    let query = songRef.get().then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }  
        console.log('increment snapshot', snapshot.data())
        const data = snapshot.data();
        const id = snapshot.id;
        currentVotes = data.downvotes - 1;
        songRef.update({ downvotes: currentVotes});
        data['downvotes'] = currentVotes;
        data['id'] = id;
        data['votedOn'] = false;
        console.log('updated song vals', data)
        const updatedSongArray = this.state.songs.map((song) => {
          if(song.id === id){
              song = data
          }
          return song;
        });
        console.log('updated songs',updatedSongArray);
        this.setState({
          songs: updatedSongArray
        })
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
  }
  editSong = (e,songId) => {
    console.log('editing song: ' + songId);
    this.setState({
      modalOpen: true,
      modalType: 'editSong',
      songToEdit: songId,
    })
  }
  updateUserSong = (editedSong, deletedSong) => {
    console.log('updating user song in activate playlist');
    console.log('new song', editedSong);
    console.log('deleted song', deletedSong);
    const deleteRef = this.props.firebase.db.collection('songs').doc(deletedSong);
    deleteRef.delete()
    .then(()=>{
      console.log(deletedSong + " deleted successfully")
    })
    .catch((err) => {
      console.log("error deleting song")
    })
    const removeOldSong = this.state.songs.filter((song) => (song.id != deletedSong));
    this.setState({
      songs: [editedSong,...removeOldSong],
      modalOpen: false
    })
    
  } 
  deleteSong = (songId) => {
    console.log('deleting song: ' + songId);
    const deleteRef = this.props.firebase.db.collection('songs').doc(songId);
    deleteRef.delete()
    .then(()=>{
      console.log(songId + " deleted successfully")
    })
    .catch((err) => {
      console.log("error deleting song")
    })
    this.setState({songs: this.state.songs.filter((song) => (song.id != songId))})
  }
  playPlaylist = () => {
    console.log("playing playlist");
    this.setState({
      playing: true,
    })
  }
  advancePlaylist = () => {
    console.log("advancing playlist");
    const nextSong = this.state.currentSong >= this.state.songs.length - -1 ? 0 : this.state.currentSong + 1;
    this.setState({
      playing: true,
      currentSong: nextSong,
    })
  }
  pausePlaylist = () => {
    console.log("pausing playlist");
    this.setState({
      playing: false,
    })
  }
  stopPlaylist = () => {
    console.log("stopping playlist");
    this.setState({
      playing: false,
      currentSong: 0,
    })
  }
  openModal = (modalType, modalCallback) => {
    this.setState({
        modalOpen: true,
        modalType: modalType,
        modalCallback: modalCallback
    })
  }
  closeModal = () => {
    this.setState({modalOpen: false})
  }
  render(){
    console.log('active playlist did render', this.state)
    const songs = !this.state.songs.length ? 
      null
      :
      this.state.songs.map((song,i)=>{
        console.log(song);
        const linkFrag = song.url.split('=')[1];
        const playing = i === this.state.currentSong && this.state.playing;
        const selfSong = song.userId === this.state.userId;
        // console.log(this.state);
        // console.log("this song belongs to user: ", song, this.state);
        const votedOnByThisUser = song.votedOn;
        // console.log("this song voted on by user: " + song.votedOn)
        // const borderStyle = i === this.state.currentSong && this.state.playing ? "2px solid aqua" : "2px solid transparent";
        let borderStyle;
        if(i === this.state.currentSong && this.state.playing){
          borderStyle = "2px solid aqua";
        } else if (!selfSong && !votedOnByThisUser){
          borderStyle = "2px solid red";
        } else if (selfSong){
          borderStyle = "2px solid black";
        } else {
          borderStyle = "2px solid transparent"
        }
        return(
            <Grid key={song.id} style={{border:borderStyle, margin:"1vh 0"}} columns={2} divided>
                <Grid.Column width={10} style={{padding:"0"}}>
                  <ReactPlayer
                    url={'https://www.youtube.com/watch?v='+linkFrag}
                    className='react-player'
                    playing={playing}
                    width='100%'
                    height='100%'
                />
                </Grid.Column>
                <Grid.Column width={6}>
                  <Grid.Row>
                  <Grid columns={3} style={{padding:"0"}}>
                    <span style={{width:"40vw", height: "10vh", overflow:"hidden" }}>
                      {song.title}
                    </span>
                    {
                      selfSong || this.state.authUser ? 
                      <Grid.Row>
                        <Button className="song-button edit-button" onClick={(e)=>this.editSong(e,song.id)}><Icon name="edit"/></Button>
                        <Button className="song-button delete-button" onClick={()=>this.deleteSong(song.id)}><Icon name="delete"/></Button>
                      </Grid.Row> 
                      : ""
                    }
                    {
                      !this.props.gameMode ? "" :
                      votedOnByThisUser === 1 ? 
                        <Grid.Column style={{padding:"0"}}>
                          <Button className="song-button upvote-button" onClick={(e)=>this.undoUpvote(e,song.id)}><Icon name="thumbs up" style={{color:"green"}}/>{song.upvotes}</Button>
                        </Grid.Column> :
                        <Grid.Column style={{padding:"0"}}>
                          <Button className="song-button upvote-button" onClick={(e)=>this.upvoteSong(e,song.id)}><Icon name="thumbs up"/>{song.upvotes}</Button>
                        </Grid.Column>
                    }
                    {
                      !this.props.gameMode ? "" :
                      votedOnByThisUser === -1 ? 
                      <Grid.Column style={{padding:"0"}}>
                        <Button className="song-button downvote-button" onClick={(e)=>this.undoDownvote(e,song.id)}><Icon name="thumbs down" style={{color:"red"}}/>{song.downvotes}</Button>
                      </Grid.Column> :
                      <Grid.Column style={{padding:"0"}}>
                        <Button className="song-button downvote-button" onClick={(e)=>this.downvoteSong(e,song.id)}><Icon name="thumbs down"/>{song.downvotes}</Button>
                      </Grid.Column>
                    }
                  </Grid>
                  </Grid.Row>
                </Grid.Column>
            </Grid> 
  
        )
      })
      let content = "";
      if(!songs && this.props.gameMode){
          if(!this.state.playlistId){
            content = <Button color="red" onClick={()=>this.openModal('newSong')}>
                        add your song<br></br>
                        we can't start without you
                     </Button>
          } else {
            content = <Label color="orange" style={{padding: "5vw"}}>
                        make a playlist first.<br></br>
                        then we'll talk
                      </Label>
          }
      }
    return (
      <React.Fragment>
      <Grid fluid style={{textAlign: "center"}} columns={1}>
        <Grid.Row centered>
            {
              !this.state.authUser ? "":
              <React.Fragment>
                <Button onClick={this.playPlaylist}>
                  <Icon color="green" name="play"/>
                </Button>
                <Button onClick={this.advancePlaylist}>
                  <Icon color="grey" name="forward"/>
                </Button>
                <Button onClick={this.pausePlaylist}>
                  <Icon color="grey" name="pause"/>
                </Button>
                <Button onClick={this.stopPlaylist}>
                  <Icon color="red" name="stop"/>
                </Button>
              </React.Fragment>
            }
            {
              this.props.gameMode ? 
              <React.Fragment>
                <Label>
                  {this.state.activeUser ? "secretname:" + this.state.activeUser.secretname : ""}
                </Label>
                <Label>
                  {this.state.activeUser ? "displayname:" + this.state.activeUser.username : ""}
                </Label>
              </React.Fragment>
              :
              <Button color="red" onClick={()=>this.openModal('newSong')}>
                add song
              </Button>
            }
            
          </Grid.Row>
        <Grid.Column>
          {
            !this.state.playlistId ?
            <Grid.Row>
              <Label color="orange" style={{padding: "5vw"}}>
                make a playlist first.<br></br>
                then we'll talk
              </Label>
            </Grid.Row>
            :
            <Grid.Row>
            {songs}
           </Grid.Row>
          }
        </Grid.Column>
      </Grid>
      {
        !this.state.modalOpen ? "" :
        <Modal open={this.state.modalOpen}>
            <Button onClick={this.closeModal}>X</Button>
            {
              this.state.modalType === "editSong" ?
              <NewSong userProps={this.state} callback={this.updateUserSong} edit={true} songToEdit={this.state.songToEdit}/> 
              :
              <NewSong userProps={this.state} callback={this.addUserSong} edit={false}/>
            }
        </Modal>
    }
    </React.Fragment>
    );
  }
}

const ActivePlaylist = withRouter(ActivePlaylistBase)
export default ActivePlaylistPage;
export {ActivePlaylist};