import React from 'react';

import ActivePlaylist from '../ActivePlaylist';

import { Grid, Button, Label, Input } from 'semantic-ui-react';

const UserView = (props) => (
   
        <React.Fragment>
            <Grid columns={2} divided>
                <Grid.Column>
                    <Button onClick={props.toggleViewMode}>Creator View</Button>
                    <Label>Invite</Label>
                    <Input></Input>
                    <Label>Contributors</Label>
                </Grid.Column>
                <Grid.Column>
                    <ActivePlaylist/>
                </Grid.Column>
            </Grid>
        </React.Fragment>
    
)

export default UserView