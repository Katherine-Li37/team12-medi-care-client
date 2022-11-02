// require("dotenv").config({ path: "./config.env" });

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

import Home from './Components/Home';
import LogIn from './Components/Page/LogIn';
import Register from './Components/Page/Register';
import AppointmentPage from './Components/Page/AppointmentPage';
// import ProfileDetails from './Components/Page/ProfileDetails';
import ClinicDetails from './Components/Page/ClinicDetails';

import './App.css';

function App() {
    return ( 
        <div className = 'main-wrapper' >
        <Router >
            <Header />

            <Route exact path = '/' render = {props => ( 
                <Home />
            )} />
            <Route path = '/ScheduleAppointment' component = { AppointmentPage }/>
            {/* <Route path = '/Profile/:id' component = { ProfileDetails }/>  */}
            <Route path = '/Clinic/:id' component = { ClinicDetails }/> 
            <Route path = '/LogIn' component = { LogIn }/> 
            <Route path = '/Register' component = { Register }/> 
            <Footer/>
        </Router> 
        </div>
    );
}

export default App;