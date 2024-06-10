import React, { useEffect, useState } from "react";
import Countries from "./Countries";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useSearchParams } from "next/navigation";
import Timer from "./Timer";

const PersonalInfo = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const ticketAmount = parseInt(searchParams.get("ticketAmount"));
  const totalPrice = parseInt(searchParams.get("totalPrice"));
  const isGreenCamping = searchParams.get("isGreenCamping") === "true";
  const isTent2Person = searchParams.get("isTent2Person") === "true";
  const isTent3Person = searchParams.get("isTent3Person") === "true";
  const reservationId = searchParams.get("reservationId");

  const [guestInputs, setGuestInputs] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300000);
  const { register, control, formState: { errors }, trigger } = useForm();

  const updateTimeLeft = (newTimeLeft) => {
    setTimeLeft(newTimeLeft);
  };

  useEffect(() => {
    const inputs = [];
    if (ticketAmount > 1) {
      for (let i = 0; i < ticketAmount - 1; i++) {
        inputs.push(
          <div key={i} className="guest-section mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Guest {i + 1}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Guest {i + 1} Name</h3>
                <label htmlFor={`guest${i + 1}firstname`} className="mb-2">
                  First Name:
                </label>
                <input
                  type="text"
                  id={`guest${i + 1}firstname`}
                  {...register(`guest${i + 1}firstname`, {
                    required: `Guest ${i + 1} First Name is required`,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}firstname`)}
                />
                <p className="text-red-500 m-2">{errors[`guest${i + 1}firstname`]?.message}</p>

                <label htmlFor={`guest${i + 1}lastname`} className="mb-2">
                  Last Name:
                </label>
                <input
                  type="text"
                  id={`guest${i + 1}lastname`}
                  {...register(`guest${i + 1}lastname`, {
                    required: `Guest ${i + 1} Last Name is required`,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}lastname`)}
                />
                <p className="text-red-500 m-2">{errors[`guest${i + 1}lastname`]?.message}</p>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Guest {i + 1} Date of Birth</h3>
                <label htmlFor={`guest${i + 1}day`} className="mb-2">
                  Day:
                </label>
                <input
                  type="number"
                  id={`guest${i + 1}day`}
                  {...register(`guest${i + 1}day`, {
                    required: `Guest ${i + 1} Day is required`,
                    min: { value: 1, message: "Day must be at least 1" },
                    max: { value: 31, message: "Day cannot be more than 31" },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}day`)}
                />
                <p className="text-red-500 m-2">{errors[`guest${i + 1}day`]?.message}</p>

                <label htmlFor={`guest${i + 1}month`} className="mb-2">
                  Month:
                </label>
                <select
                  id={`guest${i + 1}month`}
                  {...register(`guest${i + 1}month`, {
                    required: `Guest ${i + 1} Month is required`,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}month`)}
                >
                  <option value="">Select a month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <p className="text-red-500 m-2">{errors[`guest${i + 1}month`]?.message}</p>

                <label htmlFor={`guest${i + 1}year`} className="mb-2">
                  Year:
                </label>
                <input
                  type="text"
                  id={`guest${i + 1}year`}
                  maxLength={4}
                  {...register(`guest${i + 1}year`, {
                    required: `Guest ${i + 1} Year is required`,
                    min: { value: 1900, message: "Year must be at least 1900" },
                    max: {
                      value: new Date().getFullYear(),
                      message: `Year cannot be more than ${new Date().getFullYear()}`,
                    },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}year`)}
                />
                <p className="text-red-500 m-2">{errors[`guest${i + 1}year`]?.message}</p>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Guest {i + 1} Address</h3>
                <label htmlFor={`guest${i + 1}address`} className="mb-2">
                  Address:
                </label>
                <input
                  type="text"
                  id={`guest${i + 1}address`}
                  {...register(`guest${i + 1}address`, {
                    required: `Guest ${i + 1} Address is required`,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}address`)}
                />
                <p className="text-red-500 m-2">{errors[`guest${i + 1}address`]?.message}</p>

                <label htmlFor={`guest${i + 1}city`} className="mb-2">
                  City:
                </label>
                <input
                  type="text"
                  id={`guest${i + 1}city`}
                  {...register(`guest${i + 1}city`, {
                    required: `Guest ${i + 1} City is required`,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}city`)}
                />
                <p className="text-red-500 m-2">{errors[`guest${i + 1}city`]?.message}</p>

                <label htmlFor={`guest${i + 1}zip`} className="mb-2">
                  Zip:
                </label>
                <input
                  type="text"
                  id={`guest${i + 1}zip`}
                  {...register(`guest${i + 1}zip`, {
                    required: `Guest ${i + 1} Zip/Postal code is required`,
                    pattern: {
                      value: /^(\d{4}|\d{4}\s?\w{2})$/,
                      message: "Invalid postal code format",
                    },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}zip`)}
                />
                <p className="text-red-500 m-2">{errors[`guest${i + 1}zip`]?.message}</p>

                <label htmlFor={`guest${i + 1}country`} className="mb-2">
                  Country:
                </label>
                <select
                  id={`guest${i + 1}country`}
                  {...register(`guest${i + 1}country`, {
                    required: `Guest ${i + 1} Country is required`,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger(`guest${i + 1}country`)}
                >
                  <option value="">Select a country</option>
                  {Countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <p className="text-red-500 m-2">{errors[`guest${i + 1}country`]?.message}</p>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Contact</h3>
                <label htmlFor="telephone" className="mb-2">
                  Telephone:
                </label>
                <input
                  type="text"
                  id="telephone"
                  {...register("telephone", {
                    required: "Telephone number is required",
                    pattern: {
                      value: /^(\d{2}\s?){3}\d{2}$/,
                      message: "Invalid phone number format",
                    },
                    setValueAs: normalizePhoneNumber,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("telephone")}
                />
                <p className="text-red-500 m-2">{errors.telephone?.message}</p>
                <label htmlFor="email" className="mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                    validate: {
                      notAdmin: (fieldValue) =>
                        fieldValue !== "admin@example.com" ||
                        "Enter a different email address",
                      notBlackListed: (fieldValue) =>
                        !fieldValue.endsWith("baddomain.com") ||
                        "This domain is not supported",
                    },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("email")}
                />
                <p className="text-red-500 m-2">{errors.email?.message}</p>
              </div>



            </div>
          </div>
        );
      }
      setGuestInputs(inputs);
    }
  }, [ticketAmount, register, errors, trigger]);

  const normalizePhoneNumber = (value) => value.replace(/[\s-]/g, "");

  // const onSubmit = (data) => {
  //   console.log(data);
  // };

  return (
    <>
      <Timer duration={timeLeft} onTimeUpdate={updateTimeLeft} />
      <section className="w-full bg-gray-50 p-4 md:p-8">
        <form
          // onSubmit={handleSubmit(onSubmit)}
          action="/payment"
          noValidate
          className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6"
        >
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-2xl font-bold mb-5">Personal Info</h2>
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="ticketAmount" value={ticketAmount} />
            <input type="hidden" name="totalPrice" value={totalPrice} />
            <input type="hidden" name="isGreenCamping" value={isGreenCamping} />
            <input type="hidden" name="isTent2Person" value={isTent2Person} />
            <input type="hidden" name="isTent3Person" value={isTent3Person} />
            <input type="hidden" name="reservationId" value={reservationId} />
            <input type="hidden" name="timeLeft" value={timeLeft} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Name</h3>
                <label htmlFor="firstname" className="mb-2">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstname"
                  {...register("firstname", {
                    required: "First Name is required",
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("firstname")}
                />
                <p className="text-red-500 m-2">{errors.firstname?.message}</p>
                <label htmlFor="lastname" className="mb-2">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastname"
                  {...register("lastname", { required: "Last Name is required" })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("lastname")}
                />
                <p className="text-red-500 m-2">{errors.lastname?.message}</p>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Date of Birth</h3>
                <label htmlFor="day" className="mb-2">
                  Day:
                </label>
                <input
                  type="number"
                  id="day"
                  {...register("day", {
                    required: "Day is required",
                    min: { value: 1, message: "Day must be at least 1" },
                    max: { value: 31, message: "Day cannot be more than 31" },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("day")}
                />
                <p className="text-red-500 m-2">{errors.day?.message}</p>
                <label htmlFor="month" className="mb-2">
                  Month:
                </label>
                <select
                  id="month"
                  {...register("month", { required: "Month is required" })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("month")}
                >
                  <option value="">Select a month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <p className="text-red-500 m-2">{errors.month?.message}</p>
                <label htmlFor="year" className="mb-2">
                  Year:
                </label>
                <input
                  type="text"
                  id="year"
                  maxLength={4}
                  {...register("year", {
                    required: "Year is required",
                    min: { value: 1900, message: "Year must be at least 1900" },
                    max: {
                      value: new Date().getFullYear(),
                      message: `Year cannot be more than ${new Date().getFullYear()}`,
                    },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("year")}
                />
                <p className="text-red-500 m-2">{errors.year?.message}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Address</h3>
                <label htmlFor="address" className="mb-2">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  {...register("address", { required: "Address is required" })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("address")}
                />
                <p className="text-red-500 m-2">{errors.address?.message}</p>
                <label htmlFor="city" className="mb-2">
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  {...register("city", { required: "City is required" })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("city")}
                />
                <p className="text-red-500 m-2">{errors.city?.message}</p>
                <label htmlFor="zip" className="mb-2">
                  Zip:
                </label>
                <input
                  type="text"
                  id="zip"
                  {...register("zip", {
                    required: "Zip/Postal code is required",
                    pattern: {
                      value: /^(\d{4}|\d{4}\s?\w{2})$/,
                      message: "Invalid postal code format",
                    },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("zip")}
                />
                <p className="text-red-500 m-2">{errors.zip?.message}</p>
                <label htmlFor="country" className="mb-2">
                  Country:
                </label>
                <select
                  id="country"
                  {...register("country", { required: "Country is required" })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("country")}
                >
                  <option value="">Select a country</option>
                  {Countries.map((country, index) => (
                    <option key={index} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <p className="text-red-500 m-2">{errors.country?.message}</p>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-3">Contact</h3>
                <label htmlFor="telephone" className="mb-2">
                  Telephone:
                </label>
                <input
                  type="text"
                  id="telephone"
                  {...register("telephone", {
                    required: "Telephone number is required",
                    pattern: {
                      value: /^(\d{2}\s?){3}\d{2}$/,
                      message: "Invalid phone number format",
                    },
                    setValueAs: normalizePhoneNumber,
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("telephone")}
                />
                <p className="text-red-500 m-2">{errors.telephone?.message}</p>
                <label htmlFor="email" className="mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                    validate: {
                      notAdmin: (fieldValue) =>
                        fieldValue !== "admin@example.com" ||
                        "Enter a different email address",
                      notBlackListed: (fieldValue) =>
                        !fieldValue.endsWith("baddomain.com") ||
                        "This domain is not supported",
                    },
                  })}
                  className="border border-gray-300 rounded-md mb-3 p-2"
                  onBlur={() => trigger("email")}
                />
                <p className="text-red-500 m-2">{errors.email?.message}</p>
              </div>
            </div>
          </div>

          {guestInputs.map((input, index) => (
            <React.Fragment key={index}>{input}</React.Fragment>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
        <DevTool control={control} />
      </section>
    </>
  );
};

export default PersonalInfo;