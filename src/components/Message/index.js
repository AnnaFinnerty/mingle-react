import React from 'react';

import { Modal, Grid, Button, Label } from 'semantic-ui-react';

const Message = (props) => (
    <Modal open={props.open} style={messageStyle}>
        <Grid columns={1} centered>
            <Grid.Row >
                <Button onClick={props.closeMessage}>X</Button>
            </Grid.Row>
            <Grid.Row>
                <Label style={{marginBottom:"3vh"}}>{props.text}</Label>
                </Grid.Row>
        </Grid>
    </Modal>
)

const messageStyle = {
    width: "auto",
}

export default Message