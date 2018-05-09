import React, { Component } from 'react';
import './App.css';
import Table from './Components/Table';
import Header from './Components/Header';
import $ from 'jquery';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faStop from '@fortawesome/fontawesome-free-solid/faStop';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faPause from '@fortawesome/fontawesome-free-solid/faPause';
import faPlayCircle from '@fortawesome/fontawesome-free-solid/faPlayCircle';

class App extends Component {
    loader          = false; // boolean value whether to show loader or not
    seconds         = 0; // store seconds tracked by timer
    time_tracked    = '00:00:00'; // time tracked displayed on time format, variable to show real time the timer
    is_started      = false; // true if timer has started
    is_running      = false; // true if timer is running
    is_paused       = false; // true if timer is paused
    is_stopped      = false; // true if timer is stopped
    intervalID; // variable to store setInterval function
    date_finished; // date finished of the task

    time_hours      = 0; // time on hours when logging time without timer
    time_logged     = '00:00:00'; // time format to show on modal when logging time
    description     = ''; // description of time logged
    free_time_log   = false; // true if user is loggin time without timer

    settings = { // datetimepicker options
        bigBanner: true,
        timePicker: true,
        format: 'yyyy-MM-dd HH:mm',
        defaultOpen: false
    };

    constructor(props) {
        super(props);

        this.seconds = 0;
        this.time_tracked = '00:00:00';
        this.state = {
            time_tracked: '00:00:00',
            seconds: 0,
            is_started:false,
            is_paused:false
        };
        this.startTimer = this.startTimer.bind(this);
        this.initInterval = this.initInterval.bind(this);
        this.countDown = this.countDown.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds + 1;
        this.setState({
            time_tracked: this.makeTimeReadable(seconds),
            seconds: seconds,
        });
    }

    /**
     * function to format seconds on time format 'HH:ii:ss'
     *
     * @param seconds, integer ex. 34
     * @returns {string}, format 'HH:ii:ss'
     */
    makeTimeReadable(seconds_input){
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
    }

    /**
     * function to set interval for measuring seconds
     *
     * @returns {NodeJS.Timer}
     */
    initInterval(){
        return setInterval(this.countDown, 1000);
    }

    /**
     * function to start timer
     */
    startTimer(){
        this.setState({
            is_started: true,
            is_running: true
        })
        this.intervalID = this.initInterval();
    }

    /**
     * function to pause timer
     */
    pauseTimer(){
        if(this.state.is_paused === false){
            this.setState({
                is_paused: true,
                is_running: false
            });
            clearInterval(this.intervalID);
        }
    }

    /**
     * function to stop timer
     */
    stopTimer(){
        if(this.is_stopped === false){
            this.is_stopped = true;
            clearInterval(this.intervalID);
            this.logTrackedTime();
        }
    }

    /**
     * function to log time, post data to server for storing time logged
     */
    saveTime(){
        // this.loader = true;
        // let seconds = this.free_time_log === true ? Math.round(this.time_hours * 3600) : this.seconds;
        // this._timeService.logTime(
        //     {
        //         seconds                 :   seconds,
        //         date_finished           :   this._timeService.formatDate(this.date_finished),
        //         time_tracked_formatted  :   this._timeService.formatTime(seconds),
        //         description             :   this.description
        //     }
        // ).then(response => {
        //     this.loader = false;
        //     if(response.success){
        //         this.resetTimer();
        //         document.getElementById('close').click();
        //         this.toasterService.pop('success', 'Success', response.msg);
        //         this.table_component.initTable();
        //     }else{
        //         console.log(response);
        //     }
        // });
    }

    /**
     * function to reset timer and all related properties
     */
    resetTimer(){
        this.is_paused = false;
        this.is_running = false;
        this.is_started = false;
        this.is_stopped = false;
        this.seconds = 0;
        this.time_tracked = '00:00:00';
    }

    /**
     * function to open modal for logging tracked time
     */
    logTrackedTime(){
        this.date_finished = new Date(); // set date finished to now
        this.free_time_log = false;
        this.description = '';
        document.getElementById('openModalButton').click();
        this.time_logged = this.time_tracked;
    }

    /**
     * function to resume timer if paused
     */
    resumeTimer(){
        if(this.state.is_paused === true){
            this.setState({
                is_paused: false,
                is_running: true
            });
            this.intervalID = this.initInterval();
        }
    }

    /**
     * function to format seconds on time format 'HH:ii:ss'
     *
     * @param seconds, integer ex. 34
     * @returns {string}, format 'HH:ii:ss'
     */
    formatTime(seconds_input){
        // return this._timeService.formatTime(seconds_input);
    }

    /**
     * function to generate actual date and time 'yyyy-mm-dd hh:ii'
     *
     * @returns {string}
     */
    formatDate(date_input){
        // return this._timeService.formatDate(date_input);
    }

    getTimes(){
        $.ajax({
            url : 'http://localhost:8000/time/get_time',
            dataType : 'json',
            cache:false,
            success: function(data){
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    }


    render() {
        this.getTimes();
        return (
            <div className="App">
                <Header />



                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-md-12'}>
                            <Button className={'btn btn-primary'} onClick={this.logFreeTime}>
                                Log free time
                            </Button>
                        </div>
                        <div className={'col-md-12 center'}>
                              <span>
                                { this.state.time_tracked }
                              </span>
                            <div>
                                {this.is_stopped == false ?
                                <Button className={'btn btn-default'} onClick={this.state.is_started == false ? this.startTimer : (this.state.is_paused == true ? this.resumeTimer : this.pauseTimer)}>
                                    <FontAwesomeIcon icon={this.state.is_started === false ? faPlay : (this.state.is_paused == true ? faPlayCircle : faPause)} />
                                </Button>
                                : null}
                                {this.state.is_started === true ?
                                <Button className={'btn btn-'+ (this.is_stopped === true ? 'primary' : 'default') } onClick={this.is_stopped == true ? this.logTrackedTime : this.stopTimer}>
                                    {this.is_stopped == false ? <FontAwesomeIcon className={'red'} icon={faStop} /> : null}
                                    { this.is_stopped == true ? 'Log Time' : ''}
                                </Button>
                                : null}
                                {this.is_stopped == true ?
                                <Button className={'btn btn-default'} onClick={this.resetTimer}>
                                    Reset
                                </Button>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>



                <Table />
            </div>
        );
    }
}

export default App;