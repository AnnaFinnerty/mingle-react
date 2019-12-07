import React from 'react';

import ActivePlaylist from '../ActivePlaylist';

import { Grid, Button, Label, Input } from 'semantic-ui-react';

const UserView = (props) => (
   
        <React.Fragment>
        <Grid columns={1} divided>
            <Grid.Column>
                <Button onClick={props.toggleViewMode}>Go to Creator View</Button>
                <ActivePlaylist authUser={props.authUser}/>
            </Grid.Column>
        </Grid>
        </React.Fragment>
    
)

export default UserView