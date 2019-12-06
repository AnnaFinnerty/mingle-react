import React, {Component} from 'react';

import ActivePlaylist from '../ActivePlaylist';

import { Grid, Button, Label, TextArea } from 'semantic-ui-react';

class CreatorView extends Component{
    constructor(){
        super()
        this.state = {
            invites: 0,
            players: 0,
            inviteCode: '',
            inviteCodeInput: document.getElementById("invite-code")
        }
    }
    genInviteCode = () => {
        console.log('generating invite code');
        const code = "https://song-battle.herokuapp.com/" + this.props.playlistId;
        this.setState({
            inviteCode: code
        })
    }
    copyInviteCode = () => {
        //select text field
        this.state.inviteCodeInput.select();
        this.state.inviteCodeInput.setSelectionRange(0, 99999); //for mobile devices

        //copy text inside text field
        document.execCommand("copy");
    }
    render(){
        return(
   
            <React.Fragment>
                <Grid columns={2} divided>
                    <Grid.Column>
                        <Grid.Row>
                            <Button onClick={this.props.toggleViewMode}>go to user view</Button>
                        </Grid.Row>
                        <Grid.Row>
                            <Button onClick={this.genInviteCode}>share link</Button>
                   
                    
                            <TextArea id="invite-code" value={this.state.inviteCode}></TextArea>
                            
                            <Button onClick={this.copyInviteCode}>copy</Button>
                        </Grid.Row>
                        <Grid.Row>
                            <Button onClick={this.props.addPlaylist}>new playlist</Button>
                            <Button onClick={this.props.addPlaylist}>delete playlist</Button>
                        </Grid.Row>
                        
                        <Label>Contributors</Label>
                    </Grid.Column>
                    <Grid.Column>
                        <ActivePlaylist/>
                    </Grid.Column>
                </Grid>
            </React.Fragment>
            
        )
    }
} 

export default CreatorView

