/**
 * Footer Component
 * ================
 * The footer that appears at the bottom of all pages.
 * Contains:
 * - Company information
 * - Quick links
 * - Contact information
 * - Social media links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiSmartphone,
    FiMail,
    FiPhone,
    FiMapPin,
    FiInstagram,
    FiFacebook,
    FiTwitter,
    FiYoutube
} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Company Info Section */}
                <div className="footer-section footer-brand">
                    <Link to="/" className="footer-logo">
                        <FiSmartphone className="logo-icon" />
                        <span>MobileShop</span>
                    </Link>
                    <p className="footer-description">
                        Your one-stop destination for premium mobile phones and expert repair services.
                        Quality products, trusted service, and customer satisfaction guaranteed.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-link" aria-label="Facebook">
                            <FiFacebook />
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            <FiInstagram />
                        </a>
                        <a href="#" className="social-link" aria-label="Twitter">
                            <FiTwitter />
                        </a>
                        <a href="#" className="social-link" aria-label="YouTube">
                            <FiYoutube />
                        </a>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h4 className="footer-title">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Services Section */}
                <div className="footer-section">
                    <h4 className="footer-title">Our Services</h4>
                    <ul className="footer-links">
                        <li><Link to="/services">Screen Repair</Link></li>
                        <li><Link to="/services">Battery Replacement</Link></li>
                        <li><Link to="/services">Software Fix</Link></li>
                        <li><Link to="/services">Water Damage Repair</Link></li>
                        <li><Link to="/services">General Maintenance</Link></li>
                    </ul>
                </div>

                {/* Contact Info Section */}
                <div className="footer-section">
                    <h4 className="footer-title">Contact Us</h4>
                    <ul className="footer-contact">
                        <li>
                            <FiMapPin className="contact-icon" />
                            <span>123 Mobile Street, Tech City, TC 12345</span>
                        </li>
                        <li>
                            <FiPhone className="contact-icon" />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li>
                            <FiMail className="contact-icon" />
                            <span>support@mobileshop.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p className="copyright">
                        © {currentYear} MobileShop. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
