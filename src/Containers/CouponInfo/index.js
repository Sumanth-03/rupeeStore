import React, {useEffect, useState} from 'react'
import Backwhite from '../../Assets/back_white1.svg'
import backdark from '../../Assets/back_dark1.svg'
import { Button, Spinner, Dialog, Card, CardBody, CardFooter, Typography, Switch } from '@material-tailwind/react'
import { useNavigate,useLocation, Link} from 'react-router-dom'
import { makeApiCall, makeApiCallWithAuth, makeApiGetCallWithAuth,makeApiGetCallWithAuthCheggout } from '../../Services/Api' 
import "./style.css"
import rightSign from '../../Assets/rightSign.svg'
import wrongSign from '../../Assets/wrongSign.svg'

import coin from '../../Assets/coin.svg'
import voucher from '../../Assets/voucher.svg'
import packageIcon from '../../Assets/package.svg'
import CouponDialog from '../../Components/CouponDailog'
import AddressDialogs from '../../Components/AddressDailog'
import BillingDetailsDialog from '../../Components/BillingDailog'
import deleveryTick from '../../Assets/deleveryTick.svg'
import copy from '../../Assets/copy.svg'
import paymentNext from '../../Assets/paymentNext.svg'
import pending from '../../Assets/pending.svg'
import banner from '../../Assets/scratchbanner.png'

function CouponInfo() {
  const [tnc, setTnc] = useState([])
  const [luma, setLuma] = useState(false)
  const [isloading, setIsloading] = useState(false);
  const [campaignName, setCampaignName] = useState(false)
  
  const [selectedAddress, setSelectedAddress] = useState({});
  const [orderDetails, setOrderDetails] = useState({})
  const [productDeliverable, setProductDeliverable] = useState(true);
  const navigate = useNavigate();
  const location = useLocation()
  const [showAll, setShowAll] = useState(false);

  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    const isMobile = width <= 400;

useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('coupon'))[0]?.details || JSON.parse(sessionStorage.getItem('coupon'))
    setOrderDetails(data)
    setProductDeliverable(data.offer_format == 2)

    const isValidCampaignName = (name) => 
      name !== null && 
      name !== undefined && 
      name !== "null" && 
      name !== "undefined" && 
      name.trim() !== ""; 
    
    if (isValidCampaignName(data?.campaign_name)) {
      setCampaignName(data.campaign_name);
    }
    // if (data?.campaign_name) {
    // sessionStorage.setItem('hasRunBefore', 'true');
    // makeApiGetCallWithAuthCheggout(data?.campaign_name)
    // }
    const {amount,created_at,id,order_id,pay_mode,...fulladdress} = data
    setSelectedAddress(fulladdress)

    setTnc(data?.tnc?.split("\r\n"))
    var c = data.up_color.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue
    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709        
    if(luma < 200) {setLuma(true)}
},[]);


  const CustomCard = ({icon,iconBg, text, children}) => {
    return(
      <div 
        className={`mt-3 flex justify-between items-center p-3 my-2 border border-gray-300 rounded-2xl shadow-sm bg-white`}
      >
      {icon && 
      <div className={`p-3 rounded-full`} style={{ backgroundColor: iconBg }}>
      <img src={icon} alt="icon" className="w-8 h-8" />
      </div>
      }
      <p className="flex-1 text-gray-800 font-medium text-lg ml-3">{text}</p>
      <div className='p-2'>
      {children}
      </div>
    </div>
    )
  }
  console.log(orderDetails)
  return (
    <div className='container overflow-y-auto h-screen'>
      {isloading && 
      <div className="spinner-overlay z-30">
          <div className="spinner-container">
          <Spinner  size="lg" classNames={{circle1: "border-b-[#27374D]"  }}/>
          </div>
      </div>
      }
      {orderDetails?.product_name &&
      <>
      <div className="h-[15.5rem] top-0 relative mb-[4.2rem]">
        {luma?
        <img src={Backwhite} className="absolute pt-3 ml-3 z-10" alt="back" onClick={()=>{navigate('/coupons')}}/>  
        :
        <img src={backdark} className="absolute pt-3 ml-3 z-10" alt="back" onClick={()=>{navigate('/coupons')}}/>
        }

        <div className='absolute -bottom-5 translate-y-1/2 right-1/2 translate-x-1/2 z-10  flex flex-col items-center'>
          <div className="w-fit bg-tranferent rounded-full p- aspect-square flex items-center shadow-md">
          <img src={orderDetails?.brand_logo} className="w-16" alt="" />
          </div>
          <span className='font-sans font-[600] opacity-80 text-base text-customGray mt-1 h-5'>{orderDetails?.brand_name}</span>
        </div>
        
        <div className={`absolute w-screen -mt-10 h-72`} style={{ backgroundColor: `${orderDetails?.down_color}`}}>
          <div className={`relative w-screen -mt-10 h-44 rounded-br-[30px]`} style={{ backgroundColor: `${orderDetails?.up_color}`}}></div>
            <div className={`relative w-screen -mt-10 h-44 rounded-bl-[260px] rounded-br-[310px]`} style={{ backgroundColor: `${orderDetails?.up_color}`}}>
            <div className="absolute  left-1/2 -translate-x-1/2 bottom-5">
              <img src={orderDetails?.product_pic || orderDetails?.coupon_page_logo} className="w-48 h-48" alt="" />
            </div>
          </div>
        </div>
      </div>
      </>
      }
      
      <>
        <div className='flex flex-col gap-2'>
        <h1 className={`text-center w-full font-sans text-2xl font-bold text-customGray pt-1`} >{orderDetails?.product_name}</h1>
        { !productDeliverable && 
        <>
          <p className='text-center text-base font-semibold text-customGray font-sans '>
          Expires on {new Date(orderDetails?.offer_validity).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
          </p>
          <div className='my-2 mx-3 border-2 border-dashed border-black rounded-full flex flex-row items-center justify-between p-1'>
          {orderDetails?.redeem_status !== 2 ?
          <span className='px-3 font-medium text-xl text-customGray'>{orderDetails?.coupon_code || orderDetails?.redeem_code}</span>
          :
          <span className='px-3 font-bold text-xl text-customGray tracking-widest pt-2 pl-4'>**********</span>
          }
          <Button onClick={()=>{navigator.clipboard.writeText(orderDetails?.coupon_code || orderDetails?.redeem_code);makeApiCallWithAuth('trackEvent', {event: 4, offer: orderDetails?.id, mop: 22})}} variant='text' className='flex gap-2 items-center'>
            <img src={copy}></img>
          </Button>
          
          </div>
          <div className='w-full -mt-[0.8rem] mb-0 text-right'><span className='text-xs font-light mr-6'>Copy Code</span></div>
          {orderDetails?.redeem_status === 2 && <p className='px-6 text-sm -mt-3 mb-2 pt-1 text-[#D4082D]'>NOTE : Please check after 15-20 mins, if your payment went through your code will be generated.</p>}
        </>
        }


       </div>
        {campaignName &&
        <div className="h-[104px] py-2 rounded-3xl flex pb-2 justify-center bg-white mb-10">
            <Link to="/exitpwa?launch=PGNsaWNrPmh0dHBzOi8vY2xpY2suY2hlZ2dvdXQuY29tP3R5cGU9cmV3YXJkJmlkPTA8L2NsaWNrPg==">
                <img src={banner} className="rounded-3xl w-96" alt="Banner" />
            </Link>
        </div>
       }
       
        <div className={`relative flex flex-col border rounded-xl p-3 my-2 shadow-md mx-3 ${productDeliverable ? 'mb-3 mt-5' : 'mb-3'} text-black`}>
          <h1 className='font-bold opacity-70 text-lg '>Order Details</h1>
          <p className='text-sm font-medium  opacity-70'>{`Availed for ₹  ${orderDetails.amount || 1} `}</p>
          <div className='flex font-medium  opacity-80 justify-between'>
          <span className='text-sm'>Order ID : {orderDetails?.order_id}</span>
          <span className='text-sm'>
            {(orderDetails?.purchase_time || orderDetails.created_at) &&
              new Date(orderDetails.purchase_time || orderDetails.created_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              }) + 
              ", " + 
              new Date(orderDetails.purchase_time  || orderDetails.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
          </span>
          </div>
          {/* {productDeliverable && removed mb-12
          <div className='absolute bottom-0 translate-y-8 flex gap-1'><img src={deleveryTick} className='w-4'></img> Expected delivery date  {orderDetails?.deliveryDate}</div>
          } */}
          {orderDetails?.redeem_status !== 2 ?
              <div className='[background:linear-gradient(45deg,#17B46B,#24CB7E)] p-3 text-xs rounded-full absolute top-2 right-2 text-white py-1 px-4'>Success</div>
            : 
            <div className='[background:linear-gradient(#FFB400,#FF9635)] p-3 text-xs rounded-full absolute top-2 right-2 text-white py-1 px-4 min-w-fit flex'><img className='w-3 mr-1'src={pending}></img>Pending</div>
          }
          </div>
      </>

      <div className={`px-3 pt-1 rounded-t-2xl bg-[#F9F9F9] ${!productDeliverable ? 'mt-5 pt-2' : ''}`} style={{ height: `calc(100vh - 450px)` }}>
        {productDeliverable &&
            <CustomCard 
            icon={packageIcon} 
            iconBg='#FCF7DF' 
            text={
              <div className='flex flex-col'>{console.log(selectedAddress)}
                <p className='flex-1 text-gray-800 font-medium text-lg'>Delivering to</p>
                {selectedAddress?.address ? (
                  <>
                    <p className='text-sm'>
                      {selectedAddress?.address}, 
                      {selectedAddress?.city}
                    </p>
                  </>
                ) : (
                  <p className='text-sm text-gray-500'>No address selected</p>
                )}
              </div>
            }
          >
            <Button className='bg-white border-none shadow-none w-fit p-0'><img src={backdark} className='rotate-180 w-3'></img></Button>
          </CustomCard>
        }
          
        
        <div className={`border-2 border-solid-blue-950 solid-opacity-10 rounded-xl shadow-md h-fit mt-2 p-2 pb-2 bg-[#FFFFFF] `}>
          <div className="text-[#000] text-xl font-medium tracking-wide pl-2 py-3">Details</div>
          <div className="list-decimal text-[#021555] text-sm font-normal pl-2">
            <ul className="pl-5 list-decimal font-sans">
            <li className="pb-3">Avail the deal by redeeming your points</li>
            <li className="pb-3">You will get a coupon code.</li>
            <li className="pb-3">Click on 'Redeem Now' and you will be redirected to the brand website</li>
            <li className="pb-3">Add product to cart and apply the coupon code during checkout.</li>
            </ul>
          </div>
        </div>

        <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-xl shadow-md h-fit mt-3 p-2 pb-2 bg-[#FFFFFF]">
          <div className="text-[#000] text-xl font-medium tracking-wide pl-2 py-3">Terms and Conditions</div>
          <div className="text-[#021555] text-sm font-normal pl-2">
            {tnc &&
            <div>
              <ul className="pl-5 list-decimal text-[#021555] text-sm font-normal font-sans">
                {tnc.slice(0, showAll ? tnc.length : 3).map((tn, index) => (
                  <li key={index} className="pb-3">{tn}</li>
                ))}
              </ul>
        
              {tnc.length > 3 && (
                <button 
                  onClick={() => setShowAll(!showAll)} 
                  className="text-[#019EEC] text-lg font-medium mt-2"
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              )}
            </div>
            }
          </div>
        </div>

        <div className="py-20"></div>
        {!productDeliverable &&
        <div className='fixed bottom-0 left-0 w-full p-2 bg-white flex flex-row justify-between z-10 border border-t-4 h-fit rounded-t-2xl'>
        
        {isMobile ?
        <Button 
        onClick={()=>{
                makeApiCallWithAuth('trackEvent', {event: 4, offer: orderDetails?.id, mop: 21})
                  .then((response) => {
                    console.log("resp",response.data)
                  })
                  .catch((e) => console.log("err", e));
                  navigator.clipboard.writeText(orderDetails?.coupon_code || orderDetails?.redeem_code);
                  navigate('/exitpwa?launch='+orderDetails?.offer_url)}}
         className="w-full bg-buttonBg text-lg font-medium capitalize">
           Redeem Now
        </Button>
        :
        <Button 
        onClick={()=>{
                makeApiCallWithAuth('trackEvent', {event: 4, offer: orderDetails?.id, mop: 21})
                  .then((response) => {
                    console.log("resp",response.data)
                  })
                  .catch((e) => console.log("err", e));
                  navigator.clipboard.writeText(orderDetails?.coupon_code || orderDetails?.redeem_code);
                  window.open(atob(orderDetails?.offer_url).split('?type=' || '&type=')[0].slice(7), '_blank')?.focus();}
                }
        className="w-full bg-buttonBg text-lg font-medium capitalize">
           Redeem Now
        </Button>
        }
        </div>
        }
      </div>
    
  </div>
  )
}

export default CouponInfo
