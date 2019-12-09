import React, { Component, useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import ReactPlayer from 'react-player';

import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';

import '../../App.css';
import { Card, Grid, Button, Label, Icon } from 'semantic-ui-react';


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
    super(props);
    this.unsubscribe = null;
    this.state = {
      isAuthUser: props.authUser,
      userId: props.userId,
      playlistId: props.playlistId,
      usersSong: props.usersSong,
      isLoading: true,
      songs: [],
      playing: false,
      currentSong: 0,
      user: '',
      showSongInfo: true,
    };
  }
  componentDidMount(){
    console.log('activeplaylist did mount', this.props);
    const userId = !this.props.authUser ? this.props.match.params.userId : this.props.authUser;
    console.log('userId in playlist:  ' + userId);
  
      //move to user view!
      // const userRef = this.props.firebase.db.doc(`/temp_users/${userId}`);
      // const self = this;
      // let query = userRef.get()
      //   .then(snapshot => {
      //     if (snapshot.empty) {
      //       console.log('No matching user');
      //       return;
      //     }  
      //     console.log('user snapshot in active playlist', snapshot.data())
      //     const data = snapshot.data();
      //     this.setState({
      //       username: data.username,
      //       secretname: data.secretname,
      //     })
      //   })
      //   .catch(err => {
      //     console.log('Error getting documents', err);
      //   });
      this.getSongs();
      if(!this.props.reduceApiCalls){
        this.getSongs();
      } 
  }
  getSongs() {
    console.log('getting songs');
    const itemsRef = this.props.firebase.db.collection('songs');
    itemsRef.get().then((snapshot) => {
      //let items = snapshot.val();
      console.log('snapshot',snapshot)
      let newState = [];
      snapshot.forEach((i) => {
        const item = i.data()
        const id = i.id;
        newState.push({
          title: item.title,
          url: item.url,
          userId: item.userId,
          playlistId: item.playlistId,
          id: id,
        });
      });
      this.setState({
        songs: newState
      });
    });
  }
  upvoteSong(e,songId){
    console.log('upvoting song: ' + songId);
    const increment = this.props.firebase.firestore.FieldValue.increment(1);
    const songRef = this.props.firebase.db.collection('songs').doc(songId);
    // Update read count
    songRef.update({ upvotes: increment });
    // const deleteRef = this.props.firebase.db.collection('songs').doc(songId);
    // deleteRef.delete()
    // .then(()=>{
    //   console.log(songId + " deleted successfully")
    // })
    // .catch((err) => {
    //   console.log("error deleting song")
    // })
    // this.setState({songs: this.state.songs.filter((song) => (song.id != songId))})
  }
  downvoteSong(e,songId){
    console.log('downvoting song: ' + songId);
    // const deleteRef = this.props.firebase.db.collection('songs').doc(songId);
    // deleteRef.delete()
    // .then(()=>{
    //   console.log(songId + " deleted successfully")
    // })
    // .catch((err) => {
    //   console.log("error deleting song")
    // })
    // this.setState({songs: this.state.songs.filter((song) => (song.id != songId))})
  }
  deleteSong(e,songId){
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
  updateSong(e,songId){
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
  render(){
    // console.log('songs', this.state.songs)
    const songs = !this.state.songs.length ? 
      <Label>No songs added</Label>
      :
      this.state.songs.map((song,i)=>{
        const linkFrag = song.url.split('=')[1];
        const playing = i === this.state.currentSong && this.state.playing;
        const borderStyle = i === this.state.currentSong && this.state.playing ? "2px solid aqua" :"2px solid transparent";
        return(
          
            <Grid key={song.id} style={{border:borderStyle}} columns={2} divided>
              <Grid.Row>
                <Grid.Column width={10}>
                  {/* <iframe id={song.id} className="videoIFrame" src={"https://www.youtube.com/embed/"+linkFrag+"?rel=0&showinfo=0"} frameBorder="0" allowFullScreen allow="autoplay"></iframe> */}
                  <ReactPlayer
                    url={'https://www.youtube.com/watch?v='+linkFrag}
                    className='react-player'
                    playing={playing}
                    width='100%'
                    height='50%'
                />
                </Grid.Column>
                <Grid.Column width={6}>
                <Card.Content header={song.title} />
                  <button className="song-button upvote-button" onClick={(e)=>this.upvoteSong(e,song.id)}><Icon name="thumbs up"/></button>
                  <button className="song-button downvote-button" onClick={(e)=>this.downvoteSong(e,song.id)}><Icon name="thumbs down"/></button>
                  <button className="song-button delete-button" onClick={(e)=>this.deleteSong(e,song.id)}><Icon name="delete"/></button>
                </Grid.Column>
              </Grid.Row>
            </Grid> 
  
        )
      })
    return (
      <Grid columns={1}>
        <Grid.Column>
          <Grid.Row columns={2}>
              <Grid.Column>
                <h2>{this.state.username}</h2>
              </Grid.Column>
              <Grid.Column><h2>{this.state.username}/{this.state.secretname}</h2></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {
              !this.state.isAuthUser ? "":
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
          </Grid.Row>
          <Grid.Row>
            {songs}
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

const ActivePlaylist = withRouter(ActivePlaylistBase)
export default ActivePlaylistPage;
export {ActivePlaylist};