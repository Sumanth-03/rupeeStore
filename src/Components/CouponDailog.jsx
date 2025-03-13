import { useState } from "react";
import { Dialog, DialogBody, DialogHeader, DialogFooter, Button, Input } from "@material-tailwind/react";
import cross from '../Assets/Cross.svg'
import offerIcon from '../Assets/offerIcon.svg'

export default function CouponDialog({ open, setOpen, setCoupon }) {
  const [couponCode, setCouponCode] = useState("");
  const handleApply = (value) => {
    setCoupon(value)
    setCouponCode('')
    setOpen(false)
  }

  return (
    <Dialog open={open} handler={setOpen} className="fixed bottom-0 mb-0 mx-0 w-[100vw] md:w-[600px] max-w-[100vw]">
      <DialogHeader className="flex justify-between items-center">
        <span className="text-lg text-customGray font-semibold">Apply Coupon</span>
        <Button variant="text" onClick={() => {handleApply({})}} className="p-2"><img  src={cross}></img></Button>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg p-2">
          <Input
            type="text"
            label="Enter Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="text-lg font-light  flex-1  h-full"
            containerProps={{
              className: "h-full border-1 border-customGray focus:border-none",
            }}
            inputProps={{
              className: "h-full border-1 border-customGray focus:border-none",
            }}
          />
          <Button onClick={()=>handleApply({code:couponCode,discount:null})} disabled={!couponCode} className="bg-customGray px-4 py-2 text-lg rounded-lg font-light capitalize text-white">
            Apply
          </Button>
        </div>
        <CouponCard code="YLYDEAL" discount="800" handleApply={handleApply}/>
        <CouponCard code="IB00324" discount="1,000" handleApply={handleApply}/>
      </DialogBody>

    </Dialog>
  );
}

const CouponCard = ({ code, discount, handleApply }) => {
  return (
    <div className="flex flex-col justify-between items-center p-3 rounded-lg">
      <h1 className="font-semibold font-sans text-lg self-start text-customGray">Discount worth ₹ {discount}.</h1>
      <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row  items-center gap-2">
        <span className="bg-[#D1EFE1] text-black px-2 py-1 rounded-md  font-medium flex gap-1"><img src={offerIcon}></img>{code}</span>
        <span className="text-[#FF5800] font-medium">Save ₹ {discount}</span>
      </div>
      <Button onClick={()=>handleApply({code:code,discount:discount})} variant="text" className="text-customGray text-lg font-light p-2">Apply</Button>
      </div>
    </div>
  );
};
