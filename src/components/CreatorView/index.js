import React, {Component} from 'react';

import ModalWindow from '../Modal';
import ActivePlaylist from '../ActivePlaylist';
import AddTempUser from '../AddTempUser';

import { Modal, Feed, Grid, Icon, Button, Label, TextArea } from 'semantic-ui-react';

class CreatorView extends Component{
    constructor(props){
        super()
        this.state = {
            invites: 0,
            players: 0,
            inviteCode: '',
            modalOpen: true,
            modalType: 'newPlaylist',
            userId: props.userId,
            showSongLabels: false,
            reduceApiCalls: props.reduceApiCalls
        }
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
    closeModal = () => {
        this.setState({modalOpen: false})
      }
    render(){
        console.log('creatorView props', this.props);
        const users = this.props.players.map((user)=>{
            return(
              <Feed.Event style={{backgroundColor:"lightgray", padding:"2% 5%", margin:"0 5%", width:"90%"}}>
                <Feed.Label>
                  {user.secretname}
                </Feed.Label>
              </Feed.Event>
            )
          })
        const playlists = !this.props.playlists.length ?
          <Label>no playlists</Label> :
          this.props.playlists.map((playlist)=>{
            console.log(playlist);
            return(
              <Feed.Event style={{backgroundColor:"lightgray", padding:"2% 5%", margin:"0 5%", width:"90%"}}>
                <Feed.Label>
                  {playlist.title}
                  <Button><Icon name="delete"></Icon></Button>
                </Feed.Label>
              </Feed.Event>
            )
          })
        return(
   
            <React.Fragment>
                <Grid columns={2} divided fluid="true">
                    <Grid.Column>
                        <Grid.Row>
                            <Button onClick={this.props.toggleViewMode}>go to user view</Button>
                        </Grid.Row>
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
                            <Label>Users</Label>
                            {users}
                        </Grid.Row>
                        <Grid.Row>
                            <Label>Playlists</Label>
                            {playlists}
                        </Grid.Row>
                        <Grid.Row>
                            <AddTempUser />
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column>
                        <Grid.Row>
                            <Grid columns={3} divided fluid="true" color="white">
                            <Grid.Column><Button onClick={this.props.addPlaylist}>new playlist</Button></Grid.Column>
                            <Grid.Column><Button onClick={this.props.addPlaylist}>edit playlist</Button></Grid.Column>
                            <Grid.Column><Button onClick={this.props.addPlaylist}>delete playlist</Button></Grid.Column>
                            </Grid>
                        </Grid.Row>
                        <Grid.Row>
                            <ActivePlaylist authUser={this.props.userId} 
                                            playlistId={this.state.playlistId} 
                                            history={this.props.history} 
                                            match={this.props.match} 
                                            location={this.props.location} 
                                            reduceApiCalls={this.props.reduceApiCalls}
                                            />
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
                <Modal open={this.state.modalOpen}>
                    <Button onClick={this.closeModal}>X</Button>
                    <ModalWindow closeModal={this.closeModal} 
                                 modalType={this.state.modalType} 
                                 userProps={this.state}/>
                </Modal>
            </React.Fragment>
            
        )
    }
} 

export default CreatorView

