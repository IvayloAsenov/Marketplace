import React from 'react';

import '../styles/Header.css';

class Header extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    render() {
        const { logged_in, id } = this.props;

        return (
            <div className="">
                {logged_in ?
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark pl-5">
                        <div className="container p-0">
                            <span className="navbar-brand mb-0 h1 mr-5" href="/">Jikiki</span>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href={`/users/${id}`}>My Profile</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/cart">My Cart</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href={`/chat/${this.props.id}`}>My Chatroom</a>
                                    </li>
                                    <li className="nav-item">
                                        <span style={{cursor: 'pointer'}} className="nav-link" onClick={this.props.handle}>Logout</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    :
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
                        <div className="container p-0">
                            <span className="navbar-brand mb-0 h1">Jikiki</span>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/login">Login <span className="sr-only">(current)</span></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/register">Register</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                }
            </div>
        );
    }
}

export default Header;
