// components/AboutUs.tsx
import React from 'react';
import ServicesSection from './ServicesSection';

const AboutUs: React.FC = () => (
    <section style={{
        padding: '50px 20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        marginBottom: '50px'
    }}>
        <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px'
        }}>
            About Us
        </h2>
        <p style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
            At Charikaty, our mission is to provide you with the most comprehensive and accurate
            information about businesses in Morocco. Whether you are looking to invest, find new
            opportunities, or simply learn more about the thriving business landscape in our country,
            we are here to help you every step of the way.
        </p>
        <ServicesSection />
    </section>
);

export default AboutUs;
