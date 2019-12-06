import React, {Component} from 'react';

import ActivePlaylist from '../ActivePlaylist';

import { Grid, Button, Label, TextArea } from 'semantic-ui-react';

class CreatorView extends Component{
    constructor(){
        super()
        this.state = {
            invites: 0,
            players: 0,
            inviteCode: ''
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
        var copyText = document.getElementById("invite-code");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        // /* Alert the copied text */
        // alert("Copied the text: " + copyText.value);

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

