import React from 'react';
import { Form, Grid, Button, Label, Input } from 'semantic-ui-react'

const List = (props) => {
    return(
        <div>
            {
                !props.playlists.length ?
                <Label>no playlists</Label> :
                this.state.playlists.map((playlist)=>{
                  console.log(playlist);
                  return(
                    <div>playlist</div>
                  )
                })
            }
        </div>
    )
};


export default List;