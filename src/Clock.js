import React, { Fragment, Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RefreshIcon from '@material-ui/icons/Refresh';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const TIME = 100;

const initialState = {
    init: true,
    running: false,
    pause: false,
    breakLength: 5,
    sessionLength: 25,
    timer: 1500,
    breakTimer: 300,
    minutes: 25,
    seconds: 0,
    session: true,
    break: false,
}

let intervalHandle = '';
let breakIntervalHandle = '';

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.tick = this.tick.bind(this)
        this.startCountDown = this.startCountDown.bind(this)
        this.break = this.break.bind(this)
        this.audio = null;

    }

    secondsRemaining;
    breakSecondsRemaining;

    componentDidMount() {
        this.audio = document.getElementById('beep');
    }


    clock = () => {
        if (this.state.session) {
            // let minutes = Math.floor(this.state.timer / 60);
            // let seconds = this.state.timer - minutes * 60;
            let seconds = this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds;
            let minutes = this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes;
            return minutes + ':' + seconds;
        } else {
            // let minutes = Math.floor(this.state.breakTimer / 60);
            // let seconds = this.state.breakTimer - minutes * 60;
            let seconds = this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds;
            let minutes = this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes;
            return minutes + ':' + seconds;
        }
    }

    /*      shouldComponentUpdate(nextProps, nextState) {
            if (!this.state.pause && this.state.running) {
                if (this.state.session) {
                    return this.state.timer !== nextState.timer;
                } else {
                    return this.state.breakTimer !== nextState.breakTimer;
                }
            } else {
                return true;
            }
        }  */

    breakInc = () => {
        if (this.state.breakLength < 60 && !this.state.running) {
            this.setState(state => ({ ...state, breakLength: state.breakLength + 1 }), () => {
                this.breakSecondsRemaining = this.state.breakLength * 60;
                this.secondsRemaining = this.state.sessionLength * 60;
                this.setState(state => ({ ...state, breakTimer: this.breakSecondsRemaining }))
            })
        }
    }
    breakDec = () => {
        if (this.state.breakLength > 1 && !this.state.running) {
            this.setState(state => ({ ...state, breakLength: state.breakLength - 1 }), () => {
                this.breakSecondsRemaining = this.state.breakLength * 60;
                this.secondsRemaining = this.state.sessionLength * 60;
                this.setState(state => ({ ...state, breakTimer: this.breakSecondsRemaining }))
            })
        }
    }

    sessionInc = () => {
        if (this.state.sessionLength < 60 && !this.state.running) {
            this.setState(state => ({ ...state, sessionLength: state.sessionLength + 1 }), () => {
                this.breakSecondsRemaining = this.state.breakLength * 60;
                this.secondsRemaining = this.state.sessionLength * 60;
                var min = Math.floor(this.secondsRemaining / 60);
                var sec = this.secondsRemaining - (min * 60);
                this.setState(state => ({ ...state, minutes: min, seconds: sec, timer: this.secondsRemaining }))
            })
        }
    }
    sessionDec = () => {
        if (this.state.sessionLength > 1 && !this.state.running) {
            this.setState(state => ({ ...state, sessionLength: state.sessionLength - 1 }), () => {
                this.breakSecondsRemaining = this.state.breakLength * 60;
                this.secondsRemaining = this.state.sessionLength * 60;
                var min = Math.floor(this.secondsRemaining / 60);
                var sec = this.secondsRemaining - (min * 60);
                this.setState(state => ({ ...state, minutes: min, seconds: sec, timer: this.secondsRemaining }))
            })
        }
    }

    tick() {
        var min = Math.floor(this.secondsRemaining / 60);
        var sec = this.secondsRemaining - (min * 60);
        this.secondsRemaining--
        this.setState(state => ({
            ...state,
            minutes: min,
            seconds: sec,
            timer: this.secondsRemaining,
            session: true,
            break: false
        }), () => {
            if (min === 0 & sec === 0) {
                this.audio.play();
                clearInterval(intervalHandle);
                this.breakSecondsRemaining = this.state.breakLength * 60;
                breakIntervalHandle = setInterval(this.break, TIME);
            }
        })
        console.log('Session' + this.clock() + this.state.session)
    }

    break() {
        var min = Math.floor(this.breakSecondsRemaining / 60);
        var sec = this.breakSecondsRemaining - (min * 60);
        this.breakSecondsRemaining--
        this.setState(state => ({
            ...state,
            minutes: min,
            seconds: sec,
            breakTimer: this.breakSecondsRemaining,
            session: false,
            break: true
        }), () => {
            if (min === 0 & sec === 0) {
                this.audio.play()
                clearInterval(breakIntervalHandle);
                this.secondsRemaining = this.state.sessionLength * 60;
                intervalHandle = setInterval(this.tick, TIME);
            }
            console.log('Break' + this.clock() + this.state.break)
        })
    }

    startCountDown() {
        console.log('PLAY')
        console.log(this.state)
        if (this.state.running) {
            console.log('PAUSE')
            console.log(this.clock())
            clearInterval(intervalHandle);
            clearInterval(breakIntervalHandle);
            this.setState(state => ({ ...state, running: false, pause: true }))
        } else {
            if (this.state.init) {
                console.log('START SESSION')
                this.setState(state => ({ ...state, running: true, session: true, break: false, init: false }), () => {
                    this.secondsRemaining = (this.state.sessionLength * 60);
                    intervalHandle = setInterval(this.tick, TIME);
                })
            } else {
                if (this.state.session && this.state.pause) {
                    console.log('RESUME SESSION')
                    console.log(this.clock())
                    this.setState(state => ({ ...state, running: true, pause: false }), () => {
                        intervalHandle = setInterval(this.tick, TIME);
                    })
                }
                if (this.state.break && this.state.pause) {
                    console.log('RESUME BREAK')
                    console.log(this.clock())
                    this.setState(state => ({ ...state, running: true, pause: false }), () => {
                        breakIntervalHandle = setInterval(this.break, TIME);
                    })
                }
            }
        }
    }
    /*     startCountDown() {
            console.log('PLAY')
            console.log(this.state)
            if (this.state.running) {
                console.log('PAUSE')
                console.log(this.clock())
                clearInterval(intervalHandle);
                clearInterval(breakIntervalHandle);
                this.setState(state => ({ ...state, running: false, pause: true }))
            } else {
                if (this.state.init) {
                    console.log('START SESSION')
                    this.setState(state => ({ ...state, running: true, session: true, break: false, init: false }), () => {
                        this.secondsRemaining = (this.state.sessionLength * 60) - 1;
                        intervalHandle = setInterval(this.tick, TIME);
                    })
                } else {
                    if (this.state.session && this.state.pause) {
                        console.log('RESUME SESSION')
                        console.log(this.clock())
                        this.setState(state => ({ ...state, running: true, pause: false }), () => {
                            intervalHandle = setInterval(this.tick, TIME);
                        })
                    }
                    if (this.state.break && this.state.pause) {
                        console.log('RESUME BREAK')
                        console.log(this.clock())
                        this.setState(state => ({ ...state, running: true, pause: false }), () => {
                            breakIntervalHandle = setInterval(this.break, TIME);
                        })
                    }
                }
            }
        } */


    reset = () => {
        this.setState(() => ({ ...initialState, init: true }), () => {
            clearInterval(intervalHandle);
            clearInterval(breakIntervalHandle);
            console.log('RESET')
        });
        this.audio.pause();
        this.audio.currentTime = 0;
    }


    render() {
        return (
            <Fragment>
                <Card >
                    <div>
                        <CardContent >
                            <Typography className="font-weight-bold" component="h5" variant="h5">
                                POMODORO CLOCK
                            </Typography>

                            <Typography variant="subtitle1" color="textSecondary">
                                <div id="timer-label">
                                    {this.state.session ? 'Session' : 'Break'}

                                </div>
                                <div id="time-left" className="">{this.clock()}</div>
                            </Typography>
                        </CardContent>

                        <div >
                            <IconButton aria-label="previous">
                                <PauseIcon />
                            </IconButton>
                            <IconButton id="start_stop" onClick={this.startCountDown} aria-label="play/pause">
                                <PlayArrowIcon />
                            </IconButton>
                            <IconButton id="reset" onClick={this.reset} aria-label="next">
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </div>
                </Card>
                <div className="w-50 m-auto">
                    <div id="break-label" className="d-flex justify-content-between">
                        <IconButton onClick={this.breakInc} id="break-increment"><ExpandLessIcon /></IconButton>
                        Break Length
                        <IconButton onClick={this.breakDec} id="break-decrement"><ExpandMoreIcon /></IconButton>
                    </div>
                    <div id="break-length" className=" font-weight-bold h6">
                        {this.state.breakLength}
                    </div>
                    <div id="session-label" className="d-flex justify-content-between">
                        <IconButton onClick={this.sessionInc} id="session-increment"><ExpandLessIcon /></IconButton>
                        Session Length
                        <IconButton onClick={this.sessionDec} id="session-decrement"><ExpandMoreIcon /></IconButton>
                    </div>
                    <div id="session-length" className="font-weight-bold h6">
                        {this.state.sessionLength}
                    </div>
                </div>
                <audio id="beep"> <source src="http://soundbible.com/grab.php?id=2210&type=mp3" type="audio/ogg" /> </audio>
            </Fragment>
        );
    }
}


export default Clock;