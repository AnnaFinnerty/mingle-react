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
    render(){
        console.log('creatorView props', this.props)
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
                        <ActivePlaylist authUser={this.props.userId} history={this.props.history} match={this.props.match} location={this.props.location} />
                    </Grid.Column>
                </Grid>
            </React.Fragment>
            
        )
    }
} 

export default CreatorView

