import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <footer className="footer-wrapper footer-one">
                <div className="footer-widgets-wrapper section-bg text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-lg-3 offset-lg-1 col-12">
                                <div className="single-footer-widget">
                                    <div className="f-widget-title">
                                        <h2>About Us</h2>
                                    </div>
                                    <div className="widegts-content">
                                        <p>CS 6326 Team 12
                                        <br /> University of Texas at Dallas</p>
                                        <p>800 W Campbell Rd 
                                        <br />Richardson, TX 75080</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer
