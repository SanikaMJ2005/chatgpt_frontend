import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleAsk = (e) => {
    if (e) e.preventDefault();
    
    // DEBUG: Open your browser console (F12) to see if this triggers
    console.log("Submit triggered with query:", query);

    if (query.trim()) {
      const targetUrl = `/dashboard?q=${encodeURIComponent(query)}`;
      console.log("Navigating to:", targetUrl);
      navigate(targetUrl);
    }
  };

  const handlePillClick = (item) => {
    console.log("Pill clicked:", item);
    navigate(`/dashboard?q=${encodeURIComponent(item)}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        What can I help with?
      </h1>

      <div className="w-full max-w-xl">
        {/* Form ensures the 'Enter' key works */}
        <form 
          onSubmit={handleAsk}
          className="flex items-center gap-2 border border-gray-300 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all"
        >
          <input
            type="text"
            placeholder="Ask anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            autoFocus
          />
          {/* Visible arrow button for better feedback */}
          <button 
            type="submit" 
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors w-10 h-10 flex items-center justify-center"
          >
            <span className="text-lg">↑</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {["Attach", "Search", "Study", "Create image"].map((item) => (
            <button
              key={item}
              onClick={() => handlePillClick(item)}
              className="px-4 py-1.5 text-sm border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-10 text-center max-w-md">
        By messaging ChatGPT, you agree to our Terms and have read our Privacy Policy.
      </p>
    </div>
  );
};

export default Home;