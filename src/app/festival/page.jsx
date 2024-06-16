"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./festival.module.css";
import LikeButton from "../components/LikeButton";
import Breadcrumbs from "../components/Breadcrumbs";
import { Pagination, Input, Select } from "antd";
import { fetchBandsAndSchedule } from "../../lib/api/bands";
import LoadingAnimation from "../components/Loading";

const { Search } = Input;
const { Option } = Select;

export default function FestivalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allBands, setAllBands] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const bandsPerPage = 16;
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { bandsData, scheduleData } = await fetchBandsAndSchedule();
        setAllBands(bandsData);
        setScheduleData(scheduleData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const likedBands =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("likedBands")) || []
      : [];

  if (allBands.length === 0 || Object.keys(scheduleData).length === 0) {
    return <LoadingAnimation />;
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStageSelect = (value) => {
    setSelectedStage(value);
    setCurrentPage(1);
  };

  const paths = [
    { href: "/", label: "Home" },
    { href: "/festival", label: "Festival" },
  ];

  const indexOfLastBand = currentPage * bandsPerPage;
  const indexOfFirstBand = indexOfLastBand - bandsPerPage;

  const getStageForBand = (bandName) => {
    for (const stage in scheduleData) {
      for (const day in scheduleData[stage]) {
        const acts = scheduleData[stage][day];
        for (const act of acts) {
          if (act.act === bandName) {
            return stage;
          }
        }
      }
    }
    return null;
  };

  const filteredBands = allBands.filter((band) => {
    const matchesSearch = band.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavorites || likedBands.includes(band.slug);
    const stage = getStageForBand(band.name);
    const matchesStage = selectedStage === "All" || stage === selectedStage;
    return matchesSearch && matchesFavorites && matchesStage;
  });

  const bands = filteredBands.slice(indexOfFirstBand, indexOfLastBand);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleFavorites = () => {
    setShowFavorites((prevShowFavorites) => !prevShowFavorites);
    setCurrentPage(1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.breadcrumbs}>
        <Breadcrumbs paths={paths} />
      </div>
      <div className={styles.mainBand}>
        <h1 className="ml-4">BANDS</h1>

        <div className={styles.sortBar}>
          <Search
            placeholder="Search bands"
            onChange={handleSearchChange}
            style={{ width: 160 }}
          />
          <Select
            defaultValue="All"
            onChange={handleStageSelect}
            style={{ width: 160, marginLeft: "1rem" }}
          >
            <Option value="All">All Stages</Option>
            <Option value="Midgard">Midgard</Option>
            <Option value="Vanaheim">Vanaheim</Option>
            <Option value="Jotunheim">Jotunheim</Option>
          </Select>
          <div>
            {" "}
            <p
              className={styles.favoriteButton}
              onClick={toggleFavorites}
              style={{ cursor: "pointer" }}
            >
              Favorites
            </p>
          </div>
        </div>
        <ul className={styles.grid}>
          {bands.map((band) => (
            <motion.li
              className={styles.bandItem}
              key={band.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={styles.imageContainer}
                whileHover={{ scale: 1.05 }}
              >
                <LikeButton slug={band.slug} className={styles.likeButton} />
                <Link href={`/festival/${band.slug}`}>
                  <Image
                    src={
                      band.logo.startsWith("https://")
                        ? band.logo
                        : `https://abyssinian-aeolian-gazelle.glitch.me/logos/${band.logo}`
                    }
                    alt={band.name}
                    width={200}
                    height={200}
                  />
                  <h5 className={styles.bandName}>{band.name}</h5>
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </ul>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          total={filteredBands.length}
          pageSize={bandsPerPage}
          onChange={paginate}
        />
      </div>
    </main>
  );
}
