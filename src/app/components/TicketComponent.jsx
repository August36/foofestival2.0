import React from "react";
import Link from "next/link";
import BlueButton from "./BlueButton";

const TicketComponent = (props) => {
  return (
    <div className="border-2 border-gray-300 rounded-lg w-64 p-4 mb-6 shadow-lg bg-white">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">{props.ticketType}</h1>
      </div>
      <div className="flex flex-col items-start mb-4 pl-4">
        <p className="text-gray-600">{props.camping}</p>
        <p className="text-gray-600">{props.bath}</p>
        <p className="text-gray-600">{props.toilets}</p>
      </div>
      <div className="flex justify-between items-center mb-4 pl-4">
        <span className="text-gray-800 font-semibold">{props.price}</span>
      </div>
      <div className="flex justify-center">
        <Link href={`./reserveCamping?type=${props.ticketType}`}>
          <BlueButton text="Buy ticket" />
        </Link>
      </div>
    </div>
  );
};

export default TicketComponent;
