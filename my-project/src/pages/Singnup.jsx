import React, { useState } from 'react';

const Singnup = () => {
    // 1. This state holds your data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState("");

    // 2. This function updates the state when you type
    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    const handleSingnupSubmit = async (e) => {
        e.preventDefault();
        setMessage("Processing singnup...");
        try {
            const response = await fetch('http://127.0.0.1:8000/singnup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) setMessage("Singnup successful!");
            else setMessage(data.detail || "Singnup failed.");
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.iconContainer}>
                <div style={styles.icon}>🔓</div>
            </div>
            
            <h2 style={styles.title}>Singn up for your account</h2>

            <div style={styles.card}>
                <form onSubmit={handleSingnupSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email address</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="you@example.com" 
                            value={formData.email} // CRITICAL: This allows typing
                            onChange={handleChange} 
                            style={styles.input}
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            value={formData.password} // CRITICAL: This allows typing
                            onChange={handleChange} 
                            style={styles.input}
                            required 
                        />
                    </div>

                    <button type="submit" style={styles.button}>Singn up</button>
                </form>

                {message && <p style={styles.statusMessage}>{message}</p>}

                <div style={styles.footerText}>
                    Already a member? <a href="/login" style={styles.link}>Login here</a>
                </div>
            </div>
        </div>
    );
};

// Styles to keep that clean modern look
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        backgroundColor: '#f9fafb',
        padding: '20px'
    },
    iconContainer: {
        marginBottom: '15px',
        backgroundColor: '#6366f1',
        padding: '10px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: { fontSize: '24px', color: 'white' },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '30px'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '14px', fontWeight: '500', color: '#374151', textAlign: 'left' },
    input: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '16px',
    },
    button: {
        padding: '12px',
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    statusMessage: { textAlign: 'center', marginTop: '15px', color: '#4f46e5', fontSize: '14px' },
    footerText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' },
    link: { color: '#4f46e5', textDecoration: 'none', fontWeight: '500' }
};

export default Singnup;