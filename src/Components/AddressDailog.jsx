import React ,{ useEffect, useState } from "react";
import { Dialog, DialogBody, DialogHeader, DialogFooter, Button, Input, Textarea, Select, Option, Radio } from "@material-tailwind/react";
import cross from '../Assets/Cross.svg'
import { makeApiCall, makeApiCallWithAuth, makeApiGetCallWithAuth } from '../Services/Api'

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal"
];

const AddressDialogs = ({ openAdd, setOpenAdd, openSelect, setOpenSelect, selectedAddress ,setSelectedAddress }) => {
  const [address, setAddress] = useState([])
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});
  const [tempSelectedAddress, setTempSelectedAddress] = useState(selectedAddress);
  const close = () => {
    setForm({
      name: "",
      mobile: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      pin: "",
    })
    setErrors({})
    setOpenAdd(false);
  }

  const handleChangeAddress = () => {
    setSelectedAddress(tempSelectedAddress);
    setOpenSelect(false);
};

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "name":
        if (!value.trim()) errorMsg = "Name is required.";
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) errorMsg = "Enter a valid 10-digit mobile number.";
        break;
      case "address":
        if (!/^[a-zA-Z0-9, ]+$/.test(value.trim())) {
          errorMsg = "Address can only contain alphanumeric characters and commas.";
        } else if (!value.trim()) {
          errorMsg = "Address is required.";
        }
        break;
      case "city":
        if (!/^[a-zA-Z0-9 ]+$/.test(value.trim())) {
          errorMsg = "City can only contain alphanumeric characters.";
        } else if (!value.trim()) {
          errorMsg = "City is required.";
        }
        break;
      case "state":
        if (!value.trim()) errorMsg = "State is required.";
        break;
      case "pin":
        if (!/^\d{6}$/.test(value)) errorMsg = "Enter a valid 6-digit PIN code.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "mobile" || name === "pin") {
      value = Number(value); 
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value); // Validate on change
  };

  const handleSubmit = () => {
    let newErrors = {};

    Object.keys(form).forEach((key) => validateField(key, form[key]));

    if (Object.values(newErrors).some((msg) => msg !== "")) {
      setErrors(newErrors);
      return;
    }

    console.log("Calling API with:", form);
    makeApiCallWithAuth('addAddress',form)
      .then((response) => {
          if (response.data?.data) {
            console.log(response)
          }
      })
      .catch((e) => console.log("err", e))
    
    close()
  };

  useEffect(()=>{
    if (!openSelect) return
    makeApiGetCallWithAuth('getAddress')
    .then((response) => {
        if (response.data?.data) {
          console.log(response)
          setAddress(response.data?.data)
        }
    })
    .catch((e) => console.log("err", e))
  },[openSelect])

  return (
    <>
      <Dialog open={openAdd} handler={() => setOpenAdd(false)} className="fixed bottom-0 mb-0 mx-0 w-[100vw] md:w-[600px] max-w-[100vw]">
      <DialogHeader className="text-lg font-medium flex justify-between">
        <p className="max-w-[80%]">Add Address</p>
        <Button variant="text" onClick={() => close()} className="p-2">
          <img src={cross} alt="Close" />
        </Button>
      </DialogHeader>

      <DialogBody className="p-2 py-4 border-2 border-gray-200 mx-3 flex flex-col gap-4 rounded-lg mb-5">
        <div>
          <Input label="Name" name="name" value={form.name} onChange={handleChange} className="" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <Input label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} className="" />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>

        <div>
          <Textarea label="Address" name="address" value={form.address} onChange={handleChange} className="" />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <Input label="Apartment, suite, etc. (Optional)" name="apartment" value={form.apartment} onChange={handleChange} className="" />

        <div>
          <Input label="City" name="city" value={form.city} onChange={handleChange} className="" />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>
        {console.log(form.state)}
        <div className="relative">
          <Select label="State" value={form.state} name="state"  onChange={(value) => handleChange({ target: { value, name: "state" } })} className="text-black">
            <Option value="sate" >Select a state</Option>

            {indianStates.map((state) => (
              <Option key={state} value={state} selected={form.state === state}>
                {state}
              </Option>
            ))}

          </Select>
          <span className="absolute top-2 left-3">{form.state}</span>
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>

        <div>
          <Input label="Pin Code" name="pin" value={form.pin} onChange={handleChange} className="" />
          {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button onClick={handleSubmit} className="w-full bg-buttonBg capitalize font-medium text-lg">
          Save
        </Button>
      </DialogFooter>
      </Dialog>

      <Dialog open={openSelect} handler={() => setOpenSelect(false)} className="fixed bottom-0 mb-0 mx-0 w-[100vw] md:w-[600px] max-w-[100vw]">
        <DialogHeader className="font-body text-base flex justify-between text-customGray">
          <p className="max-w-[80%]">Where should we deliver your order?</p>
          <Button variant="text" onClick={() => setOpenSelect(false)} className="p-2"><img  src={cross}></img></Button>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
          {address.map((item, index) => (
            <div key={index} className="border p-2 rounded-lg flex flex-row items-start">
              {/* Radio Button */}
              <Radio
                name="address"
                className="w-5"
                color="#ff0000"
                checked={tempSelectedAddress.address === item.address} // Using mobile as a unique identifier
                onChange={() => setTempSelectedAddress(item)}
              />
              
              {/* Address Details */}
              <div className="font-sans ml-2">
                <span className="text-customGray font-medium">{item.name}</span><br/>
                <span>
                  {item?.address}, {item?.city}, {item?.state} - {item?.pin}
                </span>
              </div>
            </div>
          ))}
            <Button variant="text" className="text-blue-500 border font-medium" onClick={() => {setOpenAdd(true); setOpenSelect(false)}}>
              + ADD NEW
            </Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => handleChangeAddress()} className="w-full bg-buttonBg capitalize font-medium text-lg">Confirm</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddressDialogs;
