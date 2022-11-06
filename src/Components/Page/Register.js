import React, { Component } from 'react';
import Axios from 'axios';
import validator from 'validator';
import {Link} from 'react-router-dom';
import Banner from '../Header/Banner';
import env from '../../config_env.json';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state ={
            typing: false,
            typingTimeout: 0,
            
            email: '',
            ifEmailFormat: true,
            ifEmailExist: false,
            password: '',
            ifStrongPassword: true,
            repeatPassword: '',
            ifPasswordMatch: true,
            firstName: '',
            lastName: '',
            phone: '',
            ifPhoneFormat: true,
            ifPhoneExist: false,

            buttonEnabled: false,
            registerSuccess: null,
        }       
    }

    setEmail = (event) => {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }
     
         this.setState({
            email: event.target.value,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.checkIfEmailFormat();
                this.checkIfEmailExists();
            }, 1000)
         });
    }

    checkIfEmailFormat =()=>{
        if (validator.isEmail(this.state.email)) {
            this.setState({ifEmailFormat:true});
          } else {
            this.setState({ifEmailFormat:false});
          }
        this.checkIfEnableButton();
    }

    checkIfEmailExists = () => {
        fetch(env.api + '/users/register/email/' + this.state.email)
          .then(res => res.json())
          .then((data) => {
            if (data.length!==0){
                this.setState({ifEmailExist: true});
                this.checkIfEnableButton();
            } else {
                this.setState({ifEmailExist: false});
                this.checkIfEnableButton();
            }
          })
          .catch(console.log)
    }

    setPassword = (event) => {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }
     
         this.setState({
            password: event.target.value,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.checkPasswordStrength();
            }, 1000)
         });
    }

    checkPasswordStrength = () => {
        if (this.state.password.length >= 6) {
              this.setState({ifStrongPassword:true});
            } else {
              this.setState({ifStrongPassword:false});
            }
        this.checkIfEnableButton();
    }

    setRepeatPassword = (event) => {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }
     
         this.setState({
            repeatPassword: event.target.value,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.checkIfPasswordMatch();
            }, 1000)
         });
    }

    checkIfPasswordMatch=()=>{
        if(this.state.password === this.state.repeatPassword){
            this.setState({ifPasswordMatch: true })
        } else{
            this.setState({ifPasswordMatch: false })
        }
        this.checkIfEnableButton();
    }

    setFirstName = (event) => {
        this.setState({
            firstName: event.target.value
        })
    }

    setLastName = (event) => {
        this.setState({
            lastName: event.target.value
        })
    }

    setPhone = (event) => {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }
     
         this.setState({
            phone: event.target.value,
            typing: false,
            typingTimeout: setTimeout(() => {
                this.checkIfPhoneFormat();
                this.checkIfPhoneExists();
            }, 1000)
         });
    }
    
    checkIfPhoneFormat =()=>{
        if (validator.isMobilePhone(this.state.phone)) {
            this.setState({ifPhoneFormat:true});
          } else {
            this.setState({ifPhoneFormat:false});
          }
        this.checkIfEnableButton();
    }

    checkIfPhoneExists = () => {
        fetch(env.api + '/users/register/phone/' + this.state.phone)
          .then(res => res.json())
          .then((data) => {
            if (data.length!==0){
                this.setState({ifPhoneExist: true});
                this.checkIfEnableButton();
            } else {
                this.setState({ifPhoneExist: false});
                this.checkIfEnableButton();
            }
          })
          .catch(console.log)
    }

    checkIfEnableButton=()=>{
        if ((this.state.email.length && this.state.ifEmailFormat && !this.state.ifEmailExist 
            && this.state.password.length && this.state.ifStrongPassword
            && this.state.repeatPassword.length && this.state.ifPasswordMatch
            && this.state.firstName.length && this.state.lastName.length
            && this.state.phone.length && this.state.ifPhoneFormat && !this.state.ifPhoneExist 
            )){
            this.setState({buttonEnabled: true});
        } else{
            this.setState({buttonEnabled: false});
        }
    }

    register = () => {
        Axios({
          method: 'POST',
          data: {
            username: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone
          },
          withCredentials: true,
          url: env.api + '/register',
        }).then((res) => {
            if(res.data.message==='User Created'){
                this.setState({
                    registerSuccess: true
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
                            <h1>Register</h1>
                                                    
                            <li><Link to='/LogIn'>Already have an account? Log in</Link></li>
                            
                            <div className="col-lg-12 col-md-12 col-12">
                                <input placeholder="Email" onChange={this.setEmail}/>
                            </div>  
                            {this.state.ifEmailExist && <span className="error-msg">Email exists</span>}  
                            {!this.state.ifEmailFormat && <span className="error-msg">Not valid email</span>}
                            
                            <div className="col-lg-12 col-md-12 col-12">
                                <input type="password" placeholder="Password" onChange={this.setPassword}/>
                            </div>
                            {!this.state.ifStrongPassword && <span className="error-msg">Password need to be with minimum length 6</span>}  
                            <div className="col-lg-12 col-md-12 col-12">
                                <input type="password" placeholder="Confirm Password" onChange={this.setRepeatPassword}/>
                            </div>  
                            {!this.state.ifPasswordMatch && <span className="error-msg">Password not match</span>}


                            <div className="col-lg-12 col-md-12 col-12">
                                <input placeholder="First Name" onChange={this.setFirstName}/>
                            </div>
                            <div className="col-lg-12 col-md-12 col-12">
                                <input placeholder="Last Name" onChange={this.setLastName}/>
                            </div>

                            <div className="col-lg-12 col-md-12 col-12">
                                <input placeholder="Phone Number" onChange={this.setPhone}/>
                            </div>  
                            {this.state.ifPhoneExist && <span className="error-msg">Phone number exists</span>}  
                            {!this.state.ifPhoneFormat && <span className="error-msg">Not valid phone number, please enter digits only.</span>}

                            <div>
                                {this.state.buttonEnabled &&
                                    <button className="contact-submit-btn" onClick={this.register}>Submit</button>
                                }   
                                {!this.state.buttonEnabled &&
                                    <button className="contact-submit-btn-disabled" >Submit</button>
                                }   
                                {this.state.registerSuccess===true && <span className="error-msg">New User created</span>}                                
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}