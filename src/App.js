import React, { useState, useEffect } from "react";
import axios from "axios";

const CLIENT_ID = "b50957d293904145984de0bc2aabc761"; 
const CLIENT_SECRET = "f009e621f49e41f5a27ffcc844d7abec"; 
const SPOTIFY_API_URL = "https://api.spotify.com/v1/";

const Moodify = () => {
  const [mood, setMood] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              Authorization: `Basic ${credentials}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching access token", error);
        alert("Failed to connect to Spotify API. Please check your credentials.");
      }
    };

    fetchAccessToken();
  }, []);

  const fetchPlaylists = async () => {
    if (!accessToken || !mood.trim()) {
      alert("Please enter a valid mood.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${SPOTIFY_API_URL}search`,
        {
          params: {
            q: mood,
            type: "playlist",
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPlaylists(response.data.playlists.items);
    } catch (error) {
      console.error("Error fetching playlists", error);
      alert("Failed to fetch playlists. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/photos/bg-spotify1.jpeg')" }}>
      <header className="mb-6 text-center">
        <h1 className="text-4xl text-orange-600 font-bold mb-4">Moodify</h1>
        <p className="text-lg text-orange-600 font-bold">Discover playlists that match your vibe.</p>
      </header>

      <div className="flex flex-col items-center w-full max-w-md">
        <input
          type="text"
          placeholder="Enter your mood (e.g., happy, chill)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full p-4 mb-4 rounded-lg text-gray-700 border-2 border-white focus:outline-none focus:ring-2 focus:ring-pink-300"
          disabled={loading}
        />
        <button
          onClick={fetchPlaylists}
          className="bg-yellow-700 px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
          disabled={loading}
        >
          Generate Playlist
        </button>
      </div>

      {loading && <p className="mt-6 text-lg animate-pulse">Loading playlists...</p>}

      <div className="w-full max-w-4xl mt-8">
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              // Check if playlist data exists before accessing properties
              playlist && playlist.name && playlist.owner && playlist.owner.display_name ? (
                <div
                  key={playlist.id}
                  className="bg-white text-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-transform transform hover:scale-105"
                >
                  <img
                    src={playlist.images[0]?.url || "./photos/spotifylogo.png"}
                    alt={playlist.name}
                    className="w-40 h-40 rounded-md mb-4 object-cover shadow-md"
                  />
                  <h2 className="text-lg font-semibold text-center mb-2">{playlist.name}</h2>
                  <p className="text-sm text-gray-600 text-center">By {playlist.owner.display_name}</p>
                  <a
                    href={playlist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    View on Spotify
                  </a>
                </div>
              ) : null
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-lg">Enter a mood to discover playlists!</p>
          )
        )}
      </div>
    </div>
  );
};

export default Moodify;
