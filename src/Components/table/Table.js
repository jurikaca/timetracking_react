import React, { Component } from 'react';
import './Table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowDown from '@fortawesome/fontawesome-free-solid/faArrowDown';
import faArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp';
import Service from './../../Services/Service';

class Table extends Component {

    constructor(){
        super();

        this.state = {
            loader: true, // boolean value whether to show loader or not
            search: '', // search value
            start: 0, // start value to paginate items on table
            limit: 10, // number of items to show per page
            items_length: 0, // total items length loaded from server
            pagination: [], // array to store pagination buttons logic
            times_logged: [], // table data loaded from server
            order: { // order object to use when columns get click
                field   : 'id', // the field to order
                asc     : false // order type
            }
        };
        this.service = new Service(); // create new service reference
        this.loadRecords(this.state); // api call to get list of time logged
    }

    /**
     * function to get table data from server
     */
    loadRecords = (input_params) => {
        let params = {};
        params['start'] = input_params.start;
        params['limit'] = input_params.limit;
        if(input_params.order.field !== ''){
            params['field'] = input_params.order.field;
            params['asc'] = input_params.order.asc;
        }
        if(input_params.search !== ''){
            params['search'] = input_params.search;
        }
        if(this.state.loader === false){
            this.setState({
                loader: true
            });
        }
        this.service.getItems(params, this.updateState);
    };

    /**
     * callback function after the response from server on this.loadRecords method
     *
     * @param result, response object from server
     */
    updateState = (result) => {
        let pagination = [];
        if(result.items_length > this.state.limit){ // create pagination array
            for(let i=0; i<result.items_length; i += this.state.limit){
                pagination.push({
                    selected : this.state.start === i,
                });
            }
        }

        this.setState({
            loader : false, // hide loader
            items_length : result.items_length, // total items length
            times_logged : result.data, // table rows data
            pagination : pagination // pagination array
        });
    };

    /**
     * function to order table items
     *
     * @param field, the field to order
     */
    orderTable = (field) => {
        if(this.state.order.field === field){
            this.setState({
                order : {
                    asc : !this.state.order.asc,
                    field : field
                }
            });
        }else{
            this.setState({
                order : {
                    asc : false,
                    field : field
                }
            });
        }
        this.initTable(); // reinit table
    };

    /**
     * function to initialize table
     */
    initTable = () => {
        this.setState({
            start : 0
        });
        this.loadRecords({
            start : 0,
            limit : this.state.limit,
            order: this.state.order,
            search: this.state.search
        });
    };

    /**
     * function to navigate on next page
     */
    goNext = () => {
        if(this.state.start + this.state.limit < this.state.items_length){
            this.setState({
                start : this.state.start + this.state.limit
            });
            this.loadRecords({
                start : this.state.start + this.state.limit,
                limit : this.state.limit,
                order: this.state.order,
                search: this.state.search
            });
        }
    };

    /**
     * function to navigate on previous page
     */
    goPrev = () => {
        if(this.state.start >= this.state.limit){
            this.setState({
                start : this.state.start - this.state.limit
            });
            this.loadRecords({
                start : this.state.start - this.state.limit,
                limit : this.state.limit,
                order: this.state.order,
                search: this.state.search
            });
        }
    };

    /**
     * function to navigate on a page
     * @param page_num, page number to navigate
     */
    goToPage = (page_num) => {
        this.loadRecords({
            start : this.state.limit * page_num,
            limit : this.state.limit,
            order: this.state.order,
            search: this.state.search
        });
    };

    search = (e) => {
        this.setState({
            start : 0,
            limit : 10,
            search: e.target.value
        });
        this.loadRecords({
            start : 0,
            limit : 10,
            order: this.state.order,
            search: e.target.value
        });
    };

    render() {
        return (
            <div className="Table">
                <div className={'container margin-top'}>
                    <div className={'panel panel-default'}>
                        <div className={'panel-heading'}>
                            <h3 className={'panel-title center'}>History of time logged</h3>
                        </div>
                        <div className={'panel-body'}>
                            {this.state.items_length > 0 && this.state.items_length > this.state.limit ?
                                <label>Showing items { this.state.start + 1 } - { this.state.start + this.state.limit } of { this.state.items_length }</label>
                                : null}
                            <div className={'right actions'}>
                                <input className={'form-control input-sm'} name="search" id="search" placeholder="Search..." onChange={() => {this.search.bind(this)}}/>
                            </div>
                            <table className={'table table-bordered'}>
                                <thead>
                                <tr>
                                    <th onClick={() => this.orderTable('id')}>
                                        ID {this.state.order.field === 'id' ?
                                        <FontAwesomeIcon icon={this.state.order.asc === false ? faArrowUp : faArrowDown} />
                                        : null}
                                    </th>
                                    <th onClick={() => this.orderTable('date_finished')}>
                                        Date Finished {this.state.order.field === 'date_finished' ?
                                        <FontAwesomeIcon icon={this.state.order.asc === false ? faArrowUp : faArrowDown} />
                                        : null}
                                    </th>
                                    <th onClick={() => this.orderTable('time_tracked')}>
                                        Time Tracked {this.state.order.field === 'time_tracked' ?
                                        <FontAwesomeIcon icon={this.state.order.asc === false ? faArrowUp : faArrowDown} />
                                        : null}
                                    </th>
                                    <th onClick={() => this.orderTable('description')}>
                                        Description {this.state.order.field === 'description' ?
                                        <FontAwesomeIcon icon={this.state.order.asc === false ? faArrowUp : faArrowDown} />
                                        : null}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.loader !== true
                                        ?
                                        this.state.times_logged.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{ row.id }</td>
                                                    <td>{ row.date_finished }</td>
                                                    <td>{ row.time_tracked_formatted }</td>
                                                    <td>{ row.description }</td>
                                                </tr>
                                            )
                                        )
                                        : null
                                }
                                { this.state.times_logged.length === 0 && this.state.loader !== true ? <tr><td className={'center'} colSpan="4">No data to display</td></tr> : null }
                                { this.state.loader === true ? <tr><td className="center" colSpan="4">Loading...</td></tr> : null }

                                </tbody>
                            </table>
                            { this.state.items_length > 0 ? <div><label>Page { Math.ceil(this.state.start / this.state.limit) + 1 } of { Math.ceil(this.state.items_length / this.state.limit) }</label></div> : null }

                            { this.state.pagination.length > 0
                                ? (
                                    <nav>
                                        <ul className={'pagination'}>
                                            <li className={'page-item'}>
                                                <a className={'page-link'} onClick={() => {this.goPrev()}}>
                                                    Previous
                                                </a>
                                            </li>
                                            {this.state.pagination.map((page, index) => {
                                                return <li className={'page-item ' + page.selected === true ? 'active' : ''} key={index}>
                                                    <a className={'page-link'} onClick={() => {this.goToPage(index)}}>
                                                        { index+1 }
                                                    </a>
                                                </li>;
                                            })}
                                            <li className={'page-item'}>
                                                <a className={'page-link'} onClick={() => {this.goNext()}}>
                                                    Next
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Table;