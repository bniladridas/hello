// src/TermsOfService.js
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-light text-gray-800 mb-8">Terms of Service</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Gravity Blog. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the platform.
      </p>
      <h2 className="text-2xl font-light mb-4">1. User Agreement</h2>
      <p className="text-gray-700 mb-4">
        You agree to use the platform only for lawful purposes and in a manner that does not infringe on the rights of, or restrict or inhibit the use and enjoyment of the platform by any third party.
      </p>
      <h2 className="text-2xl font-light mb-4">2. Privacy</h2>
      <p className="text-gray-700 mb-4">
        Your privacy is important to us. We have a <a href="/privacy-policy" className="text-blue-500">Privacy Policy</a> that explains how we collect, use, and protect your information.
      </p>
      <h2 className="text-2xl font-light mb-4">3. Intellectual Property</h2>
      <p className="text-gray-700 mb-4">
        All content on the platform is the property of Gravity Blog or its content creators and is protected by copyright laws.
      </p>
      <h2 className="text-2xl font-light mb-4">4. Disclaimer</h2>
      <p className="text-gray-700 mb-4">
        The platform is provided "as is" without any warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted or error-free.
      </p>
    </div>
  );
};

export default TermsOfService;