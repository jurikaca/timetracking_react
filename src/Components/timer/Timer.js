import React, { Component } from 'react';
import './Timer.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faStop from '@fortawesome/fontawesome-free-solid/faStop';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faPause from '@fortawesome/fontawesome-free-solid/faPause';
import faPlayCircle from '@fortawesome/fontawesome-free-solid/faPlayCircle';
import $ from 'jquery';

class Timer extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            time_tracked: '00:00:00', // time tracked displayed on time format, variable to show real time the timer
            seconds: 0, // store seconds tracked by timer
            is_started:false, // true if timer has started
            is_paused:false, // true if timer is paused
            is_stopped:false, // true if timer is stopped
            is_running:false // true if timer is running
        };
    }

    /**
     * function to format seconds on time format 'HH:ii:ss'
     *
     * @param seconds, integer ex. 34
     * @returns {string}, format 'HH:ii:ss'
     */
    makeTimeReadable = (seconds_input) => {
        let hours   = Math.floor(seconds_input / 3600);
        let minutes = Math.floor((seconds_input - (hours * 3600)) / 60);
        let seconds = seconds_input - (hours * 3600) - (minutes * 60);
        let time_tracked = '';

        if (hours < 10) {
            time_tracked += "0"+hours.toFixed(0)+":";
        }else{
            time_tracked += hours.toFixed(0)+":";
        }
        if (minutes < 10) {
            time_tracked += "0"+minutes.toFixed(0)+":";
        }else{
            time_tracked += minutes.toFixed(0)+":";
        }
        if (seconds < 10) {
            time_tracked += "0"+seconds.toFixed(0);
        }else{
            time_tracked += seconds.toFixed(0);
        }
        return time_tracked;
    };

    /**
     * function to set interval for measuring seconds
     *
     * @returns {NodeJS.Timer}
     */
    initInterval = () => {
        return setInterval(this.countDown, 1000);
    };

    /**
     * function to start timer
     */
    startTimer = () => {
        this.setState({
            is_started: true,
            is_running: true
        });
        this.intervalID = this.initInterval();
    };

    /**
     * function to pause timer
     */
    pauseTimer = () => {
        if(this.state.is_paused === false){
            this.setState({
                is_paused: true,
                is_running: false
            });
            clearInterval(this.intervalID);
        }
    };

    /**
     * function to resume timer if paused
     */
    resumeTimer = () => {
        if(this.state.is_paused === true){
            this.setState({
                is_paused: false,
                is_running: true
            });
            this.intervalID = this.initInterval();
        }
    };

    /**
     * function to reset timer and all related properties
     */
    resetTimer = () => {
        this.setState({
            is_paused: false,
            is_running: false,
            is_started: false,
            is_stopped: false,
            seconds: 0,
            time_tracked: '00:00:00',
        });
    };

    /**
     * function to stop timer
     */
    stopTimer = () => {
        if(this.state.is_stopped === false){
            this.setState({
                is_stopped: true
            });
            clearInterval(this.intervalID);
            this.logTrackedTime();
        }
    };

    /**
     * function to open modal for logging tracked time
     */
    logTrackedTime = () => {
        this.setState({
            date_finished : new Date(), // set date finished to now
            free_time_log : false,
            description : '',
            time_logged : this.state.time_tracked
        });
        this.props.setSeconds(this.state.seconds);
        this.props.setDateFinished(new Date());
        this.props.setFreeTimeLog(false);
        this.props.setTimeLogged(this.state.time_tracked);
        $('#openModalButton').click();
    };

    countDown = () => {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds + 1;
        this.setState({
            time_tracked: this.makeTimeReadable(seconds),
            seconds: seconds,
        });
    };

    logFreeTime = () => {
        this.setState({
            date_finished : new Date(), // set date finished to now
            time_hours : 0,
            free_time_log : true,
            time_logged : '00:00:00',
            description : ''
        });
        this.props.setFreeTimeLog(true);
        this.props.setTimeLogged('00:00:00');
        $('#openModalButton').click()
    };

    render() {
        return (
            <div className="Timer">
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-md-12'}>
                            <button className={'btn btn-primary'} onClick={() => {this.logFreeTime()}}>
                                Log free time
                            </button>
                        </div>
                        <div className={'col-md-12 center'}>
                              <span>
                                { this.state.time_tracked }
                              </span>
                            <div>
                                {this.state.is_stopped === false ?
                                    <button className={'btn btn-default margin-left'} onClick={() => {this.state.is_started === false ? this.startTimer() : (this.state.is_paused === true ? this.resumeTimer() : this.pauseTimer())}}>
                                        <FontAwesomeIcon icon={this.state.is_started === false ? faPlay : (this.state.is_paused === true ? faPlayCircle : faPause)} />
                                    </button>
                                    : null}
                                {this.state.is_started === true ?
                                    <button className={'btn margin-left btn-'+ (this.state.is_stopped === true ? 'primary' : 'default') } onClick={() => {this.state.is_stopped === true ? this.logTrackedTime() : this.stopTimer()}}>
                                        {this.state.is_stopped === false ? <FontAwesomeIcon className={'red'} icon={faStop} /> : null}
                                        { this.state.is_stopped === true ? 'Log Time' : ''}
                                    </button>
                                    : null}
                                {this.state.is_stopped === true ?
                                    <button className={'btn btn-default margin-left'} onClick={() => {this.resetTimer()}}>
                                        Reset
                                    </button>
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Timer;
