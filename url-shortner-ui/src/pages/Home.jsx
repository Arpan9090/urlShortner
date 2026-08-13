import { useState } from 'react';
import api from '../api/axiosInstance';

function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const response = await api.post('/shorten', { originalUrl: longUrl });
      setResult(response.data);
      setLongUrl('');
    } catch (err) {
      console.error(err);
      setError('Failed to shorten URL. Make sure your Spring Boot backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullShortUrl = `http://localhost:8080/${result?.shortCode}`;
    if (fullShortUrl) {
      navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchAnalytics = async () => {
    if (!result?.shortCode) return;
    try {
      const response = await api.get(`/analytics/${result.shortCode}`);
      setResult(response.data);
    } catch (err) {
      console.error('Failed to update analytics', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          URL Shortener
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Convert long, clunky URLs into clean, trackable short links.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="Paste your long URL here..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            className="flex-1 min-w-0 bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-400 text-sm font-medium bg-red-950/40 border border-red-900/60 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-8 p-5 sm:p-6 bg-slate-950/50 border border-slate-800 rounded-xl text-left space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Your Shortened Link</h3>

            <div className="flex items-center justify-between gap-3 bg-slate-900 px-4 py-3 rounded-lg border border-slate-800">
              <a
                href={`http://localhost:8080/${result.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 font-semibold hover:underline truncate"
              >
                http://localhost:8080/{result.shortCode}
              </a>
              <button
                onClick={handleCopy}
                className="shrink-0 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                {copied ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>

            <div className="text-sm text-slate-400 space-y-2 pt-2 border-t border-slate-800">
              <p className="truncate"><strong className="text-slate-300">Original URL:</strong> {result.originalUrl}</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p><strong className="text-slate-300">Total Clicks:</strong> <span className="text-emerald-400 font-semibold">{result.clickCount}</span></p>
                <button
                  onClick={fetchAnalytics}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md transition"
                >
                  🔄 Refresh Clicks
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;