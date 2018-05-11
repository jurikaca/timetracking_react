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
        this.state = {
            free_time_log: false
        };
        this.service = new Service();
    }

    setTimeLogged = (time_logged) => {
        this.setState({
            time_logged: time_logged
        });
    };

    setFreeTimeLog = (free_time_log) => {
        this.setState({
            free_time_log: free_time_log
        });
    };

    reInitTable = () => {
        this.refs.table.initTable();
    };

    resetTimer = () => {
        this.refs.timer.resetTimer();
    };

    setDateFinished = (date_finished) => {
        this.setState({
            date_finished: this.service.formatDate(date_finished)
        });
    };

    render() {
        return (
            <div className="App">
                <Header />
                <Timer
                    ref='timer'
                    free_time_log={this.state.free_time_log}
                    setTimeLogged={this.setTimeLogged.bind(this)}
                    setFreeTimeLog={this.setFreeTimeLog.bind(this)}
                    setDateFinished={this.setDateFinished.bind(this)}
                />
                <Modal
                    free_time_log={this.state.free_time_log}
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
