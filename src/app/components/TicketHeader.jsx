import React from "react";

const TicketHeader = ({ ticketType }) => {
  return (
    <>
      {/* Brødkrummesti placeholder */}
      <div className="bg-[hsla(178,46%,32%,0.9)] p-3 text-white">
        <div className="flex flex-row justify-start mb-2">
          <p className="cursor-pointer text-sm">Home</p>
          <p className="text-sm">&nbsp;/&nbsp;</p>
          <p className="cursor-pointer text-sm">Tickets</p>
        </div>

        <h4 className="mb-2">
          <strong>FooFestival 2024</strong> - {ticketType} Ticket
        </h4>
      </div>
    </>
  );
};

export default TicketHeader;
