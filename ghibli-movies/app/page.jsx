"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("year");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ghibliapi.vercel.app/films")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          setMovies([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setMovies([]);
        setLoading(false);
      });
  }, []);

  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "year") return a.release_date - b.release_date;
      if (sort === "score") return b.rt_score - a.rt_score;
      return 0;
    });

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🎬 Studio Ghibli Movies</h1>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          style={styles.input}
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.select}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="year">Sort by Year</option>
          <option value="score">Sort by Rating</option>
        </select>
      </div>

      {loading && <p>Loading movies...</p>}

      {!loading && filteredMovies.length === 0 && (
        <p>No movies found.</p>
      )}

      <div style={styles.grid}>
        {filteredMovies.map((movie) => (
          <div key={movie.id} style={styles.card}>
            <h2>{movie.title}</h2>

            <p style={styles.meta}>
              🎥 {movie.director} • 🎞️ {movie.producer}
            </p>

            <p style={styles.meta}>
              📅 {movie.release_date} • ⭐ {movie.rt_score}
            </p>

            <details>
              <summary style={styles.summary}>Read description</summary>
              <p style={styles.description}>{movie.description}</p>
            </details>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#0f172a",
    color: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  controls: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "220px",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
  },
  meta: {
    fontSize: "14px",
    opacity: 0.8,
    marginBottom: "6px",
  },
  summary: {
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
  },
  description: {
    fontSize: "14px",
    lineHeight: "1.6",
    marginTop: "10px",
  },
};
