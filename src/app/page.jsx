"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import { fetchBands, fetchEvents } from "../lib/api/bands";
import Loading from "./components/Loading";
import ParallaxText from "./components/Effect/Effect";
import CurrentPlaying from "./components/CurrentPlaying";
export default function App() {
  const [randomBands, setRandomBands] = useState([]);
  const [events, setEvents] = useState([]); // State for events data
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching bands data...");
        const bands = await fetchBands();
        if (bands && bands.length > 0) {
          const first16Bands = bands.slice(0, 16);
          const shuffledBands = first16Bands.sort(() => 0.5 - Math.random());
          const selectedBands = shuffledBands.slice(0, 3);
          setRandomBands(selectedBands);
          console.log("Bands data fetched successfully:", selectedBands);
          setLoading(false);
        } else {
          throw new Error("No bands data returned from API");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function fetchEventData() {
      try {
        console.log("Fetching events data...");
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        console.log("Events data fetched successfully:", eventsData);
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    }

    fetchData();
    fetchEventData();

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const parallaxFactor = 0.3;
      const parallaxFactor2 = 0.08;
      const hero = heroRef.current;
      const bottom = bottomRef.current;

      if (hero) {
        hero.style.backgroundPositionY = -scrollPos * parallaxFactor + "px";
      }

      if (bottom) {
        bottom.style.backgroundPositionY = scrollPos * parallaxFactor2 + "px"; // Reverse the direction for the bottom
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroRef}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              WELCOME TO
            </motion.h1>
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className={styles.h1span}
            >
              FOOFEST
            </motion.h1>
          </motion.div>
          <div className={styles.imageContainer}>
            <Link href="/stages">
              <Image
                src="/imgs/foofestival2.png"
                alt="flyer-foofest"
                width={800}
                height={800}
                className={styles.heroLogo}
              />
            </Link>
          </div>
          <div>
            <h4>A ONE WEEK 24/7 FESTIVAL OF YOUR FAVORITE ARTISTS</h4>
            <p>
              From <span>Monday 24th June</span> to{" "}
              <span>Sunday 30th of June</span>
            </p>
          </div>
          <Link href="/ticket-frontpage" className={styles.buttonLink}>
            Tickets
          </Link>
          <Link href="/festival" className={styles.buttonLink2}>
            Bands
          </Link>
        </div>
      </div>
      <div className={styles.parallaxContainer}>
        <div className={styles.parallaxOverlay}>
          <ParallaxText />
        </div>
      </div>
      <div className={styles.otherBackground}>
        <h2>Experience your favorite artists</h2>
        <h3>From the 60's, 70's, 80's and 90's</h3>
        <p className={styles.otherP}>
          (Some of them are apparently back from the grave)
        </p>
        <div className={styles.grid}>
          {randomBands.map((band) => (
            <motion.li
              className={styles.bandItem}
              key={band.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href={`/festival/${band.slug}`}>
                  <div key={band.id}>
                    <h3>{band.name}</h3>
                    <p>{band.bio}</p>
                    <div className={styles.imageContainer}>
                      <Image
                        className={styles.apiImage}
                        src={
                          band.logo.startsWith("https://")
                            ? band.logo
                            : `https://abyssinian-aeolian-gazelle.glitch.me/logos/${band.logo}`
                        }
                        alt={band.name}
                        width={400}
                        height={400}
                        layout="fixed"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </div>
      </div>

      <div className={styles.bottom} ref={bottomRef}>
        <CurrentPlaying />
        <div className={styles.bottomButtons}>
          <Link href="/stages" className={styles.buttonLink}>
            Full Schedule
          </Link>
          <Link href="/map" className={styles.buttonLink2}>
            Map
          </Link>
          {/*<div className={styles.eventsContainer}>
            <h5>Events</h5>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  <p>Scene: {event.scene}</p>
                  <p>Day: {event.day}</p>
                  <p>Act: {event.act.act}</p>
                  <p>Start Time: {event.act.start}</p>
                  <p>End Time: {event.act.end}</p>
                  <p>Cancelled: {event.act.cancelled ? "Yes" : "No"}</p>
                </li>
              ))}
            </ul>
          </div>*/}
        </div>
      </div>
      <div></div>
    </main>
  );
}
