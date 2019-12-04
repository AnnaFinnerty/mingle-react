import React from 'react';

import ActivePlaylist from '../ActivePlaylist';

import { Grid, Button } from 'semantic-ui-react';

const UserView = (props) => (
   
        <React.Fragment>
            <Grid columns={2} divided>
                <Grid.Column>
                    <Button onClick={props.toggleViewMode}>Creator View</Button>
                    <ActivePlaylist/>
                </Grid.Column>
                <Grid.Column>
                    
                </Grid.Column>
            </Grid>
        </React.Fragment>
    
)

export default UserView