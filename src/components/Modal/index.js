import React, {Component} from 'react';

import NewSong from '../NewSong';
import AddPlaylist from '../AddPlaylist';
import EditPlaylist from '../EditPlaylist';
import SignInTemp from '../SignInTemp';

class ModalWindow extends Component{
    getModalContent = () => {
        switch(this.props.modalType){

            case 'newTempProfile':
                return <SignInTemp userProps={this.props.userProps} callback={this.props.callback}/>

            case 'newPlaylist':
                return <AddPlaylist userProps={this.props.userProps} callback={this.props.callback}/>

            case 'editPlaylist':
                return <EditPlaylist userProps={this.props.userProps} callback={this.props.callback}/>

            case 'newSong':
                return <NewSong userProps={this.props.userProps} callback={this.props.callback}/>

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
            </React.Fragment>
        )
    }
}

export default ModalWindow