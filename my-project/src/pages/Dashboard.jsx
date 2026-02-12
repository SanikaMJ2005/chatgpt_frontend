import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState("User");
    const [currentQuery, setCurrentQuery] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // 1. Security Check
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        // 2. Listen for queries from the Home page (URL params)
        const params = new URLSearchParams(location.search);
        const queryFromUrl = params.get('q');
        
        if (queryFromUrl && queryFromUrl !== currentQuery) {
            setCurrentQuery(queryFromUrl);
            handleAiRequest(queryFromUrl);
        }
    }, [location, navigate, currentQuery]);

    const handleAiRequest = async (prompt) => {
        setIsLoading(true);
        setAiResponse(""); // Clear previous response
        try {
            const response = await fetch('http://127.0.0.1:8000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt }),
            });
            const data = await response.json();
            setAiResponse(data.response || "No response received from AI.");
        } catch (error) {
            setAiResponse("Error: Could not connect to the AI server. Is FastAPI running?");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    // For the search bar inside the dashboard header
    const onInternalSearch = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            const newPrompt = e.target.value;
            setCurrentQuery(newPrompt);
            handleAiRequest(newPrompt);
            e.target.value = ""; // Clear input after search
        }
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
                    <div style={styles.navItem} onClick={() => navigate('/')}>🏠 Home</div>
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
                        <h1 style={styles.greeting}>
                            {currentQuery ? `Results for "${currentQuery}"` : `Good Morning, ${userEmail} 👋`}
                        </h1>
                        <p style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div style={styles.searchBar}>
                        <input 
                            type="text" 
                            placeholder="Search something else..." 
                            style={styles.searchInput} 
                            onKeyDown={onInternalSearch}
                        />
                    </div>
                </header>

                {/* AI Output Area */}
                {currentQuery && (
                    <div style={styles.aiBox}>
                        <h3 style={{color: '#8b5cf6', marginBottom: '10px', fontWeight: 'bold'}}>AI Output</h3>
                        <div style={{lineHeight: '1.6', color: '#e5e7eb'}}>
                            {isLoading ? (
                                <div style={styles.pulse}>Thinking... 🧠</div>
                            ) : (
                                <p style={{whiteSpace: 'pre-wrap'}}>{aiResponse}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                    <StatCard title="TOTAL CONVERSATIONS" value="1,284" trend="+12.5%" color="#8b5cf6" icon="💬" />
                    <StatCard title="TOKENS USED" value="45.2K" trend="+8.1%" color="#f59e0b" icon="⚡" />
                    <StatCard title="ACTIVE SESSIONS" value="3" trend="-2" color="#10b981" icon="🖥️" trendDown />
                    <StatCard title="SAVED PROMPTS" value="56" trend="+4" color="#3b82f6" icon="🔖" />
                </div>

                <div style={styles.bottomSection}>
                    <div style={styles.quickActions}>
                        <h3 style={styles.sectionTitle}>✨ Quick Actions</h3>
                        <div style={styles.actionGrid}>
                            <div style={{...styles.actionCard, backgroundColor: '#6366f1'}} onClick={() => handleAiRequest("Start a new chat")}>New Chat</div>
                            <div style={{...styles.actionCard, backgroundColor: '#0ea5e9'}} onClick={() => handleAiRequest("Show templates")}>Templates</div>
                            <div style={{...styles.actionCard, backgroundColor: '#f59e0b'}} onClick={() => handleAiRequest("Show history")}>History</div>
                            <div style={{...styles.actionCard, backgroundColor: '#10b981'}} onClick={() => handleAiRequest("Get API keys")}>API Keys</div>
                        </div>
                    </div>

                    <div style={styles.usageCard}>
                        <h3 style={styles.sectionTitle}>📊 Model Usage</h3>
                        <ProgressBar label="GPT-4o" progress="72%" color="#8b5cf6" />
                        <ProgressBar label="GPT-4o Mini" progress="45%" color="#0ea5e9" />
                        <ProgressBar label="DALL-E" progress="28%" color="#f59e0b" />
                    </div>
                </div>
            </main>
        </div>
    );
};

// Sub-components
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
    searchInput: { backgroundColor: '#171923', border: '1px solid #2d3748', color: '#fff', padding: '10px 20px', borderRadius: '10px', width: '250px', outline: 'none' },
    aiBox: { backgroundColor: '#1c1f2b', padding: '24px', borderRadius: '16px', border: '1px solid #2d3748', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
    statCard: { backgroundColor: '#171923', padding: '20px', borderRadius: '16px', border: '1px solid #2d3748' },
    statHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
    statTitle: { fontSize: '11px', color: '#9ca3af', fontWeight: '700', letterSpacing: '0.5px' },
    statIcon: { padding: '8px', borderRadius: '10px', fontSize: '18px' },
    statValue: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' },
    statTrend: { fontSize: '14px', fontWeight: '600' },
    bottomSection: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' },
    quickActions: { backgroundColor: '#171923', padding: '24px', borderRadius: '16px', border: '1px solid #2d3748' },
    actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' },
    actionCard: { padding: '20px', borderRadius: '12px', textAlign: 'center', fontWeight: '600', cursor: 'pointer', color: '#fff' },
    usageCard: { backgroundColor: '#171923', padding: '24px', borderRadius: '16px', border: '1px solid #2d3748' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
    progressBase: { width: '100%', height: '8px', backgroundColor: '#2d3748', borderRadius: '4px' },
    progressFill: { height: '100%', borderRadius: '4px' },
    pulse: { animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', color: '#8b5cf6' }
};

export default Dashboard;