import React, {Component} from 'react';

import { Modal, Feed, Grid, Icon, Button, Label, TextArea, Tab } from 'semantic-ui-react';

class PlaylistsList extends Component{
    constructor(props){
        super()
        this.state = {
            playlists: [],
        }
    }
    componentDidMount(){
        this.getPlaylists(this.state.authUser);
        if(!this.state.reduceApiCalls){
            this.getPlaylists(this.state.authUser);
        }
    }
    getPlaylists = () => {
        console.log('getting playlists for: ' + this.props.userId);
        const itemsRef = this.props.firebase.db.collection('playlists');
        console.log('playlists item ref', itemsRef)
        const query = itemsRef.get().then((snapshot) => {
          console.log('getPlaylists snapshot',snapshot)
          let newItems = [];
          snapshot.forEach((i) => {
            const item = i.data()
            // console.log('playlist item', item)
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
    editPlaylist = (playlistId) => {
        console.log('getting playlist: ' + playlistId );
        const itemRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
        let query = itemRef.get().then(snapshot => {
                if (snapshot.empty) {
                console.log('No matching documents.');
                return;
                }  
                console.log('get snapshot', snapshot.data())
                const data = snapshot.data();
                data['id'] = snapshot.id;
                this.setState({
                    playlistToEdit: data,
                    modalOpen: true,
                    modalType: 'editPlaylist'
                })
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }
    deletePlaylist = (playlistId) => {
        console.log('deleting playlist: ' + playlistId);
        const deleteRef = this.props.firebase.db.collection('playlists').doc(playlistId);
        deleteRef.delete()
        .then(()=>{
            console.log(playlistId + " deleted successfully")
            this.setState({playlists: this.state.playlists.filter((playlist) => (playlist.id != playlistId))})
        })
        .catch((err) => {
        console.log("error deleting song")
        })
    }
    render(){
        const playlists = !this.state.playlists.length ?
          <Label>no playlists</Label> :
          this.state.playlists.map((playlist)=>{
            return(
            <div className="list-item">
              <Feed.Event key={playlist.id} >
                <Grid columns={3}>
                    <Grid.Column>
                        {playlist.title}
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name="delete" onClick={()=>this.deletePlaylist(playlist.id)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name="edit" onClick={()=>this.editPlaylist(playlist.id)}/>
                    </Grid.Column>
                </Grid>
              </Feed.Event>
              </div>
            )
          })
        return(
            <Feed>
                {playlists}
            </Feed>
        )
    }
} 

export default PlaylistsList

