import React, { Component } from 'react';
import './Modal.css';
import $ from "jquery";
import Service from './../../Services/Service';
import DateTimePicker from 'react-datetime-picker';

class Modal extends Component {

    constructor(){
        super();
        this.state = {
            time_hours: 0, // time in hours if free time is logged
            date: new Date(), // date fo datepicker
            description: '', // description of time logged
            time_logged: '00:00:00' // time format for tracked time
        };
        this.service = new Service();
    }

    /**
     * function to return validation rules for form fields
     *
     * @param description, description field value
     * @param time_hours, time_hours field value
     *
     * @returns {{description: boolean, time_hours: boolean}}, object containing validations
     */
    validate = (description, time_hours) => {
        return {
            description: description.length <= 0, // dexcription is required
            time_hours: time_hours <= 0 // time_hours should be more bigger then 0
        };
    };

    /**
     * function to check if the form is valid
     * @returns {boolean}
     */
    canBeSubmitted = () => {
        const errors = this.validate(this.state.description, this.state.password);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
    };

    /**
     * function to log time, post data to server for storing time logged
     */
    saveTime = () => {
        // if(this.canBeSubmitted()){
            this.setState({
                loader: true
            });
            let seconds = this.props.free_time_log === true ? Math.round(this.state.time_hours * 3600) : this.props.seconds;

            this.service.saveTime({
                seconds                 :   seconds,
                date_finished           :   this.props.date_finished,
                time_tracked_formatted  :   this.service.formatTime(seconds),
                description             :   this.state.description
            }, this.updateState);
            this.props.reInitTable();
        // }
    };

    /**
     * callback function after the response from server on this.saveTime method
     *
     * @param result, response object from server
     */
    updateState = (result) => {
        this.setState({
            loader : false
        });
        if(result.success){
            $('#close').click();
            alert(result.msg);
            this.props.resetTimer(); // reset timer
            this.props.reInitTable(); // reinitialize table data
        }else{
            console.log(result);
        }
    };

    /**
     * binding of description change input
     * @param e
     */
    handleDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }

    /**
     * binding of time_hours change input
     * @param e
     */
    handleTimeHoursChange = (e) => {
        this.setState({
            time_hours: e.target.value
        });
        this.props.setTimeLogged(this.service.formatTime(e.target.value * 3600));
    };

    /**
     * binding of date_finished change input
     * @param e
     */
    handleDateFinishedChange = date => {
        this.setState({ date });
        this.props.setDateFinished(date);
    };

    render() {
        const errors = this.validate(this.state.description, this.state.time_hours); // calculate form errors
        const isDisabled = Object.keys(errors).some(x => errors[x]); // isDisable property for submit button

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
                            <form onSubmit={() => {this.saveTime()}}>
                                {this.props.free_time_log === true ?
                                    (
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
                                    )
                                    : null}
                                <div className={'form-group'}>
                                    <label>Time to log</label>
                                    <input type="text" value={this.props.time_logged} className={'form-control'} id="time_logged" name="time_logged" placeholder="Enter time" disabled={true} />
                                </div>
                                <div className={'form-group'}>
                                    <label>Date</label>
                                    <br/>
                                    {
                                        this.props.free_time_log !== true
                                            ?
                                            <input type="text" className={'form-control'} id="date_finished" name="date_finished" placeholder="Date" value={this.props.date_finished} disabled={true} />
                                            :
                                            <DateTimePicker
                                                onChange={ this.handleDateFinishedChange.bind(this) }
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
                            <button className={'btn btn-primary'} onClick={() => {this.saveTime()}} disabled={this.state.loader === true && isDisabled}>
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