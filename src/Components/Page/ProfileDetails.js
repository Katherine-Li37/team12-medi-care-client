import React, { Component } from 'react';
// import Axios from 'axios';
import { Link } from 'react-router-dom';
import Banner from '../Header/Banner';
// import AdminPanel from './AdminPanel';
// import DoctorDetail from './DoctorDetail';

// import FullCalendar, { formatDate } from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import 'react-datepicker/dist/react-datepicker.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import { confirmAlert } from 'react-confirm-alert'; 
// import 'react-confirm-alert/src/react-confirm-alert.css';


// const weekday = new Array(7);
// weekday[0] = 'Sunday';
// weekday[1] = 'Monday';
// weekday[2] = 'Tuesday';
// weekday[3] = 'Wednesday';
// weekday[4] = 'Thursday';
// weekday[5] = 'Friday';
// weekday[6] = 'Saturday';

// let eventGuid = 0;

export default class ProfileDetails extends Component {
    constructor(props) {
        super(props);
        this.state ={
            user: this.props.location.state.user,
            userLoggedIn: this.props.location.state.userLoggedIn,
            // facilityInfo: this.props.location.state.facility? null: this.props.location.state.facility,
            
            //  // For doctor's profile
            // doctorDetails: null,
            // hours: null,
            // existedAppointments: [],
            // displayedAppointments: [],
            // weekendsVisible: true,
            // currentEvents: [],

            // For patient's profile
            pastAppointment: [],
            upcomingAppointment: [],
        }       
    }

    componentDidMount() {
        if (this.state.userLoggedIn){
            // this.fetchUserInformation();  // in case of user updated information
        
            // if (this.state.userLoggedIn.type === 'Doctor'){
            //     fetch('https://medicaredemo.herokuapp.com/doctor_details/' + this.state.userLoggedIn._id.toString())
            //     .then(res => res.json())
            //     .then((data) => {
            //         this.setState({ doctorDetails: data });
            //         this.getWorkHours(data);
            //     })
            //     .catch(console.log)

            //     fetch('https://medicaredemo.herokuapp.com/appointments/doctor/' + this.state.userLoggedIn._id.toString())
            //     .then(res => res.json())
            //     .then((data) => {
            //         this.setState({ existedAppointments: data });
            //         this.displayAppointments(data);
            //     })
            //     .catch(console.log)

            // } else if (this.state.userLoggedIn.type === 'Patient'){
            fetch('http://localhost:5000/appointments/patient/' + this.state.userLoggedIn._id.toString())
                .then(res => res.json())
                .then((data) => {
                    let pastAppointment = [ ];
                    let upcomingAppointment = [];
                    data.forEach((appointment) =>{
                        if(appointment.status === 'active'){
                            if (new Date(appointment.date)>= new Date()){
                                upcomingAppointment.push(appointment);
                            }else{
                                pastAppointment.push(appointment);
                            }
                        }
                    });

                    // sort appointment by day and time
                    pastAppointment.sort(function(a,b){
                        return new Date(b.date) - new Date(a.date);
                    });
                    upcomingAppointment.sort(function(a,b){
                        return new Date(b.date) - new Date(a.date);
                    });

                    this.setState({ 
                        pastAppointment: pastAppointment,
                        upcomingAppointment: upcomingAppointment
                    });
                })
                .catch(console.log)
            }
        // }
    }

    // fetchUserInformation = () =>{
    //     fetch('https://medicaredemo.herokuapp.com/users/' + this.state.userLoggedIn._id.toString())
    //     .then(res => res.json())
    //     .then((data) => {
    //         this.setState({ userLoggedIn: data });
    //     })
    //     .catch(console.log)
    // }

    // getWorkHours=(details)=>{
    //     const dateList = [];
    //     Object.keys(details.facilities.availability).forEach((day)=>{
    //         let hours = details.facilities.availability[day]
    //         if (hours.length){
    //             dateList.push({day, hours});
    //         }
    //     });
    //     this.setState({hours: dateList});
    // }

    // createEventId = () => {
    //     return String(eventGuid++)
    // }
    
    // displayAppointments=(appointments)=>{
    //     let appointmentEvents =[];
    //     appointments.forEach((appointment)=>{
    //         let event = {
    //             id: this.createEventId(),
    //             title: appointment.patientName + ' - ' + appointment.procedure,
    //             start: new Date(appointment.date).toISOString().replace(/T.*$/, '') + 'T' + appointment.time // YYYY-MM-DD
    //         }
    //         appointmentEvents.push(event);
    //     });
    //     this.setState({
    //         displayedAppointments: appointmentEvents
    //     });
    // }

    // confirmDeleteAppointment = (appointment) => {
    //     confirmAlert({
    //         customUI: ({ onClose }) => {
    //           return (
    //             <div className='custom-ui'>
    //               <h1>Confirm to delete appointment</h1>
    //               <p>Are you sure to delete the appointment on {new Date(appointment.date).toLocaleDateString('en-US')}  {appointment.time} with Dr. {appointment.doctorName}</p>
    //               <button className='delete-modal-button' onClick={() => {
    //                   this.handleDeleteAppointment(appointment)
    //                   onClose()
    //               }}>Yes</button>
    //               <button className='delete-modal-button' onClick={onClose}>No</button>
    //             </div>
    //           )
    //         }
    //     })
    // }

    // handleDeleteAppointment=(appointment)=>{
    //     Axios({
    //         method: 'POST',
    //         data: {
    //             date: appointment.date,
    //             time: appointment.time,
    //             procedure: appointment.procedure,
    //             status: 'inactive'
    //         },
    //         url: 'https://medicaredemo.herokuapp.com/appointments/update/' + appointment._id,
    //       }).then((res) => {
    //           if(res.data){
    //             //   console.log(res.data)
    //             //   this.setState({
    //             //       updateAppointmentSuccess: true
    //             //   });
    //           }
    //       });
    // }

    // renderEventContent=(eventInfo)=> {
    //     return (
    //       <>
    //         <i>{eventInfo.event.title}</i>
    //       </>
    //     )
    //   }
      
    // renderSidebarEvent=(event)=> {
    //     return (
    //       <li key={event.id}>
    //         <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
    //         <i>{event.title}</i>
    //       </li>
    //     )
    // }


    render() {
        if (this.state.userLoggedIn){
            const userLoggedIn = this.state.userLoggedIn

            return (
                <React.Fragment>
                    <Banner/>
                    <div className="container new-container">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Appointment</h4>
                                <div className="row">
                                    <div className="col-sm-6"><h5 className="mb-0">Upcoming Appointment</h5></div>
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="col-sm-1">Date</th>
                                            <th className="col-sm-1">Time</th>
                                            <th className="col-sm-4">Clinic</th>
                                            <th className="col-sm-1">Procedure</th>
                                            <th className="col-sm-3">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.upcomingAppointment.map((appointment) => {
                                                return (
                                                    <tr>
                                                        <td>{ new Date(appointment.date).toLocaleDateString('en-US') }</td>
                                                        <td>{ appointment.time }</td>
                                                        <td>
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
                                                        <td>{ appointment.procedure }</td>
                                                        <td> 
                                                            {/* <button>
                                                                <Link to={{
                                                                    pathname: '/EditAppointment',
                                                                    state: {
                                                                        appointment: appointment,
                                                                        userLoggedIn: this.props.userLoggedIn
                                                                    }
                                                                }}><i className="fa fa-edit fa-2x"></i>
                                                                </Link>
                                                            </button>

                                                            <button onClick={() => this.confirmDeleteAppointment(appointment)}>
                                                                <i className="fa fa-trash fa-2x"></i>
                                                            </button> */}
                                                            Check Wait Time / Check-in
                                                        </td> 
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6"><h5 className="mb-0">Past Appointment</h5></div>
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="col-sm-1">Date</th>
                                            <th className="col-sm-1">Time</th>
                                            <th className="col-sm-4">Clinic</th>
                                            <th className="col-sm-1">Procedure</th>
                                            <th className="col-sm-3">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.pastAppointment.map((appointment) => {
                                                return (
                                                    <tr>
                                                        <td>{ new Date(appointment.date).toLocaleDateString('en-US') }</td>
                                                        <td>{ appointment.time }</td>
                                                        <td>
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
                                                        <td>{ appointment.procedure }</td>
                                                        <td>Rate / Review</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Profile Information</h4>
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
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    // render() {
    //     // let user = this.state.user;
    //     // let userLoggedIn = this.state.userLoggedIn;
    //     // let imagesrc;
    //     // if (userLoggedIn){
    //     //     if (userLoggedIn.image){
    //     //         imagesrc =  '/images/users/'+userLoggedIn.image;
    //     //     } else {
    //     //         imagesrc =  '/images/users/default.png';
    //     //     }
    //     // }

    //     // if (user && user.type==='Doctor') {  // view doctor's page via doctor list
    //     //     // return <DoctorDetail doctor={user} facilityInfo={this.state.facilityInfo} userLoggedIn={userLoggedIn}/>
    //     // } else if (userLoggedIn.type==='Admin'){
    //     //     // return <AdminPanel/>
    //     // } else { // user view own profile page
    //     //     if (userLoggedIn.type==='Doctor' && this.state.doctorDetails){
    //     //         userLoggedIn.facility=this.state.doctorDetails.facilities
    //     //     }

    //         return (
    //             <React.Fragment>
    //                 <Banner/>
    //                 <div className="container new-container">
    //                     <div className="card">
    //                         <div className="card-body">
    //                             <h4 className="card-title">Information</h4>
    //                             <div className="row">
    //                                 <div className="col-sm-3"><h6 className="mb-0">Picture</h6></div>
    //                                 <p><img src={imagesrc} alt="profile" style={{width:'400px',height:'400px'}}/></p>
    //                             </div>
    //                             <div className="row">
    //                                 <div className="col-sm-3"><h6 className="mb-0">Full Name</h6></div>
    //                                 <div className="col-sm-9 text-secondary"> {userLoggedIn.firstName} {userLoggedIn.lastName}</div>
    //                             </div>
    //                             {userLoggedIn.type === "Doctor" &&
    //                                 <div className="row">
    //                                     <div className="col-sm-3"><h6 className="mb-0">Title</h6></div>
    //                                     <div className="col-sm-9 text-secondary"> {userLoggedIn.title}</div>
    //                                 </div>
    //                             }
    //                             <div className="row">
    //                                 <div className="col-sm-3"><h6 className="mb-0">Email</h6></div>
    //                                 <div className="col-sm-9 text-secondary"> {userLoggedIn.email}</div>
    //                             </div>
    //                             <div className="row">
    //                                 <div className="col-sm-3"><h6 className="mb-0">Phone Number</h6></div>
    //                                 <div className="col-sm-9 text-secondary"> {userLoggedIn.phone}</div>
    //                             </div>
    //                             <div className="row">
    //                                 <div className="col-sm-3"><h6 className="mb-0">Address</h6></div>
    //                                 <div className="col-sm-9 text-secondary"> {userLoggedIn.address}, {userLoggedIn.city}, {userLoggedIn.state} {userLoggedIn.zipcode}</div>
    //                             </div>

    //                             {userLoggedIn.type === "Doctor" &&
    //                                 <div className="row">
    //                                     <div className="col-sm-3"><h6 className="mb-0">Service</h6></div>
    //                                     <div className="col-sm-9 ">
    //                                         {userLoggedIn.services.map((service) => (
    //                                             <li key={service}>{service}</li>
    //                                         ))}
    //                                     </div>
    //                                 </div>
    //                             }
    //                             <Link to={{
    //                                     pathname: `/ProfileEdit/${userLoggedIn._id}`,
    //                                     state: { type: userLoggedIn.type, savedObj: userLoggedIn  }
    //                                 }}>
    //                                 Update Information
    //                             </Link>
    //                         </div>
    //                     </div>
    //                     {userLoggedIn.type === 'Doctor' && this.state.doctorDetails && 
    //                         <div className="card">
    //                         <div className="card-body">
    //                             <h4 className="card-title">Facility</h4>
    //                             <div className="row">
    //                                     <div className="col-sm-3"><h6 className="mb-0">Name</h6></div>
    //                                     <div className="col-sm-9 text-secondary"> {this.state.doctorDetails.facilities.facilityName}</div>
    //                                 </div>
    //                                 <div className="row">
    //                                     <div className="col-sm-3"><h6 className="mb-0">Availabilty</h6></div>
    //                                     <div className="col-sm-9 ">
    //                                         {Object.entries(this.state.doctorDetails.facilities.availability).map((day) => {
    //                                             if (day[1].length >0){
    //                                                 return <li key={day[0]}>{day[0]} {day[1][0]} - {day[1][1]}</li>
    //                                             } else{
    //                                                 return <li key={day[0]}></li>
    //                                             }
    //                                         })}
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     }
    //                     {userLoggedIn.type === 'Doctor' && this.state.doctorDetails &&
    //                         <div className="card">
    //                             <div className="card-body">
    //                                 <h4 className="card-title">Appointment Calendar</h4>
    //                                 <div className="row">
    //                                     <div className='container new-container'>    
    //                                         <div className='demo-app'>
    //                                             <div className='demo-app-main'>
    //                                             <FullCalendar
    //                                                 plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    //                                                 headerToolbar={{
    //                                                 left: 'prev,next today',
    //                                                 center: 'title',
    //                                                 right: 'dayGridMonth,timeGridWeek,timeGridDay'
    //                                                 }}
    //                                                 initialView='timeGridWeek'
    //                                                 editable={false}
    //                                                 selectable={false}
    //                                                 selectMirror={false}
    //                                                 dayMaxEvents={true}
    //                                                 weekends={this.state.weekendsVisible}
    //                                                 initialEvents={this.state.displayedAppointments} 
    //                                                 eventContent={this.renderEventContent}
    //                                             />
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     }
                        
    //                     {userLoggedIn.type === 'Patient' &&
    //                         <div className="card">
    //                             <div className="card-body">
    //                                 <h4 className="card-title">Appointment</h4>
    //                                 <div className="row">
    //                                     <div className="col-sm-6"><h4 className="mb-0">Upcoming Appointment</h4></div>
    //                                     <table className="table">
    //                                         <thead>
    //                                         <tr>
    //                                             <th>Date</th>
    //                                             <th>Time</th>
    //                                             <th>Doctor</th>
    //                                             <th>Facility</th>
    //                                             <th>Procedure</th>
    //                                             <th>Actions</th>
    //                                         </tr>
    //                                         </thead>
    //                                         <tbody>
    //                                             {this.state.upcomingAppointment.map((appointment) => {
    //                                                 return (
    //                                                     <tr>
    //                                                         <td>{ new Date(appointment.date).toLocaleDateString('en-US') }</td>
    //                                                         <td>{ appointment.time }</td>
    //                                                         <td>{ appointment.doctorName }</td>
    //                                                         <td>{ appointment.facilityName }</td>
    //                                                         <td>{ appointment.procedure }</td>
    //                                                         {/* <td> 
    //                                                             <button>
    //                                                                 <Link to={{
    //                                                                     pathname: '/EditAppointment',
    //                                                                     state: {
    //                                                                         appointment: appointment,
    //                                                                         userLoggedIn: this.props.userLoggedIn
    //                                                                     }
    //                                                                 }}><i className="fa fa-edit fa-2x"></i>
    //                                                                 </Link>
    //                                                             </button>

    //                                                             <button onClick={() => this.confirmDeleteAppointment(appointment)}>
    //                                                                 <i className="fa fa-trash fa-2x"></i>
    //                                                             </button>
    //                                                         </td> */}
    //                                                     </tr>
    //                                                 )
    //                                             })}
    //                                         </tbody>
    //                                     </table>
    //                                 </div>
    //                                 <div className="row">
    //                                     <div className="col-sm-6"><h4 className="mb-0">Past Appointment</h4></div>
    //                                     <table className="table">
    //                                         <thead>
    //                                         <tr>
    //                                             <th>Date</th>
    //                                             <th>Time</th>
    //                                             <th>Doctor</th>
    //                                             <th>Facility</th>
    //                                             <th>Procedure</th>
    //                                         </tr>
    //                                         </thead>
    //                                         <tbody>
    //                                             {this.state.pastAppointment.map((appointment) => {
    //                                                 return (
    //                                                     <tr>
    //                                                         <td>{ new Date(appointment.date).toLocaleDateString('en-US') }</td>
    //                                                         <td>{ appointment.time }</td>
    //                                                         <td>{ appointment.doctorName }</td>
    //                                                         <td>{ appointment.facilityName }</td>
    //                                                         <td>{ appointment.procedure }</td>
    //                                                     </tr>
    //                                                 )
    //                                             })}
    //                                         </tbody>
    //                                     </table>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     }
    //                 </div>
    //             </React.Fragment>
    //         )
    //     }
    // }
}