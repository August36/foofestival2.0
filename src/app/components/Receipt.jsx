import React from 'react';
import { useSearchParams } from "next/navigation";

const Receipt = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const ticketAmount = parseInt(searchParams.get("ticketAmount"));
  const totalPrice = parseInt(searchParams.get("totalPrice"));
  const isGreenCamping = searchParams.get("isGreenCamping") === "true";
  const isTent2Person = searchParams.get("isTent2Person") === "true";
  const isTent3Person = searchParams.get("isTent3Person") === "true";

  return (
    <section className="w-full bg-white flex justify-center items-center py-10">
      <div className="p-5 w-full max-w-lg border bg-gray-50 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-2">FooFestival</h1>
        <h2 className="text-xl mb-4">Receipt</h2>
        <p className="mb-4">Your order has been successfully completed</p>
        <h3 className="text-lg mb-2">Your order contains</h3>
        
        <div className="border-t-2 border-b-2 border-black py-2">
          <div className="grid grid-cols-4 gap-2">
            <p className="col-span-2 font-semibold">Description</p>
            <p className="col-span-1 font-semibold text-center">Quantity</p>
            <p className="col-span-1 font-semibold text-center">Price</p>
          </div>
        
          <div className="grid grid-cols-4 gap-2 mt-2">
            <p className="col-span-2">&#x2022; {type}-ticket</p>
            <p className="col-span-1 text-center">{ticketAmount}</p>
            <p className="col-span-1 text-center">{totalPrice},-</p>
          </div>

          {isGreenCamping && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              <p className="col-span-2">&#x2022; Green Camping</p>
              <p className="col-span-1 text-center"></p>
              <p className="col-span-1 text-center">Included</p>
            </div>
          )}

          {isTent2Person && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              <p className="col-span-2">&#x2022; 2-Person Tent</p>
              <p className="col-span-1 text-center">Included</p>
            </div>
          )}

          {isTent3Person && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              <p className="col-span-2">&#x2022; 3-Person Tent</p>
              <p className="col-span-1 text-center"></p>
              <p className="col-span-1 text-center">Included</p>
            </div>
          )}
        
        </div>
      </div>
    </section>
  );
}

export default Receipt;
