import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import navlogo from '../../assets/img/icons/navlogo.svg'

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state ={
            userID: null,
            username: null,
            userLoggedIn: null
        }       
        this.signOut = this.signOut.bind(this);
    }
    async componentDidMount(){
        const user = localStorage.getItem('username');
        if(user && user!=='null'){
            const userID = user.split(',')[1];
            const response = await fetch('https://medicaredemo.herokuapp.com/users/'+ userID)
            const data = await response.json();
            this.setState({
                userID: userID,
                username: user.split(',')[0],
                userLoggedIn: data
            });
        }
    }

    signOut(){
        console.log('sign out')
        localStorage.clear();
        this.setState({
            userID: null,
            username: null,
            userLoggedIn: null
        });      
    };

    render() {
        
        return (
            <header className="header-one">
                <div className="main-menu">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-3 col-lg-2 d-flex col-5">
                                <Link className="navbar-brand logo" to='/'>
                                    <img src={require("../../assets/img/newlogo.jpg") } alt="donto" />
                                </Link>
                            </div>
                            <div className="col-lg-10 col-md-9 d-none d-lg-block text-lg-right">
                                <nav id="responsive-menu" className="menu-style-one">
                                    <ul className="menu-items">
                                        <li><Link to='/'>Home</Link></li>
                                        {!this.state.username && <li><Link to='/LogIn'>Sign up/ Log in</Link></li>}
                                        {this.state.username && 
                                            <li><Link to={{
                                                pathname: `/Profile/${this.state.userID}`,
                                                state: { userLoggedIn: this.state.userLoggedIn }
                                            }}>{this.state.username}
                                            </Link></li>
                                        }
                                        {this.state.username && 
                                            <li onClick={this.signOut}><Link to='/'>Sign out</Link></li>
                                        }
                                    </ul>
                                </nav>
                            </div>
                            <div className="col-md-9 col-sm-7  col-6 d-block d-lg-none">
                                
                                <nav className="navbar navbar-expand-lg text-right navbar-light mobile-nav">
                                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobilenav">
                                        <img src={navlogo} alt="navlogo"/>
                                        <span className="fal fa-bars" />
                                    </button>
                                </nav>
                            </div>
                            <div className="collapse navbar-collapse mobile-menu" id="mobilenav">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item active">
                                        <Link className="nav-link" to='/'>Home</Link>
                                    </li>
                                    {!this.state.username &&
                                        <li className="nav-item">
                                            <Link className="nav-link" to='/LogIn'>Sign up/ Log in</Link>
                                        </li>
                                    }
                                    {this.state.username && 
                                        <li className="nav-item">
                                            <Link className="nav-link" to={{
                                                pathname: `/Profile/${this.state.userID}`,
                                                state: { userLoggedIn: this.state.userLoggedIn }
                                            }}>
                                                {this.state.username}
                                            </Link>
                                        </li>
                                    }
                                    {this.state.username && 
                                        <li className="nav-item" onClick={this.signOut}><Link className="nav-link" to='/'>Sign out</Link></li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>            
        )
    }
}
