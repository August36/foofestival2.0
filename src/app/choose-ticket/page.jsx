"use client";

import React, { Suspense } from "react";
import Chooseticket from "../components/chooseTicket";
import TicketHeader from "@/app/components/TicketHeader";
import { useSearchParams } from "next/navigation";

const ChooseTicketPageWrapper = () => {
  const searchParams = useSearchParams();
  const ticketType = searchParams.get("type");

  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto lg:px-8 py-16">
          <article className="bg-white rounded-lg shadow-md lg:max-w-screen-lg xl:max-w-screen-lg 2xl:max-w-screen-lg lg:mx-auto xl:mx-auto 2xl:mx-auto md:mx-0">
            <TicketHeader ticketType={ticketType} />
            <h3 className="pt-2 pl-2">
              <strong>Choose tickets</strong>
            </h3>
            <div className="flex flex-col justify-start">
              <Chooseticket ticketType={ticketType} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

const ChooseTicketPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ChooseTicketPageWrapper />
  </Suspense>
);

export default ChooseTicketPage;
