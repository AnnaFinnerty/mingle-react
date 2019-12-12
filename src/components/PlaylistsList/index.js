import React, {Component} from 'react';

import EditPlaylist from '../EditPlaylist';

import { Modal, Feed, Grid, Icon, Button, Label, TextArea, Tab } from 'semantic-ui-react';

class PlaylistsList extends Component{
    constructor(props){
        super()
        this.state = {
            playlists: [],
            playlistToEdit: null,
            modalOpen: false,
            modalType: 'newPlaylist',
        }
        this.updatePlaylist = this.updatePlaylist.bind(this)
    }
    componentDidMount(){
        this.getPlaylists(this.state.authUser);
        if(!this.state.reduceApiCalls){
            this.getPlaylists(this.state.authUser);
        }
    }
    getPlaylists = () => {
        //if there is an active user
        if(this.props.userId){
            //find user's playlists in db
            const itemsRef = this.props.firebase.db.collection('playlists');
            const query = itemsRef.where('userId', '==', this.props.userId).get().then((snapshot) => {
            let newItems = [];
            snapshot.forEach((i) => {
                const item = i.data()
                const id = i.id;
                newItems.push({
                    active: item.active,
                    date: item.date,
                    userId: item.userId,
                    title: item.title,
                    mood: item.mood,
                    id: id,
                });
            });
                this.setState({
                    playlists: newItems
                });
            });
        }
    }
    editPlaylist = (playlistId) => {
        const itemRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
        let query = itemRef.get().then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                return;
                }  
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
    updatePlaylist = (updatedPlaylist) => {
        const playlistId = updatedPlaylist.id;
        const playlistRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
        playlistRef.update({
              active: updatedPlaylist.active,
              title: updatedPlaylist.title,
              mood: updatedPlaylist.mood,
              userId: updatedPlaylist.userId,
              date: updatedPlaylist.date
          })
          .then(function(docRef) {
              console.log("document updated");
          })
          .catch(function(error) {
              console.error("Error updating document: ", error);
          });
        this.setState({
            modalOpen: false
        })
    }
    deletePlaylist = (playlistId) => {
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
    openModal = (modalType) => {
        this.setState({
            modalOpen: true,
            modalType: modalType
        })
    }
    closeModal = () => {
        this.setState({modalOpen: false})
      }
    render(){
        const playlists = !this.state.playlists.length ?
          <Label>no playlists</Label> :
          this.state.playlists.map((playlist)=>{
            const backgroundColor = playlist.active ?  "aqua":"transparent"
            return(
        
              <Feed.Event key={playlist.id} style={{padding:".5vh", borderBottom:".5px solid dimgray"}}>
                <Grid columns={4} style={{backgroundColor:backgroundColor}}>
                    <Grid.Column >
                        {playlist.title}
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name="delete" onClick={()=>this.deletePlaylist(playlist.id)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name="edit" onClick={()=>this.editPlaylist(playlist.id)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name="lightbulb" onClick={()=>this.props.activatePlaylist(playlist.id)}/>
                    </Grid.Column>
                </Grid>
              </Feed.Event>
     
            )
          })
        return(
            <React.Fragment>
                <Feed>
                    {playlists}
                </Feed>
                {
                    !this.state.modalOpen ? "" :
                    <Modal open={this.state.modalOpen}>
                        <Button onClick={this.closeModal}>X</Button>
                        <EditPlaylist userProps={this.state} updatePlaylist={this.updatePlaylist}/>
                    </Modal>
                }
            </React.Fragment>
            
        )
    }
} 

export default PlaylistsList

