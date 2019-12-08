import React, {Component} from 'react';

import NewSong from '../NewSong';
import AddPlaylist from '../AddPlaylist';
import EditPlaylist from '../EditPlaylist';

import { Modal, Grid, Label, Feed, Button, Header } from 'semantic-ui-react';

class ModalWindow extends Component{
    getModalContent = () => {
        switch(this.props.modalType){

            case 'newPlaylist':
                return <AddPlaylist userProps={this.props.userProps}/>

            case 'editPlaylist':
                return <EditPlaylist userProps={this.props.userProps}/>

            case 'newSong':
                return <NewSong userProps={this.props.userProps}/>

            default:
                return <div>MODAL WORkING</div> 
        }
    }
    render(){
        console.log('modal props', this.props);
        const content = this.getModalContent();
        return(
            <React.Fragment>
                {content}
                {/* <Modal.Header>Select a Photo</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>
                        We've found the following gravatar image associated with your e-mail
                        address.
                    </p>
                    <p>Is it okay to use this photo?</p>
                    </Modal.Description>
                </Modal.Content> */}
            </React.Fragment>
        )
    }
}

export default ModalWindow