import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }
        fetchHistory();
    }, [navigate]);

    const fetchHistory = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch('http://127.0.0.1:8000/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setChats(data);
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate('/login');
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    const handleAskAi = async (e) => {
        e.preventDefault();
        if (!currentPrompt.trim()) return;

        setIsLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        try {
            const response = await fetch('http://127.0.0.1:8000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: currentPrompt }),
            });
            const data = await response.json();
            if (response.ok) {
                setAiResponse(data.response);
                fetchHistory(); // Refresh history after new message
                setCurrentPrompt("");
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate('/login');
            } else {
                setError(data.detail || "Something went wrong.");
            }
        } catch (err) {
            setError("Could not connect to the AI server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    const startNewChat = () => {
        setAiResponse("");
        setCurrentPrompt("");
        setError("");
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>🤖</div>
                    <span style={styles.logoText}>Ask AI</span>
                </div>

                <button style={styles.newChatBtn} onClick={startNewChat}>+ New Chat</button>

                <div style={styles.historySection}>
                    <h3 style={styles.historyTitle}>Chat History</h3>
                    <div style={styles.historyList}>
                        {chats.length === 0 ? (
                            <p style={styles.noHistory}>No history yet.</p>
                        ) : (
                            chats.map((chat) => (
                                <div key={chat.id} style={styles.historyItem} onClick={() => setAiResponse(chat.response)}>
                                    {chat.prompt.substring(0, 30)}...
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </aside>

            {/* Main Content */}
            <main style={styles.main}>
                <div style={styles.chatArea}>
                    {aiResponse ? (
                        <div style={styles.responseBox}>
                            <h3 style={styles.responseHeader}>AI Response</h3>
                            <p style={styles.responseText}>{aiResponse}</p>
                        </div>
                    ) : (
                        <div style={styles.welcomeBox}>
                            <h2>How can I help you today?</h2>
                            <p>Ask anything and our AI will assist you.</p>
                        </div>
                    )}
                    {error && <div style={styles.errorBox}>{error}</div>}
                </div>

                <form onSubmit={handleAskAi} style={styles.inputArea}>
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        style={styles.input}
                        value={currentPrompt}
                        onChange={(e) => setCurrentPrompt(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" style={styles.sendBtn} disabled={isLoading}>
                        {isLoading ? "..." : "Send"}
                    </button>
                </form>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#0b0e14', color: '#fff', fontFamily: 'Inter, sans-serif' },
    sidebar: { width: '280px', backgroundColor: '#171923', padding: '24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2d3748' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' },
    logoIcon: { backgroundColor: '#8b5cf6', padding: '8px', borderRadius: '8px', fontSize: '20px' },
    logoText: { fontSize: '22px', fontWeight: 'bold' },
    newChatBtn: { padding: '12px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' },
    historySection: { flex: 1, overflowY: 'auto', marginBottom: '20px' },
    historyTitle: { fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' },
    historyList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    historyItem: { padding: '10px', borderRadius: '6px', backgroundColor: '#2d3748', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    noHistory: { color: '#4a5568', fontSize: '14px' },
    logoutBtn: { padding: '12px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', position: 'relative' },
    chatArea: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    welcomeBox: { textAlign: 'center', color: '#9ca3af' },
    responseBox: { width: '100%', maxWidth: '800px', backgroundColor: '#1c1f2b', padding: '30px', borderRadius: '16px', border: '1px solid #2d3748', animation: 'fadeIn 0.5s' },
    responseHeader: { color: '#8b5cf6', marginBottom: '15px', fontSize: '18px' },
    responseText: { lineHeight: '1.7', color: '#e5e7eb', whiteSpace: 'pre-wrap' },
    inputArea: { display: 'flex', gap: '15px', width: '100%', maxWidth: '800px', margin: '0 auto' },
    input: { flex: 1, backgroundColor: '#171923', border: '1px solid #2d3748', color: '#fff', padding: '15px 20px', borderRadius: '12px', outline: 'none', fontSize: '16px' },
    sendBtn: { padding: '0 25px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' },
    errorBox: { color: '#ef4444', marginTop: '10px' }
};

export default Dashboard;