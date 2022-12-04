import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Banner from '../Header/Banner';
import { FcCheckmark } from "react-icons/fc";
import env from '../../config_env.json';
// import AdminPanel from './AdminPanel';
// import DoctorDetail from './DoctorDetail';

// import FullCalendar, { formatDate } from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import 'react-datepicker/dist/react-datepicker.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';


// const weekday = new Array(7);
// weekday[0] = 'Sunday';
// weekday[1] = 'Monday';
// weekday[2] = 'Tuesday';
// weekday[3] = 'Wednesday';
// weekday[4] = 'Thursday';
// weekday[5] = 'Friday';
// weekday[6] = 'Saturday';

// let eventGuid = 0;

export default class AppointmentsList extends Component {
    constructor(props) {
        super(props);
        this.state ={
            user: this.props.location.state.user,
            userLoggedIn: this.props.location.state.userLoggedIn,

            pastAppointment: [],
            upcomingAppointment: [],
        }       
    }

    componentDidMount() {
        if (this.state.userLoggedIn){
            this.fetchAppointments()
        }
    }


    fetchAppointments = () => {
        fetch(env.api + '/appointments/patient/' + this.state.userLoggedIn._id.toString())
        .then(res => res.json())
        .then((data) => {
            let pastAppointment = [ ];
            let upcomingAppointment = [];
            data.forEach((appointment) =>{
                if(appointment.status === 'active'){
                    if (new Date(appointment.date).getTime() >= new Date().getTime()){
                        upcomingAppointment.push(appointment);
                    } else{
                        pastAppointment.push(appointment);
                    }
                }
            });

            // sort appointment by day and time
            pastAppointment.sort(function(a,b){
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            upcomingAppointment.sort(function(a,b){
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            this.setState({ 
                pastAppointment: pastAppointment,
                upcomingAppointment: upcomingAppointment
            });
        })
    }

    confirmDeleteAppointment = (appointment) => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-ui'>
                  <h1>Confirm to delete appointment</h1>
                  <p>Are you sure to delete the appointment on {new Date(appointment.date).toLocaleDateString('en-US')}  {appointment.time} at {appointment.clinicName}</p>
                  <button className='delete-modal-button' onClick={() => {
                      this.handleDeleteAppointment(appointment)
                      onClose()
                  }}>Yes</button>
                  <button className='delete-modal-button' onClick={onClose}>No</button>
                </div>
              )
            }
        })
    }


    handleDeleteAppointment=(appointment)=>{
        Axios({
            method: 'POST',
            data: {
                clinicID: appointment.clinicID,
                clinicName: appointment.clinicName,
                patientID: appointment.patientID,
                patientName: appointment.patientName,
                date: appointment.date,
                time: appointment.time,
                procedure: appointment.procedure,
                status: 'inactive',
                ifCheckedIn: appointment.ifCheckedIn,
                ifRated: appointment.ifRated
            },
            url: env.api + '/appointments/update/' + appointment._id
        }).then((res) => {
            if(res.data){
                this.fetchAppointments()
            } 
        });
    };


    render() {
        if (this.state.userLoggedIn){
            return (
                <React.Fragment>
                    <Banner/>
                    <div className="container new-container">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="card-title">Appointment</h1>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h3>Upcoming Appointment</h3>
                                        <p>You can check your appointment wait time and check-in up to 1 hour prior to your appointment time when you arrive at the clinic.</p>
                                        <p>Once checked in, the clinic staff will be notified that you are ready for your appointment.</p>
                                    </div>
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="col-sm-1">Date</th>
                                            <th className="col-sm-1">Time</th>
                                            <th className="col-sm-3">Clinic</th>
                                            <th className="col-sm-1">Procedure</th>
                                            <th className="col-sm-2">Actions</th>
                                            <th className="col-sm-2">Checked In?</th>
                                            <th className="col-sm-2">Edit / Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.upcomingAppointment.map((appointment) => {
                                                return (
                                                    <tr>
                                                        <td className='appointment-table'>{ new Date(appointment.date).toLocaleDateString('en-US') }</td>
                                                        <td className='appointment-table'>{ appointment.time }</td>
                                                        <td className='appointment-table'>
                                                            <Link to={{
                                                                pathname: `/Clinic/${appointment.clinicID}`,
                                                                state: { 
                                                                    clinicID: appointment.clinicID,
                                                                    userLoggedIn: this.state.userLoggedIn
                                                                }
                                                            }}>
                                                                { appointment.clinicName }
                                                            </Link>
                                                        </td>
                                                        <td className='appointment-table'>{ appointment.procedure }</td>
                                                        <td className='appointment-table'> 
                                                            <Link to={{
                                                                pathname: `/AppointmentWaitTime/${appointment._id}`,
                                                                state: { 
                                                                    appointmentID: appointment._id,
                                                                    userLoggedIn: this.state.userLoggedIn
                                                                }
                                                            }}>
                                                                Check Wait Time / Check-in
                                                            </Link>
                                                        </td> 
                                                        <td className='appointment-table com-sm-22'>
                                                            { appointment.ifCheckedIn && <FcCheckmark />}
                                                        </td>
                                                        <td> 
                                                            <button className="icon-button">
                                                                <Link to={{
                                                                    pathname: '/EditAppointment/'+ appointment._id,
                                                                    state: {
                                                                        appointment: appointment,
                                                                        userLoggedIn: this.state.userLoggedIn
                                                                    }
                                                                }}><i className="fa fa-edit fa-2x"></i>
                                                                </Link>
                                                            </button>

                                                            <button className="icon-button" onClick={() => this.confirmDeleteAppointment(appointment)}>
                                                                <i className="fa fa-trash fa-2x"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h3>Past Appointment</h3>
                                        <p>Please provide feedback for your past appointments to get gift card reward and help us improve. </p>
                                    </div>
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="col-sm-1">Date</th>
                                            <th className="col-sm-1">Time</th>
                                            <th className="col-sm-3">Clinic</th>
                                            <th className="col-sm-1">Procedure</th>
                                            <th className="col-sm-3">Actions</th>
                                            <th className="col-sm-19">Rated?</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.pastAppointment.map((appointment) => {
                                                return (
                                                    <tr>
                                                        <td className='appointment-table'>{ new Date(appointment.date).toLocaleDateString('en-US') }</td>
                                                        <td className='appointment-table'>{ appointment.time }</td>
                                                        <td className='appointment-table'>
                                                            <Link to={{
                                                                pathname: `/Clinic/${appointment.clinicID}`,
                                                                state: { 
                                                                    clinicID: appointment.clinicID,
                                                                    userLoggedIn: this.state.userLoggedIn
                                                                }
                                                            }}>
                                                                { appointment.clinicName }
                                                            </Link>
                                                        </td>
                                                        <td className='appointment-table'>{ appointment.procedure }</td>
                                                        <td className='appointment-table'> 
                                                            {appointment.ifRated!==true && 
                                                                <Link to={{
                                                                    pathname: `/AppointmentFeedback/${appointment._id}`,
                                                                    state: { 
                                                                        appointment: appointment,
                                                                        userLoggedIn: this.state.userLoggedIn
                                                                    }
                                                                }}>
                                                                    Rate / Review
                                                                </Link>
                                                            }
                                                        </td>
                                                        <td className='appointment-table com-sm-21'>
                                                            { appointment.ifRated && <FcCheckmark />}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {/* <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Profile Information</h3>
                                <div className="row">
                                    <div className="col-sm-3"><h6 className="mb-0">Full Name</h6></div>
                                    <div className="col-sm-9 text-secondary"> {userLoggedIn.firstName} {userLoggedIn.lastName}</div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3"><h6 className="mb-0">Email</h6></div>
                                    <div className="col-sm-9 text-secondary"> {userLoggedIn.username}</div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3"><h6 className="mb-0">Phone Number</h6></div>
                                    <div className="col-sm-9 text-secondary"> {userLoggedIn.phone}</div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </React.Fragment>
            )
        }
    }
}