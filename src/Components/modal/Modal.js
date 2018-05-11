import React, { Component } from 'react';
import './Modal.css';
import $ from "jquery";
import Service from './../../Services/Service';
import DateTimePicker from 'react-datetime-picker';

class Modal extends Component {

    constructor(){
        super();
        this.state = {
            time_hours: 0,
            date: new Date(),
            description: ''
        };
        this.service = new Service();
    }

    validate = (description, time_hours) => {
        return {
            description: description.length <= 0,
            time_hours: time_hours <= 0
        };
    };

    canBeSubmitted = () => {
        const errors = this.validate(this.state.description, this.state.password);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
    }

    /**
     * function to log time, post data to server for storing time logged
     */
    saveTime = () => {
        this.setState({
            loader: true
        });
        let seconds = this.props.free_time_log === true ? Math.round(this.state.time_hours * 3600) : this.state.seconds;

        console.log(this.props.date_finished);
        this.service.saveTime({
            seconds                 :   seconds,
            date_finished           :   this.props.date_finished,
            time_tracked_formatted  :   this.service.formatTime(seconds),
            description             :   this.state.description
        }, this.updateState);
        this.props.reInitTable();
    };

    updateState = (result) => {
        this.setState({
            loader : false
        });
        if(result.success){
            $('#close').click();
            // this.toasterService.pop('success', 'Success', result.msg);
            this.props.resetTimer();
            this.props.reInitTable();
        }else{
            console.log(result);
        }
    };

    handleDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }

    handleTimeHoursChange = (e) => {
        this.setState({
            time_hours: e.target.value
        });
        this.props.setTimeLogged(this.service.formatTime(e.target.value * 3600));
    };

    dateFinishedChange = date => {
        this.setState({ date });
        this.props.setDateFinished(date);
    };

    render() {
        const errors = this.validate(this.state.description, this.state.time_hours);
        const isDisabled = Object.keys(errors).some(x => errors[x]);

        return (
            <div className={'modal fade'} id="TimeTrackerModal" role="dialog">
                <div className={'modal-dialog'}>
                    <div className={'modal-content'}>
                        <div className={'modal-header'}>
                            <button className={'close'} id="close" data-dismiss="modal">&times;</button>
                            <h4 className={'modal-title'}>
                                { this.props.free_time_log === true ? 'Log time without tracker' : 'Log time ' + this.props.time_logged}
                            </h4>
                        </div>
                        <div className={'modal-body'}>
                            <form onSubmit={this.saveTime}>
                                {this.props.free_time_log === true ?
                                    [
                                        <div className={'form-group'}>
                                            <label>Time on hours</label>
                                            <input type="number" value={this.state.time_hours}
                                                   onChange={ this.handleTimeHoursChange.bind(this) } className={'form-control'} id="time_hours_field" minLength={1} required={true} name="time_hours_field" placeholder="Add time on hours ex. 2.23 where 0.23 is 23% of one hour" />
                                            <div className={'text-danger'} hidden={!errors.time_hours}>
                                                <div hidden={!errors.time_hours}>
                                                    Time should be bigger then 0 and numeric
                                                </div>
                                            </div>
                                        </div>
                                    ]
                                    : null}
                                <div className={'form-group'}>
                                    <label>Time to log</label>
                                    <input type="text" value={this.props.time_logged} className={'form-control'} id="time_logged" name="time_logged" placeholder="Enter time" disabled={true} />
                                </div>
                                <div className={'form-group'}>
                                    <label>Date</label>
                                    <br/>
                                    {
                                        this.props.free_time_log != true
                                            ?
                                            <input type="text" className={'form-control'} id="date_finished" name="date_finished" placeholder="Date" value={this.props.date_finished} disabled={true} />
                                            :
                                            <DateTimePicker
                                                onChange={this.dateFinishedChange}
                                                value={this.state.date}
                                            />
                                    }
                                </div>
                                <div className={'form-group'}>
                                    <label>Task Decription</label>
                                    <textarea value={this.state.description}
                                              onChange={ this.handleDescriptionChange.bind(this) }  rows="4" className={'form-control is-invalid'} id="description_field" required name="description_field"></textarea>

                                    <div className={'text-danger'} hidden={!errors.description}>
                                        <div>
                                            Description is required!
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div className={'modal-footer'}>
                            <button className={'btn btn-primary'} onClick={this.saveTime} disabled={this.state.loader === true} disabled={isDisabled}>
                                { this.state.loader === true ? 'Saving...' : 'Log Time' }
                            </button>
                            <button className={'btn btn-default'} data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
                <button id="openModalButton" hidden={true} data-toggle="modal" data-target="#TimeTrackerModal">Open Modal</button>
            </div>
        );
    }
}

export default Modal;
