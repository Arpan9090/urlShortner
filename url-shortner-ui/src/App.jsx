import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Your Spring Boot Backend API URL
  const API_BASE_URL = 'http://localhost:8080/api/v1';

  // 1. Handle Form Submission to Shorten URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: longUrl,
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to shorten URL. Make sure your Spring Boot backend is running!');
    } finally {
      setLoading(false);
    }
  };

  // 2. Copy Shortened Link to Clipboard
  const handleCopy = () => {
    if (result?.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 3. Fetch Fresh Analytics (Click Count)
  const fetchAnalytics = async () => {
    if (!result?.shortCode) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/${result.shortCode}`);
      setResult(response.data);
    } catch (err) {
      console.error('Failed to update analytics', err);
    }
  };

  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>
      <p>Convert long, clunky URLs into clean, trackable short links.</p>

      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="url"
          placeholder="Paste your long URL here (e.g., https://example.com)..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <h3>Your Shortened Link</h3>
          
          <div className="short-url-box">
            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
              {result.shortUrl}
            </a>
            <button onClick={handleCopy}>
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>

          <div className="analytics-box">
            <p><strong>Original URL:</strong> {result.originalUrl}</p>
            <p><strong>Total Clicks:</strong> {result.clickCount}</p>
            <button className="refresh-btn" onClick={fetchAnalytics}>
              🔄 Refresh Click Counter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;