import React, { Component } from 'react';
// import Axios from 'axios';
import { Link } from 'react-router-dom';
import Banner from '../Header/Banner';
import env from '../../config_env.json';
// import AdminPanel from './AdminPanel';
// import DoctorDetail from './DoctorDetail';

import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// import { confirmAlert } from 'react-confirm-alert'; 
// import 'react-confirm-alert/src/react-confirm-alert.css';


const weekday = new Array(7);
weekday[0] = 'Sunday';
weekday[1] = 'Monday';
weekday[2] = 'Tuesday';
weekday[3] = 'Wednesday';
weekday[4] = 'Thursday';
weekday[5] = 'Friday';
weekday[6] = 'Saturday';

let eventGuid = 0;

export default class ClinicDetails extends Component {
    constructor(props) {
        super(props);
        this.state ={
            clinicID: this.props.location.state.clinicID,
            clinic:null,
            userLoggedIn: this.props.location.state.userLoggedIn,
            existedAppointments: [],
            displayedAppointments: [],
            weekendsVisible: true,
        }       
    }

    componentWillMount() {
        fetch(env.api + '/clinics/' + this.state.clinicID.toString())
        .then(res => res.json())
        .then((data) => {
            this.setState({ clinic: data });
        })
        .catch(console.log)        
        
        fetch(env.api + '/appointments/clinic/' + this.state.clinicID.toString())
        .then(res => res.json())
        .then((data) => {
            this.setState({ existedAppointments: data });
            this.displayAppointments(data);
        })
        .catch(console.log)

    }

    createEventId = () => {
        return String(eventGuid++)
    }
    
    displayAppointments=(appointments)=>{
        let appointmentEvents =[];
        appointments.forEach((appointment)=>{
            let event = {
                id: this.createEventId(),
                title: "Booked", // appointment.patientName + ' - ' + appointment.procedure,
                start: new Date(appointment.date).toISOString().replace(/T.*$/, '') + 'T' + appointment.time // YYYY-MM-DD
            }
            appointmentEvents.push(event);
        });
        this.setState({
            displayedAppointments: appointmentEvents
        });
    }

    renderEventContent=(eventInfo)=> {
        return (
          <>
            <i>{eventInfo.event.title}</i>
          </>
        )
    }
      
    renderSidebarEvent=(event)=> {
        return (
          <li key={event.id}>
            <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
            <i>{event.title}</i>
          </li>
        )
    }

    render() {
        return (
                <React.Fragment>
                    <Banner/>
                    {this.state.clinic && <div className="container new-container">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Information</h4>
                                <p className="mb-0">Name:  {this.state.clinic.name}</p>
                                <p className="mb-0">Address:  {this.state.clinic.address}, {this.state.clinic.city},  {this.state.clinic.state} {this.state.clinic.zipcode}</p>
                                <p className="mb-0">Phone:  {this.state.clinic.phone}</p>
                                <p className="mb-0">Phone:  {this.state.clinic.email}</p>
                                <p className="mb-0">Rating:  {this.state.clinic.rating} / 5</p>
                            </div>
                            <div className="card-body">
                                <h4 className="card-title">Hours</h4>
                                {this.state.clinic && this.state.clinic.availability && Object.entries(this.state.clinic.availability).map((day) => {
                                    if (day[1].length > 0){
                                        return <li key={day[0]}>{day[0]}: {day[1][0]} - {day[1][1]}</li>
                                    } else{
                                        return <li key={day[0]}>{day[0]}: Closed</li>
                                    }
                                })}   
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Appointment Calendar</h4>
                                <div className="book-button"> 
                                {this.state.userLoggedIn && 
                                    <button type="button"> 
                                        <Link to={{
                                                    pathname: '/ScheduleAppointment',
                                                    state: { 
                                                        clinic: this.state.clinic,
                                                        userLoggedIn: this.state.userLoggedIn
                                                    }
                                                }}>
                                                Book Appointment
                                        </Link>
                                    </button>
                                }
                                </div>
                                {!this.state.userLoggedIn && 
                                    <button type="button"> 
                                        <Link className="nav-link" to='/LogIn'>Log In to Book Appointment</Link>
                                    </button>
                                }

                                {this.state.displayedAppointments.length &&
                                    <div className='container new-container'>
                                        <div className='demo-app'>
                                            <div className='demo-app-main'>
                                            <FullCalendar
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                headerToolbar={{
                                                left: 'prev,next today',
                                                center: 'title',
                                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                                }}
                                                initialView='timeGridWeek'
                                                editable={false}
                                                selectable={false}
                                                selectMirror={false}
                                                dayMaxEvents={true}
                                                weekends={this.state.weekendsVisible}
                                                initialEvents={this.state.displayedAppointments} 
                                                eventContent={this.renderEventContent} 
                                            />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
    }               
                </React.Fragment>
            )
        }
 
    }
