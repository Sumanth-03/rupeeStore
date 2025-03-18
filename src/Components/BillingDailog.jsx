import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, IconButton } from "@material-tailwind/react";

const BillingDetailsDialog = ({ open, onClose, data, handlePay, setIsLoading }) => {
  const handlePayment = async () => {
    // setIsLoading(true);
    try {
      await handlePay(1);
    } finally {
      // setIsLoading(false);
      onClose();
    }
  }
  return (
    <Dialog open={open} handler={onClose} size="sm" className="fixed bottom-0 mb-0 mx-0 w-[100vw] md:w-[600px] max-w-[100vw]">
      <DialogHeader className="flex justify-between items-center px-4 py-3">
        <span className="text-lg font-semibold text-customGray">Billing Details</span>
        <IconButton variant="text" size="sm" onClick={onClose}>
          ✖
        </IconButton>
      </DialogHeader>

      <DialogBody className="px-4 py-2 space-y-2 text-base font-sans flex flex-col gap-2 font-medium">
        <div className="flex justify-between text-gray-500 border-b p-2">
          <span>Sub Total</span>
          <span className="font-medium">₹ {data?.original_price}</span>
        </div>
        <div className="flex justify-between text-gray-500 border-b p-2">
          <span>Offer Discount</span>
          <span className="font-medium">₹ {data?.original_price - data?.discounted_price}</span>
        </div>
        {data?.rewardApplied > 0 && (
          <div className="flex justify-between border-b p-2 text-gray-500">
            <span>Point Discount</span>
            <span className="font-medium text-[#24CB7E]">₹ {data.rewardApplied}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-500 p-2">
          <span>Total Payable</span>
          <span className="text-black">₹ {data?.discounted_price - data?.rewardApplied}</span>
        </div>
      </DialogBody>

      <DialogFooter className="px-4 py-3">
        <Button  className="w-full bg-buttonBg text-lg font-medium capitalize" onClick={handlePayment}>
          Continue
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default BillingDetailsDialog;
