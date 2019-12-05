import React from 'react';

import ActivePlaylist from '../ActivePlaylist';

import { Grid, Button } from 'semantic-ui-react';

const CreatorView = (props) => (
   
    <React.Fragment>
        <Grid columns={1} divided>
            <Grid.Column>
                <Button onClick={props.toggleViewMode}>Go to User View</Button>
                <Button onClick={props.addPlaylist}>start a new playlist</Button>
                <ActivePlaylist/>
            </Grid.Column>
        </Grid>
    </React.Fragment>
    
)

export default CreatorView

