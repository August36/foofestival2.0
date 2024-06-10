import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Timer from "./Timer";

const Payment = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const ticketAmount = parseInt(searchParams.get("ticketAmount"));
  const totalPrice = parseInt(searchParams.get("totalPrice"));
  const isGreenCamping = searchParams.get("isGreenCamping") === "true";
  const isTent2Person = searchParams.get("isTent2Person") === "true";
  const isTent3Person = searchParams.get("isTent3Person") === "true";
  const reservationId = searchParams.get("reservationId");
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const day = searchParams.get("day");
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const address = searchParams.get("address");
  const city = searchParams.get("city");
  const zip = searchParams.get("zip");
  const country = searchParams.get("country");
  const telephone = searchParams.get("telephone");
  const email = searchParams.get("email");
  const [timeLeft, setTimeLeft] = useState(parseInt(searchParams.get("timeLeft")));

  const updateTimeLeft = (newTimeLeft) => {
    setTimeLeft(newTimeLeft);
  };

  const guestNames = [];
  for (let i = 0; i < ticketAmount - 1; i++) {
    guestNames.push(searchParams.get(`guestName${i + 1}`));
  }

  const { register, handleSubmit, formState: { errors }, trigger } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    const endpoint = "https://yehhhdwxrekwnvfpdaxf.supabase.co/rest/v1/foofest2";
    // Udkommenteret apiKey
    // const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaGhoZHd4cmVrd252ZnBkYXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1NDY1NTYsImV4cCI6MjAzMjEyMjU1Nn0.LMM7xRAUn2moW9TM8A5jQSuZtpFfc6RXk0k0KHngu-Q";

    const fulfillEndpoint = "https://abyssinian-aeolian-gazelle.glitch.me/fulfill-reservation";

    const headersList = {
      "Content-Type": "application/json",
      // apikey: apiKey,
      // Authorization: `Bearer ${apiKey}`,
    };

    const bodyContent = JSON.stringify(data);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headersList,
        body: bodyContent,
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${responseText}`);
      }

      if (responseText) {
        try {
          const result = JSON.parse(responseText);
          console.log("Data submitted successfully", result);
        } catch {
          throw new Error(`Failed to parse JSON response: ${responseText}`);
        }
      } else {
        console.log("Data submitted successfully, but no response body");
      }

      await fetch(fulfillEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservationId: data.reservationId }),
      });

      console.log("Reservation fulfilled successfully");
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    const queryParams = new URLSearchParams({
      type,
      ticketAmount: ticketAmount.toString(),
      totalPrice: totalPrice.toString(),
      isGreenCamping: isGreenCamping.toString(),
      isTent2Person: isTent2Person.toString(),
      isTent3Person: isTent3Person.toString(),
      reservationId,
    }).toString();

    window.location.href = `/receipt?${queryParams}`;
  };

  return (
    <>
      <Timer duration={timeLeft} onTimeUpdate={updateTimeLeft} />
      <section className="w-full bg-white flex justify-center items-center py-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action="/reciept"
          className="p-5 w-full max-w-lg border bg-gray-50 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-5">Payment Information</h2>

          <input type="hidden" {...register("type")} defaultValue={type} />
          <input type="hidden" {...register("ticketAmount")} defaultValue={ticketAmount} />
          <input type="hidden" {...register("totalPrice")} defaultValue={totalPrice} />
          <input type="hidden" {...register("isGreenCamping")} defaultValue={isGreenCamping} />
          <input type="hidden" {...register("isTent2Person")} defaultValue={isTent2Person} />
          <input type="hidden" {...register("isTent3Person")} defaultValue={isTent3Person} />
          <input type="hidden" {...register("reservationId")} defaultValue={reservationId} />
          <input type="hidden" {...register("firstname")} defaultValue={firstname} />
          <input type="hidden" {...register("lastname")} defaultValue={lastname} />
          <input type="hidden" {...register("day")} defaultValue={day} />
          <input type="hidden" {...register("month")} defaultValue={month} />
          <input type="hidden" {...register("year")} defaultValue={year} />
          <input type="hidden" {...register("address")} defaultValue={address} />
          <input type="hidden" {...register("city")} defaultValue={city} />
          <input type="hidden" {...register("zip")} defaultValue={zip} />
          <input type="hidden" {...register("country")} defaultValue={country} />
          <input type="hidden" {...register("telephone")} defaultValue={telephone} />
          <input type="hidden" {...register("email")} defaultValue={email} />

          {guestNames.map((guestName, index) => (
            <input
              key={index}
              type="hidden"
              {...register(`guestName${index + 1}`)}
              defaultValue={guestName}
            />
          ))}

          <section className="flex flex-col mb-5">
            <h3 className="text-lg font-semibold mb-3">Credit Card Information</h3>

            <label htmlFor="cardName" className="mb-2">
              Name on Card:
            </label>
            <input
              type="text"
              id="cardName"
              {...register("cardName", {
                required: { value: true, message: "Name on card is required" },
              })}
              onBlur={() => trigger("cardName")}
              className="border border-gray-300 rounded-md mb-3 p-2"
            />
            {errors.cardName && <p className="text-red-500">{errors.cardName.message}</p>}

            <label htmlFor="cardNumber" className="mb-2">
              Card Number:
            </label>
            <input
              type="text"
              id="cardNumber"
              maxLength="16"
              {...register("cardNumber", {
                required: { value: true, message: "Card number is required" },
                pattern: {
                  value: /^\d{16}$/,
                  message: "Card number must be 16 digits",
                },
              })}
              onBlur={() => trigger("cardNumber")}
              className="border border-gray-300 rounded-md mb-3 p-2"
            />
            {errors.cardNumber && <p className="text-red-500">{errors.cardNumber.message}</p>}

            <label htmlFor="expMonth" className="mb-2">
              Expiration Month:
            </label>
            <select
              id="expMonth"
              {...register("expMonth", {
                required: {
                  value: true,
                  message: "Expiration month is required",
                },
              })}
              onBlur={() => trigger("expMonth")}
              className="border border-gray-300 rounded-md mb-3 p-2"
            >
              <option value="">Select a month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")} -{" "}
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            {errors.expMonth && <p className="text-red-500">{errors.expMonth.message}</p>}

            <label htmlFor="expYear" className="mb-2">
              Expiration Year:
            </label>
            <input
              type="text"
              id="expYear"
              maxLength={4}
              {...register("expYear", {
                required: { value: true, message: "Expiration Year is required" },
                min: {
                  value: new Date().getFullYear(),
                  message: `Year must be at least ${new Date().getFullYear()}`,
                },
                max: { value: 2035, message: "Year cannot be more than 2035" },
              })}
              onBlur={() => trigger("expYear")}
              className="border border-gray-300 rounded-md mb-3 p-2"
            />
            {errors.expYear && <p className="text-red-500">{errors.expYear.message}</p>}

            <label htmlFor="cvv" className="mb-2">
              CVV:
            </label>
            <input
              type="text"
              id="cvv"
              maxLength={3}
              {...register("cvv", {
                required: { value: true, message: "CVV is required" },
                pattern: {
                  value: /^\d{3,4}$/,
                  message: "CVV must be 3 or 4 digits",
                },
              })}
              onBlur={() => trigger("cvv")}
              className="border border-gray-300 rounded-md mb-3 p-2"
            />
            {errors.cvv && <p className="text-red-500">{errors.cvv.message}</p>}
          </section>

          <div className="flex flex-col items-center p-3 mb-8">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            >
              Pay Now
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Payment;
