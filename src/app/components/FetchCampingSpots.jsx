import React, { useState, useEffect } from "react";

const FetchCampingSpots = ({ children }) => {
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchCampingSpots = async () => {
      try {
        // "http://localhost:8080/available-spots"
        //  "https://abyssinian-aeolian-gazelle.glitch.me/available-spots"

        const response = await fetch("http://localhost:8080/available-spots");
        if (!response.ok) {
          throw new Error("Failed to fetch available spots");
        }
        const data = await response.json();
        // Filter-method bruges tilat frasortere spots med available=0.
        const filteredSpots = data.filter((spot) => spot.available !== 0);
        setSpots(filteredSpots);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCampingSpots();
  }, []);

  return children({ spots, error });
};

export default FetchCampingSpots;
