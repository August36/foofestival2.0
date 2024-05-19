"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import LikeButton from "../components/LikeButton";
import Breadcrumbs from "../components/Breadcrumbs";
import { Pagination } from "antd";

export default function FestivalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allBands, setAllBands] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const bandsPerPage = 12;

  useEffect(() => {
    async function fetchData() {
      const url = "http://localhost:8080/bands";
      const res = await fetch(url);
      const allBandsData = await res.json();
      setAllBands(allBandsData);
    }
    fetchData();
  }, []);

  const paths = [
    { href: "/", label: "Home" },
    { href: "/festival", label: "Festival" },
  ];

  const indexOfLastBand = currentPage * bandsPerPage;
  const indexOfFirstBand = indexOfLastBand - bandsPerPage;
  const likedBands = JSON.parse(localStorage.getItem("likedBands")) || [];
  const filteredBands = showFavorites
    ? allBands.filter((band) => likedBands.includes(band.slug))
    : allBands;
  const bands = filteredBands.slice(indexOfFirstBand, indexOfLastBand);

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
          <p>Sort</p>
          <p onClick={toggleFavorites} style={{ cursor: "pointer" }}>
            Favorites
          </p>
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
