import React, { Component } from 'react';
import './App.css';
import Modal from './Components/modal/Modal';
import Table from './Components/table/Table';
import Timer from './Components/timer/Timer';
import Header from './Components/header/Header';
import Service from './Services/Service';

class App extends Component {

    constructor(props) {
        super(props);
        this.service = new Service();
        this.state = {
            seconds: 0,
            free_time_log: false,
            time_logged: '00:00:00',
            date_finished: this.service.formatDate(new Date())
        };
    }

    /**
     * function to change time_logged property
     *
     * @param time_logged
     */
    setTimeLogged = (time_logged) => {
        this.setState({
            time_logged: time_logged
        });
    };


    /**
     * function to change free_time_log property
     *
     * @param free_time_log
     */
    setFreeTimeLog = (free_time_log) => {
        this.setState({
            free_time_log: free_time_log
        });
    };

    /**
     * function to access initTable() from Table component
     */
    reInitTable = () => {
        this.refs.table.initTable();
    };

    /**
     * function to access resetTimer method from Timer component
     */
    resetTimer = () => {
        this.refs.timer.resetTimer();
    };

    /**
     * function to set date_finished property
     * @param date_finished
     */
    setDateFinished = (date_finished) => {
        this.setState({
            date_finished: this.service.formatDate(date_finished)
        });
    };

    /**
     * function to set seconds property
     * @param seconds
     */
    setSeconds = (seconds) => {
        this.setState({
            seconds: seconds
        });
    };

    render() {
        return (
            <div className="App">
                <Header />
                <Timer
                    ref='timer'
                    free_time_log={this.state.free_time_log}
                    setSeconds={this.setSeconds.bind(this)}
                    setTimeLogged={this.setTimeLogged.bind(this)}
                    setFreeTimeLog={this.setFreeTimeLog.bind(this)}
                    setDateFinished={this.setDateFinished.bind(this)}
                />
                <Modal
                    free_time_log={this.state.free_time_log}
                    seconds={this.state.seconds}
                    time_logged={this.state.time_logged}
                    date_finished={this.state.date_finished}
                    setTimeLogged={this.setTimeLogged.bind(this)}
                    reInitTable={this.reInitTable.bind(this)}
                    resetTimer={this.resetTimer.bind(this)}
                    setDateFinished={this.setDateFinished.bind(this)}
                />
                <Table
                    ref='table'
                />
            </div>
        );
    }
}

export default App;