import React, {Component} from 'react';

import ActivePlaylist from '../ActivePlaylist';

import { Grid, Button, Label } from 'semantic-ui-react';

class CreatorView extends Component{
    constructor(){
        super()
        this.state = {
            invites: 0,
            players: 0,
            inviteCode: ''
        }
    }
    genInviteCode(){

    }
    render(){
        return(
   
            <React.Fragment>
                <Grid columns={2} divided>
                    <Grid.Column>
                        <Button onClick={this.props.toggleViewMode}>Go to User View</Button>
                        <Button>Generate Share link</Button>
                        {
                            !this.state.inviteCode ? "" :
                            <Label>{this.state.inviteCode}</Label>
                        }
                        <Button onClick={this.props.addPlaylist}>start a new playlist</Button>
                        <Button onClick={this.props.addPlaylist}>delete playlist</Button>
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

