import React, {Component} from 'react';


import PlayersList from '../PlayersList';
import ActivePlaylist from '../ActivePlaylist';
import ModalWindow from '../Modal';
import Message from '../Message';

import { Modal, Feed, Grid, Icon, Button, Label, TextArea, Tab } from 'semantic-ui-react';

class CreatorView extends Component{
   
    constructor(props){
        super()
        console.log('cretorView props', props)
        this.state = {
            playlists: [],
            players: props.players,
            invites: 0,
            inviteCode: '',
            playlistToEdit: '',
            messageOpen: false,
            messageText: '',
            modalOpen: false,
            modalType: 'newPlaylist',
            authUser: props.authUser,
            playlistId: props.playlistId,
            userSong: null,
            showSongInfo: false,
            reduceApiCalls: props.reduceApiCalls
        }
    }
    componentDidMount(){
        // if(!this.state.activePlaylist){
        //     this.openMessage("no active playlist")
        // }
        this.getPlaylists(this.state.authUser);
        if(!this.state.reduceApiCalls){
            this.getPlaylists(this.state.authUser);
        }
    }
    getPlaylists = (userId) => {
        console.log('getting playlists for: ' + userId);
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
    genInviteCode = () => {
        console.log('generating invite code');
        const code = "http://localhost:3000/login/" + this.props.playlistId;
        this.setState({
            inviteCode: code
        })
    }
    copyInviteCode = () => {
        const input = document.getElementById("invite-code");
        //select text field
        input.select();
        input.setSelectionRange(0, 99999); //for mobile devices

        //copy text inside text field
        document.execCommand("copy");
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
    addedPlaylist = (playlistId) => {
        console.log('activating playlist in creator view:  ' + playlistId);
        this.closeModal();
        this.props.activatePlaylist(playlistId);
    }
    render(){
        console.log('creatorView props', this.props);
        const playlists = !this.state.playlists.length ?
          <Label>no playlists</Label> :
          this.state.playlists.map((playlist)=>{
            return(
              <Feed.Event key={playlist.id} style={{backgroundColor:"lightgray", padding:"2% 5%", margin:"0 5%", width:"90%"}}>
                <Feed.Label>
                  {playlist.title}
                </Feed.Label>
                <Button size="small" onClick={()=>this.deletePlaylist(playlist.id)}>
                    <Icon name="delete"/>
                </Button>
                <Button size="small" onClick={()=>this.editPlaylist(playlist.id)}>
                    <Icon name="edit"/>
                </Button>
              </Feed.Event>
            )
          })
        const panes = [
            { menuItem: 'Users', render: () => <Tab.Pane><PlayersList playlistId={this.state.playlistId} firebase={this.props.firebase} reduceApiCalls={this.props.reduceApiCalls}/></Tab.Pane> },
            { menuItem: 'Playlists', render: () => <Tab.Pane>{playlists}</Tab.Pane> },
        ]
        return(
            <React.Fragment>
                <Grid columns={2} divided fluid="true">
                    <Grid.Column width={5} style={{backgroundColor:"gray", height: '80vh'}}>
                        <Grid.Row>
                            <Grid columns={2}>
                                <Grid.Column>
                                    <Button onClick={this.genInviteCode}>share link</Button>
                                </Grid.Column>
                                <Grid.Column>
                                    <TextArea id="invite-code" value={this.state.inviteCode}></TextArea>
                                    <Button onClick={this.copyInviteCode}>copy</Button>
                                </Grid.Column>
                            </Grid>            
                        </Grid.Row>
                        <Grid.Row>
                            <Tab panes={panes} />
                        </Grid.Row>
                        
                    </Grid.Column>
                    <Grid.Column >
                        <Grid.Row>
                            <Grid columns={3} fluid="true">
                            <Grid.Column><Button onClick={()=>this.openModal("newPlaylist")}>new playlist</Button></Grid.Column>
                            <Grid.Column><Button onClick={()=>this.openModal("editPlaylist")}>edit playlist</Button></Grid.Column>
                            <Grid.Column><Button >delete playlist</Button></Grid.Column>
                            </Grid>
                        </Grid.Row>
                        <Grid.Row>
                        <Grid.Row>
                        {
                            this.props.userSong ? "" :
                            <Button color="red" onClick={()=>this.openModal('newSong')}>
                                add your song<br></br>
                                we can't start without you
                            </Button>
                        }
                        </Grid.Row>
                        <Grid.Row>
                            <ActivePlaylist userId={this.state.authUser}
                                            authUser={true} 
                                            playlistId={this.state.playlistId}
                                            openModal={this.openModal} 
                                            history={this.props.history} 
                                            match={this.props.match} 
                                            location={this.props.location} 
                                            reduceApiCalls={this.props.reduceApiCalls}
                                            />
                        </Grid.Row>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
                {
                    !this.state.modalOpen ? "" :
                    <Modal open={this.state.modalOpen}>
                        <Button onClick={this.closeModal}>X</Button>
                        <ModalWindow closeModal={this.closeModal} 
                                     modalType={this.state.modalType} 
                                     userProps={this.state}
                                     callback={this.addedPlaylist}
                                     />
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
            
        )
    }
} 

export default CreatorView

