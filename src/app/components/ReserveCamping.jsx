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
    } else {
      setReserveMessage("Please select a camping area.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="p-3 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 mt-8">Reserve Camping</h1>
        <h3 className="text-lg font-semibold mb-4">Choose camping area</h3>
        <FetchCampingSpots>
          {({ spots, error }) => (
            <>
              {error && <p className="text-red-500">Error: {error}</p>}
              <div className="grid grid-cols-4 gap-4">
                <h4 className="font-semibold">Select</h4>
                <h4 className="font-semibold">Areas</h4>
                <h4 className="font-semibold">Spots</h4>
                <h4 className="font-semibold">Available Spots</h4>
                {spots.map((spot, index) => (
                  <React.Fragment key={index}>
                    <div>
                      <label htmlFor={`campingArea${index}`}></label>
                      <input
                        id={`campingArea${index}`}
                        type="radio"
                        name="campingArea"
                        value={spot.area}
                        className="w-6 h-6"
                        onChange={handleInputChange}
                      />
                    </div>
                    {Object.values(spot).map((value, i) => (
                      <span key={i} className="p-1">{value}</span>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </FetchCampingSpots>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleClick}
            className={`bg-blue-500 text-white py-2 px-4 rounded ${
              campingAreaSelected ? "cursor-pointer" : "opacity-50 cursor-default"
            }`}
          >
            Reserve camping
          </button>
        </div>
        {reserveMessage && (
          <div className={`p-3 text-center mt-4 ${reserveMessage === "Please select a camping area." ? "text-red-500" : ""}`}>
            {reserveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReserveCamping;
