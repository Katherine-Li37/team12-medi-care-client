import React, { Component } from 'react';
import Axios from 'axios';
import Banner from '../Header/Banner';
import env from '../../config_env.json';

export default class WaitTimeDetails extends Component {
    constructor(props) {
        super(props);
        this.state ={
            appointment: this.props.location.state.appointment,
            userLoggedIn: this.props.location.state.userLoggedIn,

            appointmentDateFormat: null,
            currentDateFormat: null,
            currentTimeFormat: null,

            waitCountInQueue: 0,
            waitTimeFormat: "",
            checkInSuccess: false,
            ifOneHourBeforeAppointment: false
        }       
    }

    componentDidMount() {
        this.loadDateFormat();
        this.fetchAllAppointmentsByClinic();
    }

    loadDateFormat = () => {
        const appointmentDate =new Date(this.state.appointment.date);
        const currentDate = new Date();
        const appointmentDateFormatTemp= `${appointmentDate.getMonth() + 1}/${appointmentDate.getDate()}/${appointmentDate.getFullYear()}`;
        const currentDateFormatTemp = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        const currentTimeFormatTemp =  currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds(); 
        this.setState({
            appointmentDateFormat: appointmentDateFormatTemp,
            currentDateFormat: currentDateFormatTemp,
            currentTimeFormat: currentTimeFormatTemp 
        }, this.checkIfOneHourBeforeAppointment(appointmentDateFormatTemp, this.state.appointment.time, currentDateFormatTemp, currentTimeFormatTemp))
    }

    checkIfOneHourBeforeAppointment = (appointmentDate, appointmentTime, currentDate, currentTime) => {
        const appointmentAt = new Date(appointmentDate + ' ' + appointmentTime);
        const currentAt = new Date(currentDate + ' ' + currentTime);
        const diff = (appointmentAt.getTime() - currentAt.getTime()) / 60000; // in minutes
        if (diff <= 60) { // within 1 hour of appointment time
            this.setState({
                ifOneHourBeforeAppointment: true
            })
        }
    }    
    
    fetchAllAppointmentsByClinic = () => {
        fetch(env.api + '/appointments/clinic/' + this.state.appointment.clinicID)
        .then(res => res.json())
        .then((data) => {
            this.countWaitInQueue(data)
        })
        .catch(console.log)
    }

    countWaitInQueue = (appointments) => {
        let waitCount = 0;
        const currentAt = new Date(this.state.appointmentDateFormat + ' ' + this.state.appointment.time);

        appointments.forEach((appointment)=>{
            let appointmentAt = new Date(new Date(appointment.date).toISOString().replace(/T.*$/, '') + 'T' + appointment.time)
            let diff = (appointmentAt.getTime() - currentAt.getTime()) / 60000; // in minutes
            if (diff <= 60 && diff > 0) { // get appointment count within next hour
                waitCount++
            }
        })
        const waitTime = 30 * waitCount; // default wait time to be 30 minutes per patient
        let waitTimeFormat = '';

        if (waitTime > 60) {
            const hours = (waitTime / 60);
            const rhours = Math.floor(hours);
            const minutes = (hours - rhours) * 60;
            const rminutes = Math.round(minutes);
            waitTimeFormat = rhours + " hour(s) and " + rminutes + " minute(s)";
        } else {
            waitTimeFormat = waitTime+ " minute(s)";
        }
        
        this.setState({
            waitCountInQueue: waitCount,
            waitTimeFormat: waitTimeFormat
        });
    }

    checkIn = () => {
        Axios({
          method: 'POST',
          data: {
            clinicID: this.state.appointment.clinicID,
            clinicName: this.state.appointment.clinicName,
            patientID: this.state.appointment.patientID,
            patientName: this.state.appointment.patientName,
            date: this.state.appointment.date,
            time: this.state.appointment.time,
            procedure: this.state.appointment.procedure,
            status: this.state.appointment.status,
            ifCheckedIn: true,
            ifRated: this.state.appointment.ifRated
          },
          url: env.api + '/appointments/update/' + this.state.appointment._id
        }).then((res) => {
            if(res.data.success){
                this.setState({
                    checkInSuccess: true
                })
            } 
        });
    };

    render() {
        return (
            <React.Fragment>
                <Banner/>
                
                <div className="user-form-wrapper">
                    <div className="container">
                        <div className="user-form-one">
                            <h1>Virtual Queue</h1>
                            <h2>Current time:  {this.state.currentDateFormat} {this.state.currentTimeFormat}</h2>
                            <h2>Your appointment time: {this.state.appointmentDateFormat} {this.state.appointment.time}</h2>
                            <h2>People in queue: {this.state.waitCountInQueue}</h2> 
                            <h2>Estimated wait time: {this.state.waitTimeFormat}</h2>
                            
                            {((this.state.ifOneHourBeforeAppointment && this.state.checkInSuccess!==true) || this.state.appointment.ifCheckedIn!==true) && <button className="contact-submit-btn" onClick={this.checkIn}>Check in</button>}

                            { (this.state.checkInSuccess===true || this.state.appointment.ifCheckedIn===true) && 
                                <div>
                                    <img src={require("../../assets/img/success.png") } alt="success-feedback" />
                                    <h2>Checked in successfully.</h2>
                                    <h3>Please wait to be called for your appointment.</h3>
                                </div>
                            }
                        </div>
                    </div>
                </div>


            </React.Fragment>
        )
    }
}