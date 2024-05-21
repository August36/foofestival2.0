"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import LikeButton from "../components/LikeButton";
import Breadcrumbs from "../components/Breadcrumbs";
import { Pagination, Input, Select } from "antd";
import { fetchBandsAndSchedule } from "../../lib/api/bands";

const { Search } = Input;
const { Option } = Select;

export default function FestivalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allBands, setAllBands] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const bandsPerPage = 12;
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const { bandsData, scheduleData } = await fetchBandsAndSchedule();
        setAllBands(bandsData);
        setScheduleData(scheduleData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
    fetchData();
  }, []);

  // Check if likedBands and scheduleData are defined
  const likedBands =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("likedBands")) || []
      : [];

  // Check if allBands and scheduleData are empty before using them
  if (allBands.length === 0 || Object.keys(scheduleData).length === 0) {
    return <div>Loading...</div>;
  }

  // Define handleSearchChange and handleStageSelect functions
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

  const filteredBands = showFavorites
    ? allBands.filter((band) => likedBands.includes(band.slug))
    : allBands.filter((band) =>
        band.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const sortedBands = [...filteredBands]
    .filter((band) => {
      const stage = getStageForBand(band.name);
      return selectedStage === "All" || stage === selectedStage;
    })
    .sort((a, b) => {
      const stageA = getStageForBand(a.name) || "";
      const stageB = getStageForBand(b.name) || "";
      return stageA.localeCompare(stageB);
    });

  const bands = sortedBands.slice(indexOfFirstBand, indexOfLastBand);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleFavorites = () => {
    setShowFavorites((prevShowFavorites) => !prevShowFavorites);
    setCurrentPage(1);
  };

  return (
    <main>
      <div className={styles.breadcrumbs}>
        <Breadcrumbs paths={paths} />
      </div>
      <div className={styles.mainBand}>
        <h1 className="ml-4">BANDS</h1>
        <div className={styles.sortBar}>
          <p onClick={toggleFavorites} style={{ cursor: "pointer" }}>
            Favorites
          </p>
          <Search
            placeholder="Search bands"
            onChange={handleSearchChange}
            style={{ width: 200 }}
          />
          <Select
            defaultValue="All"
            onChange={handleStageSelect}
            style={{ width: 200, marginLeft: "1rem" }}
          >
            <Option value="All">All Stages</Option>
            <Option value="Midgard">Midgard</Option>
            <Option value="Vanaheim">Vanaheim</Option>
            <Option value="Jotunheim">Jotunheim</Option>
          </Select>
        </div>
        <ul className={styles.grid}>
          {bands.map((band) => (
            <li className={styles.bandItem} key={band.slug}>
              <div className={styles.imageContainer}>
                <LikeButton slug={band.slug} className={styles.likeButton} />
                <Link href={`/festival/${band.slug}`}>
                  <Image
                    src={
                      band.logo.startsWith("https://")
                        ? band.logo
                        : `http://localhost:8080/logos/${band.logo}`
                    }
                    alt={band.name}
                    width={200}
                    height={200}
                  />
                  <h5 className={styles.bandName}>{band.name}</h5>
                  <p>{getStageForBand(band.name)}</p>
                </Link>
              </div>
            </li>
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
