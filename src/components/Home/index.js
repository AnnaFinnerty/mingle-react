import React, {Component} from 'react';
import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';
import '../../App.css';
import { Card, Image } from 'semantic-ui-react'

const HomePage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <Home firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class Home extends Component {
  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      songs: []
    };
  }
  componentDidMount() {
    console.log(this.props.firebase);
    const itemsRef = this.props.firebase.db.collection('songs');
    itemsRef.get().then((snapshot) => {
      //let items = snapshot.val();
      console.log('snapshot',snapshot)
      let newState = [];
      snapshot.forEach((i) => {
        const item = i.data()
        newState.push({
          title: item.title,
          artist: item.artist,
          url: item.url,
          userId: item.userId,
          playlistId: item.playlistId,
        });
      });
      this.setState({
        songs: newState
      });
    });
  }
  render(){
    console.log('songs', this.state.songs)
    const songs = this.state.songs.map((song)=>{
      const linkFrag = song.url.split('=')[1];
      return(
        <Card key={song.id}>
          <Card.Content header={song.title} />
          <Card.Content description={song.artist} />
          <Card.Content extra>
          <iframe className="videoIFrame" src={"https://www.youtube.com/embed/"+linkFrag+"?rel=0&showinfo=0"} frameBorder="0" allowFullScreen></iframe>
          </Card.Content>
        </Card>
      )
    })
    return (
      <div>
        Playlist 
        {songs}
      </div>
    );
  }
}

export default HomePage;
export {Home};