import React from 'react';

export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif',
      backgroundColor: '#f0f2f5'
    }}>
      <h1 style={{ color: '#1e3a8a', fontSize: '2.5rem', marginBottom: '10px' }}>🛡️ Police Bharti AI 🚀</h1>
      <p style={{ color: '#4b5563', fontSize: '1.2rem' }}>फ्रंटएंड सर्व्हर यशस्वीरीत्या कनेक्ट झाला आहे!</p>
    </div>
  );
}