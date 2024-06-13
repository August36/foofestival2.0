"use client"
import React from "react";
import Receipt from "../components/Receipt";

const page = () => {
  return (
    <section className="mt-16 mb-8 lg:max-w-screen-lg xl:max-w-screen-lg 2xl:max-w-screen-lg lg:mx-auto xl:mx-auto 2xl:mx-auto md:mx-0">
      <Receipt />
    </section>
  );
};

export default page;
