"use client";
import React, { useEffect, useState } from "react";
import styles from "./stages.module.css";
import Link from "next/link";
import { fetchBandsAndSchedule } from "../../lib/api/bands";
import Image from "next/image";
import LoadingAnimation from "../components/Loading";
import { motion } from "framer-motion";

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [dayList, setDayList] = useState([]);
  const [selectedStage, setSelectedStage] = useState("All");
  const [loading, setLoading] = useState(true);
  const [stageStyles, setStageStyles] = useState({
    Jotunheim: {},
    Vanaheim: {},
    Midgard: {},
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { bandsData, scheduleData } = await fetchBandsAndSchedule();
        const formattedData = formatScheduleData(scheduleData);
        setScheduleData(formattedData);
        const days = Object.keys(formattedData);
        setDayList(days);
        setSelectedDay(days[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const updatedStyles = {};
    for (const stage of Object.keys(stageStyles)) {
      updatedStyles[stage] =
        selectedStage === "All" || stage === selectedStage
          ? {}
          : { filter: "grayscale(100%)" };
    }
    setStageStyles(updatedStyles);
  }, [selectedStage, stageStyles]);

  function formatScheduleData(data) {
    const formattedData = {};
    for (const stage in data) {
      for (const day in data[stage]) {
        if (!formattedData[day]) {
          formattedData[day] = {};
        }
        data[stage][day].forEach((band) => {
          if (!formattedData[day][band.start]) {
            formattedData[day][band.start] = [];
          }
          formattedData[day][band.start].push({
            ...band,
            stage,
          });
        });
      }
    }
    return formattedData;
  }

  function consolidateBreaks(dayData) {
    const consolidated = {};
    for (const time in dayData) {
      const isBreak = dayData[time].every(
        (band) => band.act.toLowerCase() === "break"
      );
      if (isBreak) {
        consolidated[time] = [
          { act: "Break", start: time, end: dayData[time][0].end },
        ];
      } else {
        consolidated[time] = dayData[time];
      }
    }
    return consolidated;
  }

  const dayMapping = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

  const handlePreviousDay = () => {
    const currentIndex = dayList.indexOf(selectedDay);
    if (currentIndex > 0) {
      setSelectedDay(dayList[currentIndex - 1]);
    }
  };

  const handleNextDay = () => {
    const currentIndex = dayList.indexOf(selectedDay);
    if (currentIndex < dayList.length - 1) {
      setSelectedDay(dayList[currentIndex + 1]);
    }
  };

  const handleStageSelect = (stage) => {
    setSelectedStage(stage);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <main>
      <div className={styles.mainBand}>
        <h1 className={styles.h1}>Schedule</h1>
        <div className={styles.imageStages}>
          <div className={styles.imageContainer}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{ pointerEvents: "auto", ...stageStyles.Jotunheim }}
              onClick={() => handleStageSelect("Jotunheim")}
            >
              <p className={styles.p}>Jotunheim</p>
              <Image
                src="/stage3.png"
                alt="Jotunheim"
                width={200}
                height={200}
              />
            </motion.div>
          </div>
          <div className={styles.imageContainer}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{ pointerEvents: "auto", ...stageStyles.Vanaheim }}
              onClick={() => handleStageSelect("Vanaheim")}
            >
              <p className={styles.p}>Vanaheim</p>
              <Image
                src="/stage2.png"
                alt="Vanaheim"
                width={200}
                height={200}
              />
            </motion.div>
          </div>
          <div className={styles.imageContainer}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{ pointerEvents: "auto", ...stageStyles.Midgard }}
              onClick={() => handleStageSelect("Midgard")}
            >
              <p className={styles.p}>Midgard</p>
              <Image src="/stage1.png" alt="Midgard" width={200} height={200} />
            </motion.div>
          </div>
        </div>
        <button
          onClick={() => handleStageSelect("All")}
          className={`${selectedStage === "All" ? styles.selected : ""} ${
            styles.outline
          }`}
        >
          All Stages
        </button>

        <div className={styles.navigation}>
          <button
            onClick={handlePreviousDay}
            disabled={dayList.indexOf(selectedDay) === 0}
          >
            Previous Day
          </button>
          <select value={selectedDay} onChange={handleDayChange}>
            {dayList.map((day) => (
              <option key={day} value={day}>
                {dayMapping[day]}
              </option>
            ))}
          </select>
          <button
            onClick={handleNextDay}
            disabled={dayList.indexOf(selectedDay) === dayList.length - 1}
          >
            Next Day
          </button>
        </div>
        <div className={styles.scheduleContainer}>
          {selectedDay && (
            <motion.div
              key={selectedDay}
              className={styles.scheduleDay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3>
                {selectedStage === "All" ? "All Stages" : `${selectedStage}`}
              </h3>
              <h2>{dayMapping[selectedDay]}</h2>

              <ul className={styles.scheduleList}>
                {Object.keys(consolidateBreaks(scheduleData[selectedDay])).map(
                  (time) => (
                    <li key={time} className={styles.scheduleItem}>
                      {consolidateBreaks(scheduleData[selectedDay])[time].map(
                        (band) =>
                          (selectedStage === "All" ||
                            band.stage === selectedStage ||
                            band.act.toLowerCase() === "break") && (
                            <motion.div
                              key={`${band.stage}-${band.start}-${band.act}`}
                              className={
                                band.act.toLowerCase() === "break"
                                  ? styles.breakItem
                                  : styles.bandItem
                              }
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <span>
                                {band.start} - {band.end}
                              </span>
                              {band.act.toLowerCase() !== "break" && (
                                <>
                                  <span>{band.stage}</span>
                                  <span>
                                    {band.act.toLowerCase() !== "break" ? (
                                      <Link
                                        href={`/festival/${band.act
                                          .toLowerCase()
                                          .replace(/[^\w\s-]/g, "")
                                          .replace(/[-\s]+/g, "-")}`}
                                        className={styles.bandLink}
                                      >
                                        {band.act}
                                      </Link>
                                    ) : (
                                      <span className={styles.bandLink}>
                                        {band.act}
                                      </span>
                                    )}
                                  </span>
                                </>
                              )}
                              {band.act.toLowerCase() === "break" && (
                                <span>{band.act}</span>
                              )}
                            </motion.div>
                          )
                      )}
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
