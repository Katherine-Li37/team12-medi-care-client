// require("dotenv").config({ path: "./config.env" });

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

import Home from './Components/Home';
import LogIn from './Components/Page/LogIn';
import Register from './Components/Page/Register';
import AppointmentPage from './Components/Page/AppointmentPage';
import EditAppointment from './Components/Page/EditAppointment';
import ProfileDetails from './Components/Page/ProfileDetails';
import AppointmentsList from './Components/Page/AppointmentsList';
import ClinicDetails from './Components/Page/ClinicDetails';
import FeedbackDetails from './Components/Page/FeedbackDetails';
import AdminPanel from './Components/Page/AdminPanel';
import WaitTimeDetails from './Components/Page/WaitTimeDetails';

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
            <Route path = '/EditAppointment/:id' component = { EditAppointment }/>
            <Route path = '/MyProfile/:id' component = { ProfileDetails }/> 
            <Route path = '/MyAppointments/:id' component = { AppointmentsList }/> 
            <Route path = '/AppointmentWaitTime/:id' component = { WaitTimeDetails }/> 
            <Route path = '/AdminPanel' component = { AdminPanel }/> 
            <Route path = '/Clinic/:id' component = { ClinicDetails }/> 
            <Route path = '/AppointmentFeedback/:id' component = { FeedbackDetails }/>
            <Route path = '/LogIn' component = { LogIn }/> 
            <Route path = '/Register' component = { Register }/> 
            <Footer/>
        </Router> 
        </div>
    );
}

export default App;