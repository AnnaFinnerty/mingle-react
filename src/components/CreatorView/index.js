import React, {Component} from 'react';


import PlayersList from '../PlayersList';
import PlaylistsList from '../PlaylistsList';
import ActivePlaylist from '../ActivePlaylist';
import ModalWindow from '../Modal';
import Message from '../Message';

import { Modal, Container, Grid, Button, TextArea, Tab } from 'semantic-ui-react';

//POTENTIAL GAME SETTINGS
//do not allow vote until song play for X seconds

class CreatorView extends Component{
   
    constructor(props){
        super()
        // console.log('cretorView props', props)
        this.state = {
            playlists: [],
            players: props.players,
            activePlaylist: props.activePlaylist,
            invites: 0,
            playlistToEdit: '',
            messageOpen: false,
            messageText: '',
            modalOpen: false,
            modalType: 'newPlaylist',
            modalCallback: null,
            authUser: props.authUser,
            playlistId: props.activePlaylist,
            inviteCode: this.genInviteCode(props.playlistId),
            userSong: null,
            gameMessage: 'Welcome to the playlist',
            gameMode: 'submit',
            showSongInfo: false,
            reduceApiCalls: props.reduceApiCalls,
        }
    }
    componentWillReceiveProps(nextProps){
        // console.log('Active playlist will recieve props');
        // console.log(nextProps);
        this.setState({
          activePlaylist: nextProps.playlistId
        })
      }
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
    addedPlaylist = (playlistId) => {
        console.log('activating playlist in creator view:  ' + playlistId);
        this.closeModal();
        this.props.activatePlaylist(playlistId);
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
    render(){
        console.log('creatorView props', this.props);
        const panes = [
            { menuItem: 'Users', render: () => <Tab.Pane><PlayersList playlistId={this.state.playlistId} openModal={this.openModal} firebase={this.props.firebase} reduceApiCalls={this.props.reduceApiCalls}/></Tab.Pane> },
            { menuItem: 'Playlists', render: () => <Tab.Pane><PlaylistsList playlistId={this.state.playlistId} userId={this.state.authUser} openModal={this.openModal} firebase={this.props.firebase} reduceApiCalls={this.props.reduceApiCalls} activatePlaylist={this.props.activatePlaylist}/></Tab.Pane> },
        ]
        const inviteCode = this.genInviteCode();
        return(
            <React.Fragment>
                <Container fluid>
                    Game Controls
                </Container>
                <Grid columns={2} divided fluid="true">
                    <Grid.Column width={5} style={{backgroundColor:"gray", height: '80vh'}}>
                        <Grid.Row>
                            <Grid columns={3}>
                                <Grid.Column>
                                    <Button onClick={this.copyInviteCode}>copy link</Button>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button onClick={this.showQRCode}>show QR</Button>
                                </Grid.Column>
                            </Grid>
                            <TextArea id="invite-code" value={inviteCode}></TextArea>            
                        </Grid.Row>
                        <Grid.Row>
                            <Tab panes={panes} />
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Grid.Row>
                        <Grid.Row>
                            <ActivePlaylist userData={this.props.userData}
                                            userId={this.state.authUser}
                                            authUser={true} 
                                            playlistId={this.props.playlistId}
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

