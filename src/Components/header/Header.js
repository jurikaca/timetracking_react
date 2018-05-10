import React, { Component } from 'react';

class Header extends Component {
    render() {

        const appNavbar = (
            <nav className={'navbar navbar-inverse'}>
                <div className={'container-fluid'}>
                    <div className={'navbar-header'}>
                        <a className={'navbar-brand'} href={''}>Timetracker</a>
                    </div>
                    <ul className={'nav navbar-nav'}>
                        <li className={'active'}><a href={''}>Home</a></li>
                    </ul>
                    <ul className={'nav navbar-nav navbar-right'}>
                        <li><a href={''}><span className={'glyphicon glyphicon-user'}></span> Sign Up</a></li>
                        <li><a href={''}><span className={'glyphicon glyphicon-log-in'}></span> Login</a></li>
                    </ul>
                </div>
            </nav>
        );
        return (
            <div>
                {appNavbar}
            </div>
        );
    }
}

export default Header;
