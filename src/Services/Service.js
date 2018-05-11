import React from 'react';

export default class Service {

    constructor(){
        this.SERVER_URL = 'http://localhost:8000/';
    }

    getItems = (data, callback) => {
        let query = '?';
        for(let key in data){
            query += key + '=' + data[key] + '&';
        }
        fetch(this.SERVER_URL+"time/get_time?"+query)
            .then(res => res.json())
            .then(
                (result) => {
                    callback(result);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    };

    saveTime = (data, callback) => {
        var form = new FormData();
        for(let key in data){
            form.append(key, data[key]);
        }
        return fetch(this.SERVER_URL+"time/save_time", {
            method: 'POST',
            body: form
        })
            .then(res => res.json())
            .then(
                (result) => {
                    callback(result);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    /**
     * function to format seconds on time format 'HH:ii:ss'
     *
     * @param seconds, integer ex. 34
     * @returns {string}, format 'HH:ii:ss'
     */
    formatTime = (seconds_input) => {

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
        // return this._timeService.formatTime(seconds_input);
    };

    /**
     * function to generate actual date and time 'yyyy-mm-dd hh:ii'
     *
     * @returns {string}
     */
    formatDate = (date_input) => {
        date_input = new Date(date_input);
        var dd = date_input.getDate();
        var mm = date_input.getMonth()+1; //January is 0!
        var hh = date_input.getHours();
        var ii = date_input.getMinutes();
        var ss = date_input.getSeconds();

        var yyyy = date_input.getFullYear();
        var date = ''+yyyy+'-';
        if(mm<10){
            date += '0'+mm+'-';
        }else{
            date += mm+'-';
        }
        if(dd<10){
            date += '0'+dd+' ';
        }else{
            date += dd+' ';
        }
        if(hh<10){
            date += '0'+hh+':';
        }else{
            date += hh+':';
        }
        if(ii<10){
            date += '0'+ii+':';
        }else{
            date += ii+':';
        }
        if(ss<10){
            date += '0'+ss;
        }else{
            date += ss;
        }
        return date;
    }
};