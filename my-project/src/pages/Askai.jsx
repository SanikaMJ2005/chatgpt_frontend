import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AskAI = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // Sends the user to the dashboard with the question in the URL
            navigate(`/dashboard?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div style={styles.wrapper}>
            <h1 style={styles.title}>What can I help with?</h1>
            
            <form onSubmit={handleSubmit} style={styles.inputContainer}>
                <input 
                    type="text" 
                    placeholder="Ask anything" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.input}
                />
            </form>

            <div style={styles.buttonGroup}>
                <button style={styles.pillButton}>📎 Attach</button>
                <button style={styles.pillButton}>🔍 Search</button>
                <button style={styles.pillButton}>📖 Study</button>
                <button style={styles.pillButton}>🎨 Create image</button>
            </div>

            <p style={styles.footerText}>
                By messaging ChatGPT, you agree to our Terms and have read our Privacy Policy.
            </p>
        </div>
    );
};

const styles = {
    wrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' },
    title: { fontSize: '32px', fontWeight: '600', color: '#111827', marginBottom: '24px' },
    inputContainer: { width: '100%', maxWidth: '640px', position: 'relative' },
    input: {
        width: '100%',
        padding: '16px 24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        fontSize: '18px',
        outline: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    buttonGroup: { display: 'flex', gap: '8px', marginTop: '16px' },
    pillButton: {
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        color: '#374151',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    footerText: { fontSize: '12px', color: '#9ca3af', marginTop: '24px' }
};

export default AskAI;