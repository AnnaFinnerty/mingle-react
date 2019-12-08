import React, {Component} from 'react';

import ActivePlaylist from '../ActivePlaylist';
import ModalWindow from '../Modal';

import { Modal, Grid, Button, Label, Input } from 'semantic-ui-react';

const UserView = (props) => (
   
        <React.Fragment>
            <Grid columns={1} divided>
                <Grid.Column>
                    <Button onClick={props.toggleViewMode}>Go to Creator View</Button>
                    <ActivePlaylist authUser={props.authUser}/>
                </Grid.Column>
            </Grid>
            <Modal open={this.state.modalOpen}>
                        <Button onClick={this.closeModal}>X</Button>
                        <ModalWindow closeModal={this.closeModal} modalType={this.state.modalType} userProps={this.state}/>
            </Modal>
        </React.Fragment>
    
)

export default UserView