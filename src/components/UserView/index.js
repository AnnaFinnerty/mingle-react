import React, {Component} from 'react';

import ActivePlaylist from '../ActivePlaylist';
import ModalWindow from '../Modal';
import Message from '../Message';

import { Modal, Grid, Button, Label, Input } from 'semantic-ui-react';

class UserView extends Component{
    constructor(props){
        super();
        this.state = {
            players: 0,
            inviteCode: '',
            modalOpen: true,
            modalType: 'newPlaylist',
            userId: props.userId,
            showSongLabels: false,
            reduceApiCalls: props.reduceApiCalls
        }
    }
    render(){
        return(
            <React.Fragment>
                <Grid columns={1} divided>
                    <Grid.Column>
                        <Button onClick={this.props.toggleViewMode}>Go to Creator View</Button>
                        <ActivePlaylist 
                                        userId={this.props.userId} 
                                        playlistId={this.state.playlistId} 
                                        history={this.props.history} 
                                        match={this.props.match} 
                                        location={this.props.location} 
                                        reduceApiCalls={this.props.reduceApiCalls}
                                        />
                    </Grid.Column>
                </Grid>
                <Modal open={this.state.modalOpen}>
                            <Button onClick={this.closeModal}>X</Button>
                            <ModalWindow closeModal={this.closeModal} modalType={this.state.modalType} userProps={this.state}/>
                </Modal>
            </React.Fragment>
        )
    }
    
}

export default UserView