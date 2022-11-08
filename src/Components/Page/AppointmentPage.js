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

export default class AppointmentPage extends Component {
    constructor(props) {
        super(props);
    
        this.state ={
            // confirm logged-in
            userLoggedIn: this.props.location.state.userLoggedIn,
            clinic: this.props.location.state.clinic,

            hours: null,
            existedAppointments: [],
            displayedAppointments: [],

            serviceSelected: 'Surgery',
            dateSelected: null,
            availableTimeList: [],
            timeSelected: null,
            buttonEnabled: false,
            createAppointmentSuccess: false,

            weekendsVisible: true,
            currentEvents: []
        };
        this.getWorkHours();
    }


    async componentDidMount() {
        fetch(env.api + '/appointments/clinic/' + this.state.clinic._id.toString())
        .then(res => res.json())
        .then((data) => {
            this.setState({ existedAppointments: data });
            this.displayAppointments(data);
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

    serviceChange =(e)=>{
        this.setState({
            serviceSelected: e.target.value
        }, this.checkIfEnableButton());
    }

    dateChange=(date)=> {
        this.setState({
          dateSelected: date
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
                timeSlot.setHours( timeSlot.getHours() + 1 );
            }
            this.filterOutExistedAppointment(date, timeSlotArray);
        }
    }

    filterOutExistedAppointment = (date, timeSlotArray) => {
        // let existedAppointmentTime = [];
        // this.state.existedAppointments.forEach((appointment)=>{
        //     if(date.getTime() === new Date(appointment.date).getTime()){
        //         existedAppointmentTime.push(appointment.time);
        //     }
        // })
        // const filteredArray = timeSlotArray.filter(value => !existedAppointmentTime.includes(value));
        const filteredArray = timeSlotArray;
        this.setState({
            availableTimeList: filteredArray,
            timeSelected: filteredArray[0]
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

    onSumbit = () => {
        Axios({
          method: 'POST',
          data: {
            clinicID: this.state.clinic._id,
            clinicName: this.state.clinic.name,
            patientID: this.state.userLoggedIn._id,
            patientName: this.state.userLoggedIn.firstName + ' ' + this.state.userLoggedIn.lastName,
            date: this.state.dateSelected,
            time: this.state.timeSelected,
            procedure: this.state.serviceSelected,
            status: 'active'
          },
          url: env.api + '/appointments/create',
        }).then((res) => {
            if(res.data){
                this.setState({
                    createAppointmentSuccess: true
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

        return (
            <React.Fragment>
                <Banner/>
                <div className='contact-form-wraper'>
                    <div className='container new-container'>
                        <h3>Schedule an Appointment at {this.state.clinic.name}</h3>
                        <div>
                            <div className='col-lg-6 col-md-6 col-12 date-field'>
                                <label>Date: </label>
                                <DatePicker
                                    selected={ this.state.dateSelected }
                                    onChange={ this.dateChange }
                                    name='date'
                                    dateFormat='MM/dd/yyyy'
                                    minDate={new Date()}
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
                                <button className='contact-submit-btn' onClick={this.onSumbit}>Submit</button>
                            }   
                            {!this.state.buttonEnabled &&
                                <button className='contact-submit-btn-disabled'>Submit</button>
                            }   
                        </div>
                        {this.state.createAppointmentSuccess && <span className='error-msg'>Appointment created</span>}
                    </div>
                </div>
                
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