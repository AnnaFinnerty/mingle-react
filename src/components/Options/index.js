import React, {Component} from 'react';

import { Grid, Radio, Label, Button } from 'semantic-ui-react';

class Options extends Component{
    constructor(){
        super()
        this.state ={
            speedThrough: true,
            endSongOnVoteEnd: false,
            suddenDeath: false,
            secondChance: true,
            voteDelay: false,
            voteDelayLength: 30,
        }
    }
    onChange = (e, data) => {
        console.log(e);
        console.log(data)
        this.setState({
            [data.name] : data.checked
        })
    }
    render(){
        console.log('options state', this.state);
        return(
            <Grid columns={3} centered divided>
                <Grid.Column></Grid.Column>
                <Grid.Column>
                    <Grid.Row>
                        <Label>Speed Through Mode</Label>
                        {
                            this.state.speedThrough ? 
                            <Radio toggle checked name="speedThrough" onChange={this.onChange}/>
                            :
                            <Radio toggle name="speedThrough" onChange={this.onChange}/>
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Label>Remove Sownvoted Songs</Label>
                        {
                            this.state.endSongOnVoteEnd ? 
                            <Radio toggle checked name="endSongOnVoteEnd" onChange={this.onChange}/>
                            :
                            <Radio toggle name="endSongOnVoteEnd" onChange={this.onChange}/>
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Label>Sudden Death</Label>
                        {
                            this.state.suddenDeath ? 
                            <Radio toggle checked name="suddenDeath" onChange={this.onChange}/>
                            :
                            <Radio toggle name="suddenDeath" onChange={this.onChange}/>                        
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Label>Second Chance</Label>
                        {
                            this.state.secondChance ? 
                            <Radio toggle checked name="secondChance" onChange={this.onChange}/>
                            :
                            <Radio toggle name="secondChance" onChange={this.onChange}/>                        
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Button onClick={()=>this.props.updateSettings(this.state)}>
                            update
                        </Button>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column></Grid.Column>
            </Grid>
        )
    }
}

export default Options