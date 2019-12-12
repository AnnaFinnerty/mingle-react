import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Feed, Input, Button, Label } from 'semantic-ui-react'
import { isFor } from '@babel/types';

const NewSongPage = (props) => (
  <div>
    <h2>{props.edit ? "Edit Song" : "Add Song"}</h2>
    <FirebaseContext.Consumer>
      {firebase => <NewSongForm {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class NewSongForm extends Component {
  constructor(props) {
    super(props);
    console.log('new song form props', props)
    this.state = { 
      title: '',
      url: '',
      playlistId: props.userProps.playlistId,
      userId: props.userProps.authUserId ? props.userProps.authUserId : props.userProps.userId,
      apiSearch: '',
      searchResults: [],
      error: null,
      manualEnter: false,
    };
  }
  componentDidMount(){
    this.loadSearchResults();
  }
  loadSearchResults = async() => {
    console.log("getting songs");
    //make query to youtube API for video results
    if(this.state.apiSearch){
        try{
            const searchResponse = await fetch("https://www.googleapis.com/youtube/v3/search?part=id&q="+this.state.apiSearch+"&type=video&key=AIzaSyDKZC4z0p_HotveLN_NpwTwZzHb_Vcn10c" , {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include'
              });
            const parsedResponse = await searchResponse.json();
            const searchResults = [];
            parsedResponse.items.forEach(element => {
                searchResults.push(element);
            });
            this.setState({searchResults: searchResults})
        } catch(e){
            console.log("error loading songs")
        }
    } else {
        console.log('no search term entered');
    }
  }
  onSubmit = event => {
    event.preventDefault();
    console.log('submitting new song', this.state);
    const { title, url, playlistId, userId } = this.state;
    //submit form information to firebase DB
    const newSong = {
        title: title,
        url: url,
        playlistId: playlistId,
        userId: userId,
        upvotes: 0,
        downvotes: 0
    }
    this.props.firebase.db.collection("songs").add(newSong)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        if(this.props.edit){
          console.log('replacing song: ' + this.props.songToEdit);
          console.log(newSong);
          this.props.callback(newSong, this.props.songToEdit);
        }
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  };
  onSelect = async (event,videoId) => {
    console.log("selecting video: " + videoId);
    const addedSongCallback = this.props.callback;
    const editSong = this.props.songToEdit;
    const searchResponse = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+videoId+"&key=AIzaSyDKZC4z0p_HotveLN_NpwTwZzHb_Vcn10c" , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
      const parsedResponse = await searchResponse.json();
      console.log('getVideoDetails res:' ,parsedResponse);
      const item = parsedResponse.items[0];
      console.log('item', item);
      if(item){
          const song = {
              title: item.snippet.title,
              url: 'https://www.youtube.com/watch?v='+videoId,
              playlistId: this.state.playlistId,
              userId: this.state.userId,
              upvotes: 0,
              downvotes: 0
          }
          this.props.firebase.db.collection("songs").add(song)
          .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
              song["id"] = docRef.id;
              addedSongCallback(song,editSong);
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });
      }
  }
  // addSong = (songToAdd) => {
  //   console.log('adding song');
  //   console.log(this.props.firebase)
  //   const key = this.props.firebase.database.ref('songs').push().key;
  //   console.log(key);
  //   songToAdd['id'] = key;
  //   const newSong={
  //       id: key,
  //       title: songToAdd.title,
  //       url: songToAdd.url,
  //       playlistId: songToAdd.playlistId,
  //       userId : songToAdd.userId,
  //       upvotes: 0,
  //       downvotes:0
  //   }
  //   this.props.firebase.db.collection("songs").push(newSong)
  //           .then(function(docRef) {
  //               console.log("Document written with ID: ", docRef.id);
  //           })
  //           .catch(function(error) {
  //               console.error("Error adding document: ", error);
  //           });
  // }
  onChange = event => {
    console.log("changing text");
    this.setState({ [event.target.name]: event.target.value });
  };
  onSearchChange = event => {
    console.log("searching youtube api");
    this.setState({ [event.target.name]: event.target.value });
  };
  onSearchSubmit = async event => {
      event.preventDefault();
      //youtube api key:
      //AIzaSyBb5vWas9spdMgJcBiK13_YnaUrCYVwOLQ
    this.loadSearchResults();
  }
  toggleEnterMode = () => {
      this.setState({manualEnter: !this.state.manualEnter})
  }
  render() {
    const searchResults = !this.state.searchResults.length ? "" : 
        this.state.searchResults.map((result) => {
            const linkFrag = result.id.videoId;
            return(
                <Feed.Event key={linkFrag} onClick={(e)=>this.onSelect(e,linkFrag)} className="hover-blue">
                    <Feed.Content style={{textAlign:'center'}}>
                        <div className="border-hover">
                            <iframe className="videoIFrame disable-click" src={"https://www.youtube.com/embed/"+linkFrag+"?rel=0&showinfo=0"} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </Feed.Content>
                </Feed.Event>
            )
        })

    const {
        title,
        url,
        playlistId,
        userId,
        error,
      } = this.state;
      const isInvalid =
      title === '' ||
      url === ''   ||
      userId === '' ||
      playlistId === '';
    return (
     <div style={{textAlign:'center'}}>
         {
             !this.state.manualEnter ? 
            <div>
                <form onSubmit={this.onSearchSubmit}>
                        <Input name='apiSearch' type="text" value={this.state.apiSearch} onChange={this.onSearchChange}></Input>
                </form>
                <Button color="orange" onClick={this.onSearchSubmit}>Search Youtube</Button>
                <br></br>
                <Button onClick={this.toggleEnterMode}>Enter Manually</Button> 
                <Feed className="column-centered">
                        {searchResults}
                </Feed>
            </div>
       :
       <div style={{minHeight: "60vh"}}> 
        <form onSubmit={this.onSubmit}>
            <Input
              name="title/artist"
              value={title}
              onChange={this.onChange}
              type="text"
              placeholder="Song Title"
            />
            <Input
              name="url"
              value={url}
              onChange={this.onChange}
              type="text"
              placeholder="Song URL"
            />
            <Input
              name="userId"
              value={userId}
              onChange={this.onChange}
              type="text"
              placeholder="userId (temp)"
            />
            <Input
              name="playlistId"
              value={playlistId}
              onChange={this.onChange}
              type="text"
              placeholder="playlistId"
            />
            <Button color="orange" disabled={isInvalid} type="submit">
              Submit Song
            </Button>
            <br></br>
            <Button onClick={this.toggleEnterMode}>Search Youtube</Button>
            {error && <p>{error.message}</p>}
        </form>
      </div>
        }
      </div>
    );
  }
}
export default NewSongPage;
export { NewSongForm };