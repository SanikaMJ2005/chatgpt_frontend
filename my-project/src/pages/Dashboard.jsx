import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("User");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate('/login');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>⚡</div>
                    <span style={styles.logoText}>ChatGPT</span>
                </div>
                
                <nav style={styles.nav}>
                    <div style={styles.navItem}>🏠 Overview</div>
                    <div style={styles.navItemActive}>💬 Conversations</div>
                    <div style={styles.navItem}>📊 Analytics</div>
                    <div style={styles.navItem}>⚙️ Settings</div>
                </nav>

                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.greeting}>Good Morning, {userEmail} 📊</h1>
                        <p style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div style={styles.searchBar}>
                        <input type="text" placeholder="Search..." style={styles.searchInput} />
                    </div>
                </header>

                {/* Top Stats Grid */}
                <div style={styles.statsGrid}>
                    <StatCard title="TOTAL CONVERSATIONS" value="1,284" trend="+12.5%" color="#8b5cf6" icon="💬" />
                    <StatCard title="TOKENS USED" value="45.76" trend="+8.1%" color="#f59e0b" icon="⚡" />
                    <StatCard title="ACTIVE SESSIONS" value="3" trend="-2" color="#10b981" icon="🖥️" trendDown />
                    <StatCard title="SAVED PROMPTS" value="56" trend="-4" color="#3b82f6" icon="🔖" trendDown />
                </div>

                <div style={styles.bottomSection}>
                    {/* Quick Actions */}
                    <div style={styles.quickActions}>
                        <h3 style={styles.sectionTitle}>✨ Quick Actions</h3>
                        <div style={styles.actionGrid}>
                            <div style={{...styles.actionCard, backgroundColor: '#6366f1'}}>New Chat</div>
                            <div style={{...styles.actionCard, backgroundColor: '#0ea5e9'}}>Browse Templates</div>
                            <div style={{...styles.actionCard, backgroundColor: '#f59e0b'}}>View History</div>
                            <div style={{...styles.actionCard, backgroundColor: '#10b981'}}>API Keys</div>
                        </div>
                    </div>

                    {/* Usage Progress */}
                    <div style={styles.usageCard}>
                        <h3 style={styles.sectionTitle}>📊 Model Usage This Month</h3>
                        <ProgressBar label="GPT-4o" progress="72%" color="#8b5cf6" />
                        <ProgressBar label="GPT-4o Mini" progress="45%" color="#0ea5e9" />
                        <ProgressBar label="DALL-E" progress="28%" color="#f59e0b" />
                        <ProgressBar label="Whisper" progress="15%" color="#10b981" />
                    </div>
                </div>
            </main>
        </div>
    );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, trend, color, icon, trendDown }) => (
    <div style={styles.statCard}>
        <div style={styles.statHeader}>
            <span style={styles.statTitle}>{title}</span>
            <div style={{...styles.statIcon, backgroundColor: color}}>{icon}</div>
        </div>
        <div style={styles.statValue}>{value}</div>
        <div style={{...styles.statTrend, color: trendDown ? '#ef4444' : '#10b981'}}>
            {trend} <span style={{color: '#9ca3af', fontSize: '12px'}}>vs last week</span>
        </div>
    </div>
);

const ProgressBar = ({ label, progress, color }) => (
    <div style={{marginBottom: '15px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: '#e5e7eb', fontSize: '14px', marginBottom: '5px'}}>
            <span>{label}</span>
            <span>{progress}</span>
        </div>
        <div style={styles.progressBase}>
            <div style={{...styles.progressFill, width: progress, backgroundColor: color}}></div>
        </div>
    </div>
);

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#0b0e14', color: '#fff', fontFamily: 'Inter, sans-serif' },
    sidebar: { width: '260px', backgroundColor: '#171923', padding: '24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2d3748' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' },
    logoIcon: { backgroundColor: '#6366f1', padding: '8px', borderRadius: '8px', fontSize: '20px' },
    logoText: { fontSize: '20px', fontWeight: 'bold' },
    nav: { flex: 1 },
    navItem: { padding: '12px', cursor: 'pointer', borderRadius: '8px', color: '#9ca3af', marginBottom: '8px' },
    navItemActive: { padding: '12px', backgroundColor: '#2d3748', borderRadius: '8px', color: '#fff', marginBottom: '8px' },
    logoutBtn: { padding: '12px', backgroundColor: 'transparent', border: '1px solid #374151', color: '#fff', borderRadius: '8px', cursor: 'pointer' },
    main: { flex: 1, padding: '32px', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    greeting: { fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' },
    dateText: { color: '#9ca3af', fontSize: '14px' },
    searchInput: { backgroundColor: '#171923', border: '1px solid #2d3748', color: '#fff', padding: '10px 20px', borderRadius: '10px', width: '250px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
    statCard: { backgroundColor: '#171923', padding: '20px', borderRadius: '16px', border: '1px solid #2d3748' },
    statHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
    statTitle: { fontSize: '12px', color: '#9ca3af', fontWeight: '600' },
    statIcon: { padding: '8px', borderRadius: '10px', fontSize: '18px' },
    statValue: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' },
    statTrend: { fontSize: '14px', fontWeight: '600' },
    bottomSection: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' },
    quickActions: { backgroundColor: '#171923', padding: '24px', borderRadius: '16px', border: '1px solid #2d3748' },
    actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' },
    actionCard: { padding: '20px', borderRadius: '12px', textAlign: 'center', fontWeight: '600', cursor: 'pointer' },
    usageCard: { backgroundColor: '#171923', padding: '24px', borderRadius: '16px', border: '1px solid #2d3748' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
    progressBase: { width: '100%', height: '8px', backgroundColor: '#2d3748', borderRadius: '4px' },
    progressFill: { height: '100%', borderRadius: '4px' }
};

export default Dashboard;