import React, { useState, useEffect } from "react";
import TicketComponent2 from "./TicketComponent2";
import TicketSelector from "./TicketSelector";
import GreenCamping from "./GreenCamping";
import TentAddOn from "./TentAddOn";
import { useSearchParams } from "next/navigation";
import Timer from "./Timer";

const Chooseticket = ({ ticketType }) => {
  // Vi henter query parametre fra forrige side via url'en
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const reservationId = searchParams.get("reservationId");
  const campingArea = searchParams.get("campingArea");

  // Bruges til at holde styr på hvor meget tid der er tilbage af timeren.
  const updateTimeLeft = (newTimeLeft) => {
    setTimeLeft(newTimeLeft);
  };

  // Definerer priser
  const regularPrice = 799;
  const vipPrice = 1299;
  const bookingFee = 99;
  const greenCampingPrice = 249;
  const tent2PersonPrice = 299;
  const tent3PersonPrice = 399;

  // State variables
  const [ticketAmount, setTicketAmount] = useState(1);
  const [isGreenCamping, setIsGreenCamping] = useState(false);
  const [isTent2Person, setIsTent2Person] = useState(false);
  const [isTent3Person, setIsTent3Person] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [tentWarningMessage, setTentWarningMessage] = useState("");
  // Ved brug af OR operatoren sikrer vi at, hvis der ikke er valgt et campingarea, at der så returneres en tom string. Ved ikke om dette er nødvendigt da man ikke kan gå til denne side uden at have valgt en campingområde
  const [formData, setFormData] = useState({
    campingArea: campingArea || "",
  });
  // timeLeft styrer nedtælling af timeren, start tallet er sat til 300000 millisekunder som er 5min.
  const [timeLeft, setTimeLeft] = useState(300000);


  // Her udregner vi totalPrice
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    if (ticketType === "Regular") {
      totalPrice = ticketAmount * regularPrice + bookingFee;
    } else {
      totalPrice = ticketAmount * vipPrice + bookingFee;
    }

    if (isGreenCamping) totalPrice += greenCampingPrice;
    if (isTent2Person) totalPrice += tent2PersonPrice;
    if (isTent3Person) totalPrice += tent3PersonPrice;

    return totalPrice;
  };

  // handleIncrement står for at øge antallet af billeter,
  // kontrollerer at man max kan købe fem billeter,
  // styrer state af setIsTent2Person og setIsTent3Person afhængigt af om newAmount er størrer end henholdsvis 2 eller 3. (Det er for at opfylde kravet om at man ikke må købe færrer end 2 eller 3 billeter og så vælge teltAddOn option)
  const handleIncrement = () => {
    if (ticketAmount < 5) {
      setTicketAmount((prevAmount) => {
        const newAmount = prevAmount + 1;
        if (newAmount < 2) {
          setIsTent2Person(false);
        }
        if (newAmount < 3) {
          setIsTent3Person(false);
        }
        return newAmount;
      });
    } else {
      setWarningMessage("Max 5 tickets can be bought at once");
    }
  };

  // Handle ticket amount decrement
  const handleDecrement = () => {
    if (ticketAmount === 1) {
      return;
    }
    setTicketAmount((prevAmount) => {
      const newAmount = Math.max(prevAmount - 1, 0);
      if (newAmount > 2) {
        setIsTent2Person(false);
      }
      if (newAmount > 3) {
        setIsTent3Person(false);
      }
      return newAmount;
    });
  };

  // Handle checkbox change for addons
  const handleCheckboxChange = (type, isChecked) => {
    switch (type) {
      case "greenCamping":
        setIsGreenCamping(isChecked);
        break;
      case "tent2Person":
        if (ticketAmount >= 2) {
          setIsTent2Person(isChecked);
        }
        break;
      case "tent3Person":
        if (ticketAmount >= 3) {
          setIsTent3Person(isChecked);
        }
        break;
      default:
        break;
    }
  };

  // Handle checkbox click for tent options
  const handleCheckboxClick = (type) => {
    switch (type) {
      case "tent2Person":
        if (ticketAmount < 2) {
          setTentWarningMessage(
            "You need to purchase 2 tickets to select this option."
          );
        }
        break;
      case "tent3Person":
        if (ticketAmount < 3) {
          setTentWarningMessage(
            "You need to purchase 3 tickets to select this option."
          );
        }
        break;
      default:
        break;
    }
  };

  // Reset warning messages after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setWarningMessage("");
      setTentWarningMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [warningMessage, tentWarningMessage]);

  return (
    <>
    <Timer duration={timeLeft} onTimeUpdate={updateTimeLeft} />
    <form action="/personal-info" method="GET">
      {/* Hidden inputs to pass data to next page */}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="ticketAmount" value={ticketAmount} />
      <input type="hidden" name="totalPrice" value={calculateTotalPrice()} />
      <input type="hidden" name="isGreenCamping" value={isGreenCamping} />
      <input type="hidden" name="isTent2Person" value={isTent2Person} />
      <input type="hidden" name="isTent3Person" value={isTent3Person} />
      <input type="hidden" name="reservationId" value={reservationId} />
      <input type="hidden" name="campingArea" value={formData.campingArea} />
      <input type="hidden" name="timeLeft" value={timeLeft} />

      {/* Ticket selection and pricing */}
      <article>
        <div className="flex justify-between bg-gray-100 rounded-lg p-3">
          <div>
            <TicketComponent2
              title={ticketType === "Regular" ? "Regular ticket" : "VIP ticket"}
              price={calculateTotalPrice()}
            />
          </div>
          <TicketSelector
            value={ticketAmount}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </div>

        {warningMessage && (
          <div className="p-3 text-red-500">{warningMessage}</div>
        )}

        {/* Add-ons for green camping and tents */}
        <GreenCamping
          title="Green camping"
          description="Help save the planet"
          description2="buy green camping for 249,-"
          buy="Add"
          checked={isGreenCamping}
          onCheckboxChange={(isChecked) =>
            handleCheckboxChange("greenCamping", isChecked)
          }
        />

        <TentAddOn
          title="Tent set up"
          description="Have a tent already set up for you"
          description2="2 person tent: 299,-"
          description3="3 person tent: 399,-"
          buy2person="Buy tent for 2"
          buy3person="Buy tent for 3"
          checked2Person={isTent2Person}
          checked3Person={isTent3Person}
          onCheckboxClick2Person={() => handleCheckboxClick("tent2Person")}
          onCheckboxClick3Person={() => handleCheckboxClick("tent3Person")}
          onCheckboxChange2Person={(isChecked) =>
            handleCheckboxChange("tent2Person", isChecked)
          }
          onCheckboxChange3Person={(isChecked) =>
            handleCheckboxChange("tent3Person", isChecked)
          }
        />

        {tentWarningMessage && (
          <div className="p-3 text-red-500">{tentWarningMessage}</div>
        )}

        {/* Navigation to the next page */}
        <div className="flex flex-col items-center p-3 mb-8">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Next Page
          </button>
        </div>
      </article>
    </form>
    </>
  );
};

export default Chooseticket;
