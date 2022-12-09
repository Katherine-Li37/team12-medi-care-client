import React, { Component } from 'react';
import Axios from 'axios';
import Banner from '../Header/Banner';
import env from '../../config_env.json';

import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const weekday = new Array(7);
weekday[0] = 'Sunday';
weekday[1] = 'Monday';
weekday[2] = 'Tuesday';
weekday[3] = 'Wednesday';
weekday[4] = 'Thursday';
weekday[5] = 'Friday';
weekday[6] = 'Saturday';

let eventGuid = 0;

export default class EditAppointment extends Component {
    constructor(props) {
        super(props);
    
        this.state ={
            // confirm logged-in
            userLoggedIn: this.props.location.state.userLoggedIn,
            appointmentID: this.props.location.state.appointment._id,
            appointment: null,
            clinic: null,

            hours: null,
            existedAppointments: [],
            displayedAppointments: [],

            serviceSelected: null,
            dateSelected: null,
            availableTimeList: [],
            timeSelected: null,
            buttonEnabled: false,
            updateAppointmentSuccess: false,

            weekendsVisible: true,
            currentEvents: []
        };
    }

    async componentDidMount() {
        fetch(env.api + '/appointments/appointment/' + this.state.appointmentID)
        .then(res => res.json())
        .then((data) => {
            this.setState({ appointment: data[0] },
                this.loadAppointmentByClinic(data[0].clinicID)
            );
        })
        .catch(console.log)
    }

    loadAppointmentByClinic = (clinicID) =>{
        fetch(env.api + '/clinics/' + clinicID)
        .then(res => res.json())
        .then((data) => {
            this.setState({ 
                clinic: data,
                serviceSelected: this.state.appointment.procedure,
                dateSelected: new Date(this.state.appointment.date),
                // timeSelected: this.state.appointment.time,
                buttonEnabled: true, 
            });
            this.getExistedAppointmentByClinic(clinicID)
            this.getWorkHours();
        })
        .catch(console.log)     
    }

    getExistedAppointmentByClinic = (clinicID) => {
        fetch(env.api + '/appointments/clinic/' + clinicID)
        .then(res => res.json())
        .then((data) => {
            this.setState({ existedAppointments: data });
            this.displayAppointments(data);
            this.loadTimeSlots(new Date(this.state.appointment.date));
        })
        .catch(console.log)
    }


    getWorkHours=()=>{
        const dateList = [];
        Object.keys(this.state.clinic.availability).forEach((day)=>{
            let hours = this.state.clinic.availability[day]
            if (hours.length){
                dateList.push({day, hours});
            }
        });
        this.state.hours=dateList
        
    }
    
    createEventId = () => {
        return String(eventGuid++)
    }
    
    displayAppointments=(appointments)=>{
        let appointmentEvents =[];
        appointments.forEach((appointment)=>{
            if(appointment.status === "active"){
                let event = null
                if (appointment.patientID === this.state.userLoggedIn._id){
                    event = {
                        id: this.createEventId(),
                        title: appointment.patientName + ' - ' + appointment.procedure,
                        start: new Date(appointment.date).toISOString().replace(/T.*$/, '') + 'T' + appointment.time // YYYY-MM-DD
                    }
                } else {
                    event = {
                        id: this.createEventId(),
                        title: "Booked", // appointment.patientName + ' - ' + appointment.procedure,
                        start: new Date(appointment.date).toISOString().replace(/T.*$/, '') + 'T' + appointment.time // YYYY-MM-DD
                    }
                }
                appointmentEvents.push(event);
            }
        });
        this.setState({
            displayedAppointments: appointmentEvents
        });
    }

    serviceChange =(e)=>{
        this.setState({
            serviceSelected: e.target.value
        }, this.checkIfEnableButton());
    }

    dateChange=(date)=> {
        this.setState({
          dateSelected: date,
          availableTimeList: []
        }, this.checkIfEnableButton());
        this.loadTimeSlots(date);
    }

    timeChange =(e)=>{
        this.setState({
            timeSelected: e.target.value
        }, this.checkIfEnableButton());
    }

    loadTimeSlots=(date)=>{
        let dayOfWeek = weekday[date.getDay()]
        let index = this.state.hours.findIndex((day) => day.day === dayOfWeek);
        let hours = index>=0? this.state.hours[index].hours : null;
        if (hours){
            let startTime = new Date(date.toLocaleDateString('en-US') + ' ' + hours[0]);
            let endTime = new Date(date.toLocaleDateString('en-US') + ' ' + hours[1]);
            
            let timeSlotArray=['Select Time'];
            let timeSlot = startTime;
            while (timeSlot.getTime()< endTime.getTime()){
                timeSlotArray.push(timeSlot.toLocaleTimeString('it-IT'));
                timeSlot.setHours(timeSlot.getHours(), timeSlot.getMinutes()+30);
            }
            this.filterOutExistedAppointment(date, timeSlotArray);
        }
    }

    filterOutExistedAppointment = (date, timeSlotArray) => {
        let existedAppointmentTime = [];
        this.state.existedAppointments.forEach((appointment)=>{
            if(appointment.status === "active" && date.getTime() === new Date(appointment.date).getTime()){
                existedAppointmentTime.push(appointment.time);
            }
        })
        var index = existedAppointmentTime.indexOf(this.state.appointment.time);
        if (index !== -1) {
            existedAppointmentTime.splice(index, 1);
        }
        const filteredArray = timeSlotArray.filter(value => !existedAppointmentTime.includes(value));
        this.setState({
            availableTimeList: filteredArray,
            timeSelected: this.state.appointment.time
        })
        this.checkIfEnableButton();
    }

    checkIfEnableButton=()=>{
        if (this.state.serviceSelected && this.state.dateSelected && this.state.timeSelected){
            this.setState({buttonEnabled: true});
        } else{
            this.setState({buttonEnabled: false});
        }
    }

    onSubmit = () => {
        Axios({
            method: 'POST',
            data: {
                clinicID: this.state.appointment.clinicID,
                clinicName: this.state.appointment.clinicName,
                patientID: this.state.appointment.patientID,
                patientName: this.state.appointment.patientName,
                date: this.state.dateSelected,
                time: this.state.timeSelected,
                procedure: this.state.serviceSelected,
                status: this.state.appointment.status,
                ifCheckedIn: this.state.appointment.ifCheckedIn,
                ifRated: this.state.appointment.ifRated
            },
            url: env.api + '/appointments/update/' + this.state.appointment._id
        }).then((res) => {
            if(res.data){
                this.setState({
                    updateAppointmentSuccess: true,
                })
            } 
        });
    };

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
        const procedureList = ['Surgery', 'Check-up', 'Follow-up']
        const date = new Date();
        const tomorrow = new Date(date.getFullYear(), date.getMonth(), (date.getDate() + 1));

        return (
            <React.Fragment>
                <Banner/>
                {this.state.clinic && 
                    <div className='contact-form-wraper'>
                        <div className='container new-container'>
                            <h3>Edit Appointment at {this.state.clinic.name}</h3>
                            <div>
                                <div className='col-lg-6 col-md-6 col-12 date-field'>
                                    <label>Date: </label>
                                    <DatePicker
                                        selected={ this.state.dateSelected }
                                        onChange={ this.dateChange }
                                        name='date'
                                        dateFormat='MM/dd/yyyy'
                                        minDate={tomorrow}
                                    />
                                </div>

                                {this.state.dateSelected && 
                                    <div className='col-lg-6 col-md-6 col-12'>
                                    <label>Time: </label>
                                    <select 
                                        value={this.state.timeSelected} 
                                        onChange={this.timeChange}
                                    >
                                        {this.state.availableTimeList.map((time) => 
                                            (<option value={time}>{time}</option>))
                                        }
                                    </select>
                                    </div>
                                }                            
                                
                                <div className='col-lg-6 col-md-6 col-12'>
                                    <label>Procedure: </label>
                                    <select 
                                        value={this.state.serviceSelected} 
                                        onChange={this.serviceChange}
                                    >
                                        {procedureList.map((procedure) => 
                                            (<option value={procedure}>{procedure}</option>))
                                        }
                                    </select>
                                </div>

                                {this.state.buttonEnabled &&
                                    <button className='contact-submit-btn' onClick={this.onSubmit}>Submit</button>
                                }   
                                {!this.state.buttonEnabled &&
                                    <button className='contact-submit-btn-disabled'>Submit</button>
                                }   
                            </div>
                            {this.state.updateAppointmentSuccess && <span className='error-msg'>Appointment updated</span>}
                        </div>
                    </div>
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
            </React.Fragment>
        )
    }
}