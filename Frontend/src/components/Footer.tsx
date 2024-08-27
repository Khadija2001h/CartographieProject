import React from 'react';
import '../styles/global.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram, FaGoogle } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/logowhite-removebg-preview.png" alt="Logo" />
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <FaGoogle />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </div>
        <div className="footer-links">
          <a href="/ui/home">Home</a>
          <a href="/ui/actualites">News</a>
          <a href="/ui/home#about-us">About</a>
          <a href="#contact">Contact Us</a>
          <a href="#team">Our Team</a>
        </div>
        <div className="footer-copy">
          <p>&copy; 2024 Charikaty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
