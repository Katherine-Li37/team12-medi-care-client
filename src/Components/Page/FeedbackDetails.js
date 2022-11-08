import React, { Component } from 'react';
import Axios from 'axios';
import Banner from '../Header/Banner';
import { Rating } from 'react-simple-star-rating'
import { Link } from 'react-router-dom';
import env from '../../config_env.json';

export default class FeedbackDetails extends Component {
    constructor(props) {
        super(props);
        this.state ={
            appointment: this.props.location.state.appointment,
            userLoggedIn: this.props.location.state.userLoggedIn,

            rating: null,
            comment: null,

            submitSuccess: false
        }       
    }

    setRating = (event) => {
        this.setState({
            rating: event.toString()
        })
    }

    setComment = (event) => {
        this.setState({
            comment: event.target.value
        })
    }

    submitFeedback = () => {
        Axios({
          method: 'POST',
          data: {
            appointmentID: this.state.appointment._id,
            rating: this.state.rating,
            comment: this.state.comment,
          },
          url: env.api + '/feedbacks/create'
        }).then((res) => {
            if(res.data.success){
                this.setState({
                    submitSuccess: true
                })
            } 
        });

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
              ifCheckedIn: this.state.appointment.ifCheckedIn,
              ifRated: true
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
        
        const date =new Date(this.state.appointment.date)
        const dateFormat= `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return (
            <React.Fragment>
                <Banner/>
                { this.state.submitSuccess===false && 
                <div className="user-form-wrapper">
                    <div className="container">
                        <div className="user-form-one">
                            <h1>Rate / Review</h1>
                            <h4>Please provide the rating and feedback for your view at {this.state.appointment.clinicName} on {dateFormat}</h4>
                            <div className="col-lg-12 col-md-12 col-12">
                                <label>Rating</label>
                                <Rating
                                    // fillColor="#BADA55"
                                    // allowHalfIcon
                                    // tooltipArray={['Terrible', 'Bad', 'Average', 'Good', 'Awesome']}
                                    // showTooltip
                                    transition
                                    onClick={this.setRating}
                                    ratingValue={this.state.rating}
                                />
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                                <textarea placeholder="Feedback / Comment" onChange={this.setComment}/>
                            </div>
                            
                            <div>
                                <button className="contact-submit-btn" onClick={this.submitFeedback}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                }
                { this.state.submitSuccess===true && 
                <div className="user-form-wrapper">
                    <div className="container">
                        <div className="user-form-one">
                            <h1>Rate / Review</h1>
                            <img src={require("../../assets/img/success.png") } alt="success-feedback" />
                            <h4>Feedback submitted</h4>
                            <Link>Claim your $5 rewards here</Link>
                        </div>
                    </div>
                </div>
                }
            </React.Fragment>
        )
    }
}