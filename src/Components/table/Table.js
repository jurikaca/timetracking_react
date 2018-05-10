import React, { Component } from 'react';
import './Table.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowDown from '@fortawesome/fontawesome-free-solid/faArrowDown';
import faArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp';

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
            order: {
                field   : 'id', // the field to order
                asc     : false // order type
            } // order object to use when columns get click
        };
        this.loadRecords();
    }

    /**
     * runs everytime the component gets rendered
     */
    componentWillMount(){

    }

    /**
     * function to get table data from server
     */
    loadRecords = () => {
        let params = {};
        params['start'] = this.state.start;
        params['limit'] = this.state.limit;
        if(this.state.order.field !== ''){
            params['field'] = this.state.order.field;
            params['asc'] = this.state.order.asc;
        }
        if(this.state.search !== ''){
            params['search'] = this.state.search;
        }
        fetch("http://localhost:8000/time/get_time")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        loader : false,
                        items_length : result.items_length,
                        times_logged : result.data
                    });
                    this.paginate();
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );

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
        this.loadRecords();
    };

    /**
     * function to initialize table
     */
    initTable = () => {
        this.setState({
            start : 0,
            limit : 0
        });
        this.loadRecords();
    };

    /**
     * function to navigate on next page
     */
    goNext = () => {
        if(this.state.start + this.state.limit < this.state.items_length){
            this.setState({
                start : this.state.start + this.state.limit
            });
            this.loadRecords();
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
            this.loadRecords();
        }
    };

    /**
     * function to navigate on a page
     * @param page_num, page number to navigate
     */
    goToPage = (page_num) => {
        this.setState({
            start : this.state.limit * page_num
        });
        this.loadRecords();
    };

    /**
     * function to create paginations array for loading pagination buttons
     */
    paginate = () => {
        let pagination = [];
        if(this.state.items_length > this.state.limit){
            for(let i=0; i<this.state.items_length; i += this.state.limit){
                pagination.push({
                    selected : this.state.start === i ? true : false,
                });
            }
        }
        this.setState({
            pagination : pagination
        });
    };

    /**
     * function to round a number to bigest value
     *
     * @param value, number to round
     * @returns {number}
     */
    round = (value) => {
        return Math.ceil(value);
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

                            <div className={'actions'}>
                                {this.state.items_length > 0 ?
                                    <div>
                                        <label>Showing items { this.state.start + 1 } - { this.state.start + this.state.limit } of { this.state.items_length }</label>
                                    </div>
                                    : null}
                                <div className={'right'}>
                                    <input className={'form-control input-sm'} name="search" id="search" placeholder="Search..." onKeyUp={this.initTable}/>
                                </div>
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
                                        this.state.times_logged.map(row => (
                                                <tr>
                                                    <td>{ row.id }</td>
                                                    <td>{ row.date_finished.date }</td>
                                                    <td>{ row.time_tracked_formatted.date }</td>
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
                            { this.state.items_length > 0 ? <div><label>Page { this.round(this.state.start / this.state.limit) + 1 } of { this.round(this.state.items_length / this.state.limit) }</label></div> : null }

                            { this.state.pagination.length > 0
                                ? (
                                    <nav>
                                        <ul className={'pagination'}>
                                            <li className={'page-item'}>
                                                <a className={'page-link'} onClick={this.goPrev}>
                                                    Previous
                                                </a>
                                            </li>
                                            this.pagination.map((page, index) => (
                                            <li className={'page-item ' + this.page.selected === true ? 'active' : ''}>
                                                <a className={'page-link'} onClick={this.goToPage(this.index)}>
                                                    { this.index+1 }
                                                </a>
                                            </li>
                                            ))

                                            <li className={'page-item'}>
                                                <a className={'page-link'} onClick={this.goNext}>
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
