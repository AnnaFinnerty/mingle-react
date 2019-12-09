import React, {Component} from 'react';
import { withRouter, useParams } from 'react-router-dom';
import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';

import ActivePlaylist from '../ActivePlaylist';
import ModalWindow from '../Modal';
import Message from '../Message';

import { Modal, Grid, Button, Label, Input } from 'semantic-ui-react';

const UserViewPage = (props) => {
    //console.log('active playlist wrapper props', props);
    return(
      <div>
      <FirebaseContext.Consumer>
        {(firebase) => <UserViewBase {...props} firebase={firebase} />}
      </FirebaseContext.Consumer>
    </div>
    )
  };

class UserViewBase extends Component{
    constructor(props){
        super();
        this.state = {
            players: 0,
            inviteCode: '',
            messageOpen: false,
            messageText: '',
            modalOpen: false,
            modalType: 'newSong',
            userId: props.authUser ? props.authUser : null,
            userSong: props.userSong,
            showSongLabels: false,
            reduceApiCalls: props.reduceApiCalls
        }
    }
    componentDidMount(){
        //load auth user or user idea from params
        
    }
    getPlaylist = (playlistId) => {
        console.log('getting playlist: ' + playlistId );
        const itemRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
        const self = this;
        let query = itemRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
            console.log('No matching documents.');
            return;
            }  
            console.log('get snapshot', snapshot.data())
            this.setState({
                activePlaylist: snapshot.data(),
            })
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
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
    closeModal = () => {
        this.setState({modalOpen: false})
      }
    openMessage = (messageText) => {
        this.setState({
            messageOpen: true,
            messageText: messageText
        })
    }
    render(){
        console.log('user view props', this.props);
        return(
            <React.Fragment>
                <Grid columns={1} divided>
                    <Grid.Column>
                        <Grid.Row>
                        {
                            this.props.userSong ? "" :
                            <Button color="red"
                                    onClick={()=>this.openModal('newSong')}
                            >
                                add your song<br></br>
                                we can't start without you
                            </Button>
                        }
                        </Grid.Row>
                        <Grid.Row>
                            <ActivePlaylist userId={this.state.userId}
                                            authUser={false}
                                            playlistId={this.state.playlistId}
                                            openModal={this.openModal} 
                                            history={this.props.history} 
                                            match={this.props.match} 
                                            location={this.props.location} 
                                            reduceApiCalls={this.props.reduceApiCalls}
                                            />
                        </Grid.Row>
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

const UserView = withRouter(UserViewBase)
export default UserViewPage;
export {UserView};