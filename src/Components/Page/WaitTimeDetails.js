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

            waitInQueue: null,
            checkInSuccess: false
        }       
    }

    // componentDidMount() {
    //     fetch(env.api + '/appointments/clinic/' + this.state.clinic._id.toString())
    //     .then(res => res.json())
    //     .then((data) => {
    //         this.countWaitInQueue(data);
    //     })
    //     .catch(console.log)
    // }

    // countWaitInQueue=(appointments)=>{

    // }

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
            ifCheckedIn: true
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



    // TODO: Enable queue info check in only 30 minute earlier
    render() {
        const appointmentDate =new Date(this.state.appointment.date)
        const appointmentDateFormat= `${appointmentDate.getMonth() + 1}/${appointmentDate.getDate()}/${appointmentDate.getFullYear()}`;
        const currentDate = new Date()
        const currentDateFormat= `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        const currentTime = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() ;

        return (
            <React.Fragment>
                <Banner/>
                { this.state.checkInSuccess===false && this.state.appointment.ifCheckedIn!==true && 
                <div className="user-form-wrapper">
                    <div className="container">
                        <div className="user-form-one">
                            <h1>Virtual Queue</h1>
                            <h2>Current time:  {currentDateFormat} {currentTime}</h2>
                            <h2>Your appointment time: {appointmentDateFormat} {this.state.appointment.time}</h2>
                            <h2>People in queue: 1 </h2>
                            <h2>Estimated wait time: 30 minutes</h2>
                            
                            <button className="contact-submit-btn" onClick={this.checkIn}>Check in</button>
                        </div>
                    </div>
                </div>
                }
                { (this.state.checkInSuccess===true || this.state.appointment.ifCheckedIn===true)&& 
                <div className="user-form-wrapper">
                    <div className="container">
                        <div className="user-form-one">
                            <h1>Virtual Queue</h1>
                            <img src={require("../../assets/img/success.png") } alt="success-feedback" />
                            <h2>Checked in successfully.</h2>
                            <h3>Please wait to be called for your appointment.</h3>
                        </div>
                    </div>
                </div>
                }
            </React.Fragment>
        )
    }
}