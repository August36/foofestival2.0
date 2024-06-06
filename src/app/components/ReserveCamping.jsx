import React, { useState, useEffect } from "react";
import FetchCampingSpots from "./FetchCampingSpots";
import { useSearchParams } from "next/navigation";

const ReserveCamping = () => {
  const [formData, setFormData] = useState({
    campingArea: "",
  });
  const [ticketAmount, setTicketAmount] = useState(1); // This could be a default or passed from a previous step
  const [reserveMessage, setReserveMessage] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [campingAreaSelected, setCampingAreaSelected] = useState(false); 
  const [campingDivClicked, setCampingDivClicked] = useState(false);
  const searchParams = useSearchParams();

  // Monitor camping area selection
  useEffect(() => {
    setCampingAreaSelected(formData.campingArea !== "");
  }, [formData.campingArea]);

  // Handle input change for form data
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // PUT request for reserving camping spot
  const handlePutRequest = async () => {
    if (!campingAreaSelected) {
      setReserveMessage("Please select a camping area.");
      return;
    }

    const reservationData = {
      area: formData.campingArea,
      amount: ticketAmount,
    };

    try {
      const response = await fetch(
        "https://abyssinian-aeolian-gazelle.glitch.me/reserve-spot",
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReservationId(data.id);
        setReserveMessage("Reservation successful!");
        console.log("Reservation ID:", data.id);

        // Set search params and navigate to the next step
        const params = new URLSearchParams(searchParams);
        params.set("reservationId", data.id);
        params.set("campingArea", formData.campingArea);

        window.location.href = `/choose-ticket?${params.toString()}`;
      } else {
        setReserveMessage("Reservation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setReserveMessage("Error occurred. Please try again.");
    }
  };

  // Handle camping div click
  const handleClick = () => {
    setCampingDivClicked(true);
    if (campingAreaSelected) {
      handlePutRequest();
    }
  };

  return (
    <div>
      <div className="p-3">
        <h3>
          <strong>Choose camping area</strong>
        </h3>
        <FetchCampingSpots>
          {({ spots, error }) => (
            <>
              {error && <p>Error: {error}</p>}
              <div className="grid grid-cols-4 gap-4">
                <h4>
                  <strong>Select</strong>
                </h4>
                <h4>
                  <strong>Areas</strong>
                </h4>
                <h4>
                  <strong>Spots</strong>
                </h4>
                <h4>
                  <strong>Available Spots</strong>
                </h4>
                {spots.map((spot, index) => (
                  <React.Fragment key={index}>
                    <div>
                      <label htmlFor="campingArea"></label>
                      <input
                        type="radio"
                        name="campingArea"
                        value={spot.area}
                        className="w-6 h-6"
                        onChange={handleInputChange}
                      />
                    </div>
                    {Object.values(spot).map((value, i) => (
                      <span key={i}>{value}</span>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </FetchCampingSpots>
      </div>

      <div className="flex justify-center">
        <div
          onClick={handleClick}
          className={`bg-green-500 text-white px-4 py-2 mt-7 mb-2 rounded-md ${
            campingAreaSelected ? "cursor-pointer" : "opacity-50"
          }`}
        >
          Reserve camping
        </div>
      </div>
      {reserveMessage && (
        <div className="p-3 text-green-500 text-center">{reserveMessage}</div>
      )}
      {campingDivClicked && !campingAreaSelected && !reserveMessage && (
        <div className="text-red-500 text-center mt-1">
          Select a camping area before making a reservation
        </div>
      )}
    </div>
  );
};

export default ReserveCamping;
