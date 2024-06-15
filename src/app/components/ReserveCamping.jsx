// Vi importere useState og useEffect som er react hooks.
// useState bruges til at deklarere og tracke states af de forskellige variabler
// useEffect bruges til at udføre side-effekter. side-effekter kan fx data-fetching eller manuelt ændre DOM'en.
import React, { useState, useEffect } from "react";
import FetchCampingSpots from "./FetchCampingSpots";
import { useSearchParams } from "next/navigation";

const ReserveCamping = () => {
  // Defination af "state": state er en værdi, eller et sæt af værdier der kan ændres dynamisk og påvirker hvordan en react komponent renderes.
  // En ændring af et state vil forsage en rerendering af komponenten, så brugeren kan se ændringerne.

  // Her sætter vi states op. useState accepterer et initial state (fx 1 tallet i ticketAmount), -
  // og returnerer to værdier: current state (altså fx er ticketAmount current state = 1), og en funktion til at opdatere state.

  // formData er en state variabel der holder data fra formen, initialiseret med et objekt med en tom "campingArea"
  const [formData, setFormData] = useState({
    campingArea: "",
  });
  const [ticketAmount, setTicketAmount] = useState(1);
  const [reserveMessage, setReserveMessage] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [campingAreaSelected, setCampingAreaSelected] = useState(false);
  const [campingDivClicked, setCampingDivClicked] = useState(false);
  // useSearchParams er et hook der giver adgang til query/search parameters
  const searchParams = useSearchParams();

  // handleInputChange håndterer ændringer i inputfelterne i formen.
  // Hvert inputfelt har en eventListener der lytter til "onChange" så når en bruger interagerer med et inputfelt, kaldes handleInputChange med eventet (det pågældende inputfelt) som argument.
  // Funktionen ekstraherer name og value fra eventet og opdaterer derefter formData ved at anvende ændringerne.
  // For eksempel, hvis brugeren interagerer med inputfeltet, der har name="campingArea",
  // vil handleInputChange opdatere formData-objektet, så campingArea's værdi ikke længere er tom, men lig med det område, som brugeren har valgt.
  // setFormData opdaterer formData's tilstand ved at bruge en callback-funktion, der med spread operatoren ændrer den tidligere tilstand (prevData)
  // og overskriver det specifikke name's value, med den nye value.
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Spread operator (...) allows an iterable such as an array or a string to be expanded into seperate elements
  // it "unpacks" each element in the iterable
  // Spread-operator skaber altid en ny kopi af datastrukturen (enten et array eller et objekt), hvilket tillader dig at tilføje eller ændre data uden at påvirke det oprindelige.
  // Den ændrer ikke det oprindelige array eller objekt, men snarere giver den dig en ny version af det, som du kan arbejde med.

  // Her bruges useEffect til at overvåge ændringer i "formData.campingArea" og opdatere "campingAreaSelected",
  // hvis et campingområde er valgt. Det gøres ved at bruge en strict inequality operator (!==),
  // som tjekker, om "formData.campingArea" ikke er en tom string.
  // Hvis "formData.campingArea" ikke er tom, sættes "campingAreaSelected" til true; ellers sættes den til false.
  useEffect(() => {
    setCampingAreaSelected(formData.campingArea !== "");
  }, [formData.campingArea]);

  // Reserve-camping-button har en eventListener monteret som lytter efter 'clicks'.
  // Når knappen klikkes aktiveres handleClick funktionen. Den sætter setCampingDivClicked til true (ignorer div delen af navnet, den referer til knappen).
  // Hvis et campingområde er valgt aktiveres funktionen "handlePutRequest", og hvis ikke, vises en warningmessage som fortæller brugeren at de skal vælge et område.
  // Så handleClick bruges bare til at tjekke om brugeren har valgt et campingområde, før de forsøger at gå videre.
  const handleClick = () => {
    setCampingDivClicked(true);
    if (campingAreaSelected) {
      handlePutRequest();
    } else {
      setReserveMessage("Please select a camping area.");
    }
  };

  // PUT request for at reservere campingområde. En PUT request bruges til at sende eller opdatere data til en server.

  // Igen kontrolleres der om et campingområde er valgt, før put requesten udføres. Dette sikrer at dataen kun sendes, hvis området er valgt.
  const handlePutRequest = async () => {
    if (!campingAreaSelected) {
      setReserveMessage("Please select a camping area.");
      return;
    }

    // Her oprettes reservationData-objektet, som indeholder dataen der skal sendes til serveren.
    // I dette tilfælde består reservationData af to key-value pairs: det valgte område og mængden af billetter valgt
    const reservationData = {
      area: formData.campingArea,
      amount: ticketAmount,
    };

    // Her bruges fetch funktionen til at sende en HTTP-anmodning til endpointet /reserve-spot.
    // Der angives at det er en PUT-anmodning og at der specificeres at dataen der sendes er i JSON-format.
    // til sidst konverteres 'reservationData' til JSON.
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

      // Hvis serveren svarer med en statuskode mellem 200 - 299 (angivet af 'response.ok') betragtes andmodningen som vellykket.
      // endpointet er lavet sådan at når den modtager en PUT-request, sendes der et svar tilbage som indeholder "reservationId"
      // Vi konvereterer svaret til JSON, og opdatere state af reservationID til at være lig med svaret(reservationsId'et).
      if (response.ok) {
        const data = await response.json();
        setReservationId(data.id);

        // Fordi at handlePutRequest er monteret på reserve-button, gør funktionen også at brugeren sendes til den næste side i flowet - /choose-ticket
        // og sender reservationsID og campingArea med som query-parameters via useSearchParams.
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

  return (
    <div className="container mx-auto p-4">
      <div className="p-3 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 mt-8">Reserve Camping</h1>
        <h3 className="text-lg font-semibold mb-4">Choose camping area</h3>
        {/* Her bruges FetchCampingSpots som er en get-request der henter et array af tilgængelige campingarea's fra /available-spots */}
        <FetchCampingSpots>
          {({ spots, error }) => (
            <>
              {error && <p className="text-red-500">Error: {error}</p>}

              {/* Her laves et 4-column grid, hvor at følgende indeles i hver sin column:
               radiobuttons, navnet på området, hvor mange spots området har i alt og til sidst hvor mange spots der er ledige*/}
              <div className="grid grid-cols-4 gap-4">
                <h4 className="font-semibold">Select</h4>
                <h4 className="font-semibold">Areas</h4>
                <h4 className="font-semibold">Spots</h4>
                <h4 className="font-semibold">Available Spots</h4>

                {/* Her bruges map-metoden til at vise den hentede data.
                spots er det array der er hentet fra /availabe-spots.
                map-metoden bruges til at itererer over hvert element(spot), i spots-arrayet
                index repræsenterer den aktuelle indeksposition for hvert spot-element i spots-arrayet.
                <React.Fragment> bruges til at gruppere flere elementer
                key={index} bruges til at give hver fragment en unik nøgle, som hjælper react med at identificere hvilke elementer der er ændret/tilføjet/fjernet.
                Der oprettes altså en div, et label og et input for hvert 'spot'.
                inputtet er en radiobutton, og når den klikkes aktiveres handleInputChange.
                */}
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

                    {/* object.values konverterer 'spot'-objektet til et array af dets værdier:
                    fx hvis spot er { area: "Nilfheim", spots: 200, avaiilable: 3 - bliver det til ["Nilfheim", 200, 3]
                      - Dette har jeg vidst gjort for at for at hvert 'spot' kun viser dens value, og ikke hele key-value pairet
                       - så det er altså for at skilde mig af med teksen "area", "spots" og "available" - da jeg allerede har givet disse overskrifter i 4-column griddet 
                    - Herefter bruges en span-container til at vise værdienerne fra det nyskabte 'spot' array.
                       */}
                    {Object.values(spot).map((value, i) => (
                      <span key={i} className="p-1">
                        {value}
                      </span>
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
            // Her bruges en ternary operator, der baseret på om campingAreaSelected er true eller false, tilføjer forskellige styles til knappen
            // En ternary operator er ninjakode versionen af et if/else statement -
            // den tager tre operander: en condition som er efterfulgt af et ?,
            // som er efterfulgt af en expression der eksekveres hvis conditionen er true, og til sidst en expression der eksekveres hvis conditionen er false.
            className={`bg-blue-500 text-white py-2 px-4 rounded ${
              campingAreaSelected
                ? "cursor-pointer"
                : "opacity-50 cursor-default"
            }`}
          >
            Reserve camping
          </button>
        </div>
        {reserveMessage && (
          <div
            className={`p-3 text-center mt-4 ${
              reserveMessage === "Please select a camping area."
                ? "text-red-500"
                : ""
            }`}
          >
            {reserveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReserveCamping;
