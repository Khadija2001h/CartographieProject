import React from 'react';
import '../styles/global.css';

const ServicesSection: React.FC = () => (
    <section className="services-section">
        <div className="service-card">
            <img src="/assets/téléchargement-removebg-preview.png" alt="Geolocation Icon" className="service-icon" />
            <h3 className="service-title">Service de Géolocalisation</h3>
            <p className="service-description">Localisez les entreprises au Maroc selon le secteur d'activité, la forme juridique et d'autres critères. Trouvez facilement les entreprises florissantes près de vous.</p>
        </div>
        <div className="service-card">
            <img src="/assets/illustration-of-ai-robot-icon-in-dark-color-and-white-background-vector-removebg-preview.png" alt="Intelligent Assistance Icon" className="service-icon" />
            <h3 className="service-title">Assistance Intelligente sur la Loi Business</h3>
            <p className="service-description">Bénéficiez de notre assistance intelligente sur la législation des affaires au Maroc. Restez informé et conforme aux lois en vigueur pour optimiser votre activité.</p>
        </div>
        <div className="service-card">
            <img src="/assets/téléchargement-removebg-preview (3).png" alt="Business News Icon" className="service-icon" />
            <h3 className="service-title">Actualités Business au Maroc</h3>
            <p className="service-description">Suivez les dernières nouveautés et tendances du monde des affaires au Maroc. Restez à jour avec nos rapports et analyses des marchés pour saisir les meilleures opportunités.</p>
        </div>
    </section>
);

export default ServicesSection;