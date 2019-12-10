import React, {Component} from 'react';

import { Grid, Radio, Label } from 'semantic-ui-react';

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
    onChange = (e) => {
        console.log(e.target.name);
        console.log(e.target.value);
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        return(
            <Grid columns={3} centered divided>
                <Grid.Column></Grid.Column>
                <Grid.Column>
                    <Grid.Row>
                        <Label>Speed Through Mode</Label>
                        <Radio toggle checked={this.state.speedThrough} name="speedThrough" onChange={(e) => this.onChange(e)}/>

                        {/* {
                            this.state.speedThrough ? 
                            <Radio toggle checked value={this.state.speedThrough} name="speedThrough" onChange={(e) => this.onChange(e)}/>
                            :
                            <Radio toggle name="speedThrough" value={this.state.speedThrough} onChange={(e) => this.onChange(e)}/>
                        } */}
                    </Grid.Row>
                    <Grid.Row>
                        <Label>Remove Sownvoted Songs</Label>
                        {
                            this.state.endSongOnVoteEnd ? 
                            <Radio toggle checked value={this.state.endSongOnVoteEnd} name="endSongOnVoteEnd" onChange={(e) => this.onChange(e)}/>
                            :
                            <Radio toggle value={this.state.endSongOnVoteEnd} name="endSongOnVoteEnd" onChange={(e) => this.onChange(e)}/>
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Label>Sudden Death</Label>
                        {
                            this.state.suddenDeath ? 
                            <Radio toggle checked value={this.state.suddenDeath} name="suddenDeath" onChange={(e) => this.onChange(e)}/>
                            :
                            <Radio toggle value={this.state.suddenDeath} name="suddenDeath" onChange={(e) => this.onChange(e)}/>                        
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Label>Second Chance</Label>
                        {
                            this.state.secondChance ? 
                            <Radio toggle checked value={this.state.secondChance} name="secondChance" onChange={(e) => this.onChange(e)}/>
                            :
                            <Radio toggle value={this.state.secondChance} name="secondChance" onChange={(e) => this.onChange(e)}/>                        
                        }
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column></Grid.Column>
            </Grid>
        )
    }
}

export default Options