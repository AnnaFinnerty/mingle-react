import React, {Component} from 'react';

import NewSong from '../NewSong';

import { Modal, Grid, Label, Feed, Button, Header } from 'semantic-ui-react';

class ModalWindow extends Component{
    getModalContent = () => {
        switch(this.props.modalType){

            case 'newSong':
                return <NewSong />

            default:
                return <div>MODAL WORkING</div> 
        }
    }
    render(){
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