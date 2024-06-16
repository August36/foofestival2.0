import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CurrentPlaying.module.css";
import { fetchBandsAndSchedule } from "../../lib/api/bands";

const CurrentPlaying = () => {
  const [currentBands, setCurrentBands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [currentTimeSlot, setCurrentTimeSlot] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    async function fetchCurrentBands() {
      try {
        const { scheduleData } = await fetchBandsAndSchedule();
        const today = new Date()
          .toLocaleString("en-US", { weekday: "short" })
          .toLowerCase();
        const now = new Date();
        const currentTimeString = now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setCurrentTime(currentTimeString);

        const currentBands = [];
        let timeSlot = { start: "", end: "" };

        for (const stage in scheduleData) {
          if (scheduleData[stage][today]) {
            for (const band of scheduleData[stage][today]) {
              if (
                band.start <= currentTimeString &&
                band.end >= currentTimeString
              ) {
                currentBands.push({ ...band, stage });
                if (!timeSlot.start || band.start < timeSlot.start) {
                  timeSlot.start = band.start;
                }
                if (!timeSlot.end || band.end > timeSlot.end) {
                  timeSlot.end = band.end;
                }
              }
            }
          }
        }

        setCurrentBands(currentBands);
        setCurrentTimeSlot(timeSlot);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching current bands:", error);
        setLoading(false);
      }
    }

    fetchCurrentBands();
    const intervalId = setInterval(fetchCurrentBands, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentBands.length === 0) {
    return <div>No bands are playing right now.</div>;
  }

  return (
    <div className={styles.currentPlaying}>
      <div className={styles.currentTime}>Current Time: {currentTime}</div>
      <div className={styles.timeSlot}>
        {currentTimeSlot.start} - {currentTimeSlot.end}
      </div>
      <ul className={styles.bandList}>
        {currentBands.map((band) => (
          <li key={band.act} className={styles.bandItem}>
            <div className={styles.bandName}>
              <Link
                href={`/festival/${band.act
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .replace(/[-\s]+/g, "-")}`}
              >
                {band.act}
              </Link>
            </div>
            <div className={styles.stageName}>{band.stage}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentPlaying;
