import React, {Component} from 'react';


import PlayersList from '../PlayersList';
import PlaylistsList from '../PlaylistsList';
import ActivePlaylist from '../ActivePlaylist';
import ModalWindow from '../Modal';
import Message from '../Message';

import { Modal, Feed, Grid, Icon, Button, Label, TextArea, Tab } from 'semantic-ui-react';

class CreatorView extends Component{
   
    constructor(props){
        super()
        // console.log('cretorView props', props)
        this.state = {
            playlists: [],
            players: props.players,
            invites: 0,
            playlistToEdit: '',
            messageOpen: false,
            messageText: '',
            modalOpen: false,
            modalType: 'newPlaylist',
            modalCallback: null,
            authUser: props.authUser,
            playlistId: props.playlistId,
            inviteCode: this.genInviteCode(props.playlistId),
            userSong: null,
            showSongInfo: false,
            reduceApiCalls: props.reduceApiCalls
        }
    }
    componentDidMount(){
        // this.getPlaylists(this.state.authUser);
        // if(!this.state.reduceApiCalls){
        //     this.getPlaylists(this.state.authUser);
        // }
    }
    // getPlaylists = (userId) => {
    //     // console.log('getting playlists for: ' + userId);
    //     const itemsRef = this.props.firebase.db.collection('playlists');
    //     const query = itemsRef.get().then((snapshot) => {
    //     //   console.log('getPlaylists snapshot',snapshot)
    //       let newItems = [];
    //       snapshot.forEach((i) => {
    //         const item = i.data()
    //         // console.log('playlist item', item)
    //         const id = i.id;
    //         newItems.push({
    //           date: item.date,
    //           userId: item.userId,
    //           title: item.title,
    //           mood: item.mood,
    //           id: id,
    //         });
    //       });
    //       this.setState({
    //         playlists: newItems
    //       });
    //     });
    // }
    // editPlaylist = (playlistId) => {
    //     console.log('editing playlist: ' + playlistId );
    //     const itemRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
    //     let query = itemRef.get().then(snapshot => {
    //             if (snapshot.empty) {
    //             console.log('No matching documents.');
    //             return;
    //             }  
    //             console.log('get snapshot', snapshot.data())
    //             const data = snapshot.data();
    //             data['id'] = snapshot.id;
    //             this.setState({
    //                 playlistToEdit: data,
    //                 modalOpen: true,
    //                 modalType: 'editPlaylist'
    //             })
    //         })
    //         .catch(err => {
    //             console.log('Error getting documents', err);
    //         });
    // }
    // deletePlaylist = (playlistId) => {
    //     console.log('deleting playlist: ' + playlistId);
    //     const deleteRef = this.props.firebase.db.collection('playlists').doc(playlistId);
    //     deleteRef.delete()
    //     .then(()=>{
    //         console.log(playlistId + " deleted successfully")
    //         this.setState({playlists: this.state.playlists.filter((playlist) => (playlist.id != playlistId))})
    //     })
    //     .catch((err) => {
    //     console.log("error deleting song")
    //     })
    // }
    genInviteCode = (playlistId) => {
        console.log('generating invite code');
        const code = "http://localhost:3000/login/" + playlistId;
        return code
    }
    copyInviteCode = () => {
        const input = document.getElementById("invite-code");
        //select text field
        input.select();
        input.setSelectionRange(0, 99999); //for mobile devices

        //copy text inside text field
        document.execCommand("copy");
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
        // console.log('creatorView props', this.props);
        const panes = [
            { menuItem: 'Users', render: () => <Tab.Pane><PlayersList playlistId={this.state.playlistId} openModal={this.openModal} firebase={this.props.firebase} reduceApiCalls={this.props.reduceApiCalls}/></Tab.Pane> },
            { menuItem: 'Playlists', render: () => <Tab.Pane><PlaylistsList playlistId={this.state.playlistId} userId={this.state.authUser} openModal={this.openModal} firebase={this.props.firebase} reduceApiCalls={this.props.reduceApiCalls}/></Tab.Pane> },
        ]
        return(
            <React.Fragment>
                <Grid columns={2} divided fluid="true">
                    <Grid.Column width={5} style={{backgroundColor:"gray", height: '80vh'}}>
                        <Grid.Row>
                            <Grid columns={2}>
                                <Grid.Column>
                                    <Button onClick={this.copyInviteCode}>copy link</Button>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button onClick={this.showQRCode}>show QR</Button>
                                </Grid.Column>
                            </Grid>
                            <TextArea id="invite-code" value={this.state.inviteCode}></TextArea>            
                        </Grid.Row>
                        <Grid.Row>
                            <Tab panes={panes} />
                        </Grid.Row>
                        
                    </Grid.Column>
                    <Grid.Column >
                        {/* <Grid.Row>
                            <Grid columns={3} fluid="true">
                            <Grid.Column><Button onClick={()=>this.openModal("newPlaylist")}>new playlist</Button></Grid.Column>
                            <Grid.Column><Button onClick={()=>this.openModal("editPlaylist")}>edit playlist</Button></Grid.Column>
                            <Grid.Column><Button >delete playlist</Button></Grid.Column>
                            </Grid>
                        </Grid.Row> */}
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
                                     userProps={this.state}
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

