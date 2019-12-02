import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Feed, Input, Button } from 'semantic-ui-react'

const NewSongPage = () => (
  <div>
    <h2>Add New Song</h2>
    <FirebaseContext.Consumer>
      {firebase => <NewSongForm firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

const INITIAL_STATE = {
    title: '',
    url: '',
    playlistId: '',
    userId: '',
    apiSearch: '',
    searchResults: [],
    error: null,
  };

class NewSongForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
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
            console.log('getSearches res:' ,parsedResponse);
            const searchResults = [];
            parsedResponse.items.forEach(element => {
                console.log(element)
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
    const { title, url, playlistId, userId } = this.state;
    //submit form information to firebase DB
    this.props.firebase.db.collection("songs").add({
        title: title,
        url: url,
        playlistId: playlistId,
        userId: userId
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    
  };
  onSelect = async (event,videoId) => {
      console.log("selecting video: " + videoId);
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
            this.props.firebase.db.collection("songs").add({
                title: item.snippet.title,
                url: 'https://www.youtube.com/watch?v='+videoId,
                playlistId: 1,
                userId: 1
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
  }
  onChange = event => {
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
       <form onSubmit={this.onSearchSubmit}>
            <Input name='apiSearch' type="text" value={this.state.apiSearch} onChange={this.onSearchChange}></Input>
       </form>
       <Button onClick={this.onSearchSubmit}>Search Youtube</Button> 
       <Feed className="column-centered">
            {searchResults}
       </Feed>
       <br></br>
       Or enter manually
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
        <Button disabled={isInvalid} type="submit">
          Submit Song
        </Button>
        {error && <p>{error.message}</p>}
      </form>
      </div>
    );
  }
}
export default NewSongPage;
export { NewSongForm };