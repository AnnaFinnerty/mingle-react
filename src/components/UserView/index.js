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
            messageOpen: false,
            messageText: '',
            modalOpen: true,
            modalType: 'newPlaylist',
            userId: props.authUser ? props.authUser : null,
            showSongLabels: false,
            reduceApiCalls: props.reduceApiCalls
        }
    }
    componentDidMount(){
        //load auth user or user idea from params
        
    }
    openMessage = (messageText) => {
        this.setState({
            messageOpen: true,
            messageText: messageText
        })
    }
    closeMessage = () => {
        this.setState({
            messageOpen: false,
            messageText: ''
        })
    }
    render(){
        console.log('user view props', this.props);
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
                <Message 
                    open={this.state.messageOpen}
                    text={this.state.messageText}
                    closeMessage={this.closeMessage}
                />
            </React.Fragment>
        )
    }
    
}

export default UserView