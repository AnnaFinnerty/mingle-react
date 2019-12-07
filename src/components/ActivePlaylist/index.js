import React, {Component} from 'react';
import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';
import '../../App.css';
import { Card, Grid, Button, Label, Icon } from 'semantic-ui-react'

const ActivePlaylistPage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <ActivePlaylist firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class ActivePlaylist extends Component {
  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      songs: []
    };
  }
  componentDidMount(){
    this.getSongs();
  }
  getSongs() {
    console.log(this.props.firebase);
    const itemsRef = this.props.firebase.db.collection('songs');
    itemsRef.get().then((snapshot) => {
      //let items = snapshot.val();
      console.log('snapshot',snapshot)
      let newState = [];
      snapshot.forEach((i) => {
        const item = i.data()
        const id = i.id;
        console.log(item);
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
  render(){
    console.log('songs', this.state.songs)
    const songs = !this.state.songs.length ? 
      <Label>No songs added</Label>
      :
      this.state.songs.map((song)=>{
      const linkFrag = song.url.split('=')[1];
      return(
        <Card fluid key={song.id}>
         <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <iframe className="videoIFrame" src={"https://www.youtube.com/embed/"+linkFrag+"?rel=0&showinfo=0"} frameBorder="0" allowFullScreen></iframe>
            </Grid.Column>
            <Grid.Column>
            <Card.Content header={song.title} />
              <Button onClick={(e)=>this.upvoteSong(e,song.id)} style={{color:"green"}}><Icon name="thumbs up"/></Button>
              <Button onClick={(e)=>this.downvoteSong(e,song.id)} style={{color:"red"}}><Icon name="thumbs down"/></Button>
              <Button onClick={(e)=>this.deleteSong(e,song.id)}><Icon name="delete"/></Button>
            </Grid.Column>
          </Grid.Row>
        </Grid> 
        </Card>
        
      )
    })
    return (
      <div>
        <h2>Playlist </h2>
        {songs}
      </div>
    );
  }
}

export default ActivePlaylistPage;
export {ActivePlaylist};