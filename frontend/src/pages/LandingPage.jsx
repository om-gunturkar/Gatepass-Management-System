import React from 'react';
import './LandingPage.css';
// NOTE: You will need to install a library like 'react-icons' (e.g., 'npm install react-icons')
// and import specific icons, or use your own custom SVG/images.
import { FiGitPullRequest, FiClock, FiUsers, FiHardDrive, FiSmartphone, FiBell, FiActivity, FiLock } from 'react-icons/fi';
import image from '../assets/Personal-Blog-Application.png'
import { useNavigate } from 'react-router-dom';

// --- Feature Data ---
const features = [
    { icon: FiActivity, title: "Automated Workflow", description: "Streamlines gatepass creation and approval." },
    { icon: FiGitPullRequest, title: "Digital Request Form", description: "Submit gatepass requests online easily." },
    { icon: FiHardDrive, title: "Centralized Digital Records", description: "Keeps all gatepass data securely stored." },
    { icon: FiBell, title: "Approval Notifications", description: "Instant alerts on gatepass status updates." },
    { icon: FiClock, title: "Real-Time Tracking", description: "Live monitoring of entries and exits." },
    { icon: FiLock, title: "Role-Based Access Control", description: "Secure access based on user roles." },
    { icon: FiSmartphone, title: "Mobile & Web Access", description: "Access system anytime, anywhere." },
    { icon: FiActivity, title: "Dashboard Overview", description: "Visual summary of gatepass activities." },
];

// --- Sub-Components ---

// Component for the header navigation - UPDATED NAVIGATION PATHS
const Header = ({ navigate }) => (
    <header className="header">
        <div className="logo">SecurePass</div>
        <div className="nav-buttons">
            <button
                className="button admin-login"
                // 🔑 CHANGE: Navigate directly to the dedicated AdminLogin route
                onClick={() => navigate('/admin-login')} 
            >
                Admin Login
            </button>

            {/* Student Login Button */}
            <button
                className="button student-login"
                // 🔑 CHANGE: Navigate directly to the dedicated StudentLogin route
                onClick={() => navigate('/student-login')} 
            >
                Student Login
            </button>
        </div>
    </header>
);

// Component for a single feature card
const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="feature-card">
        <div className="feature-icon-wrapper">
            <Icon className="feature-icon" size={24} />
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
    </div>
);

// --- Main Component ---

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <Header navigate={navigate} />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>
                        Streamline Campus Entry & Exit with Our <span className="highlight">Gatepass Management System</span>
                    </h1>
                    <p>
                        Enhance safety, track student movements, and simplify gatepass requests for students, staff, and visitors.
                    </p>
                    <button className="button pricing-button">Pricing</button>
                </div>
                <div className="hero-image-container">
                    <div className="hero-image-placeholder">
                        <img
                            src={image}
                            alt="Students entering a campus building monitored by a guard."
                            className="actual-hero-image"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>Features</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>

            {/* NOTE: You would add other sections (e.g., Footer) here */}
        </div>
    );
};

export default LandingPage;