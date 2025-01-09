import React from 'react';
import Header from './Header';
const Privacy = () => {
    return (
        <div>
            <Header />
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. This privacy statement explains the personal data our application processes, how our application processes it, and for what purposes.</p>
            <h2>Information We Collect</h2>
            <p>We collect data to provide better services to all our users. The data we collect includes:</p>
            <ul>
                <li>Information you provide to us directly.</li>
                <li>Information we get from your use of our services.</li>
            </ul>
            <h2>How We Use Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
                <li>Provide, operate, and maintain our services.</li>
                <li>Improve, personalize, and expand our services.</li>
                <li>Understand and analyze how you use our services.</li>
            </ul>
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@example.com.</p>
        </div>
    );
};

export default Privacy;