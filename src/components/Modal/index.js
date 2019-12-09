import React, {Component} from 'react';

import NewSong from '../NewSong';
import EditSong from '../EditSong';
import AddPlaylist from '../AddPlaylist';
import EditPlaylist from '../EditPlaylist';
import SignInTemp from '../SignInTemp';

class ModalWindow extends Component{
    getModalContent = () => {
        console.log('getting modal content', this.props);
        switch(this.props.userProps.modalType){

            case 'newTempProfile':
                return <SignInTemp userProps={this.props.userProps}/>

            case 'newPlaylist':
                return <AddPlaylist userProps={this.props.userProps}/>

            case 'editPlaylist':
                return <EditPlaylist userProps={this.props.userProps}/>

            case 'newSong':
                return <NewSong userProps={this.props.userProps}/>

            case 'editSong':
                return <EditSong userProps={this.props.userProps}/>

            default:
                return <div>MODAL DID NOT LOAD</div> 
        }
    }
    render(){
        console.log('modal props', this.props);
        const content = this.getModalContent();
        return(
            <React.Fragment>
                {content}
            </React.Fragment>
        )
    }
}

export default ModalWindow