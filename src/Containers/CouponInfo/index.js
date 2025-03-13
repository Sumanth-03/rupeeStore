import React, {useEffect, useState} from 'react'
import backdark from '../../Assets/back_dark1.svg'
import myntralogo from '../../Assets/myntralogo.png'
import { Button } from '@material-tailwind/react'
// import Redeempoint from '../../Assets/Redeempoint.svg'
// import Earnpoints from '../../Assets/Earnpoint.svg'
import Redeempoint from '../../Assets/redeem.svg'
import Earnpoints from '../../Assets/earn.svg'
import { useNavigate, Link } from 'react-router-dom'
import { makeApiCallWithAuth } from '../../Services/Api'
//import {isMobile} from 'react-device-detect';


function Redeem() {

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

  const navigate = useNavigate();
  
  const [copyaction, setCopyaction] = useState(false)
  var coupondeets = JSON.parse(sessionStorage.coupon);
  console.log("coupondeets",coupondeets)

  let nowdate = new Date(coupondeets?.created_at).toString('en-UK', {timeZone: 'Asia/Kolkata'})

return(

    <div className='container max-w-full'>
      <div className="sticky top-0 z-30 grid grid-rows-2 grid-cols-12 grid-flow-col gap-1 h-16 bg-white rounded-b-xl border-b-1">
        
       <div className="row-span-2 row-start-1 col-start-1  col-span-1 items-center flex justify-start pl-3"><img src={backdark} className="" alt="backdark" onClick={()=>{navigate('/coupons')}}/> </div>

  
      </div>

      <div className="px-3">
      <div className="h-fit rounded-lg grid place-items-center " style={{ background: `linear-gradient(${coupondeets?.up_color} 40%,${coupondeets?.down_color})`}}>
      <div className="w-20 h-20 mt-6 mb-2  flex self-center  place-content-center">
      <img src={coupondeets?.brand_logo} className="h-20 w-20" alt="logo" /> 
      </div>
      {(coupondeets?.offer_type === '2')?
      <div className="text-white text-lg font-medium tracking-wide py-1">{coupondeets?.uptoflat === "1"?'UP TO':'FLAT'} {Math.round(coupondeets?.offer_percentage)}% Off </div>
      :
      <div className="text-white text-lg font-medium tracking-wide py-1">{coupondeets?.uptoflat === "1"?'UP TO':'FLAT'} {Math.round(coupondeets?.offer_percentage)} Off </div>
      }
      <div className="h-10 w-80 bg-white rounded-lg my-2 border-dashed border-2 flex justify-between" style={{ borderColor: `${coupondeets?.down_color}`}}>
      <div className="text-blue-950 text-base font-medium tracking-wide pl-2 pt-1.5">{coupondeets?.redeem_code}</div>
      {!copyaction ?

      <div className="text-blue-950 text-sm font-medium tracking-wide pr-2 pt-2"> <button className="text-blue-950 text-sm font-medium tracking-wide pr-2" onClick={() => {navigator.clipboard.writeText(coupondeets?.redeem_code); setCopyaction(true)}}> COPY </button> </div>
      :
      <div className="text-blue-950 text-sm font-medium tracking-wide pr-2 pt-2"> <button className="text-blue-950 text-sm font-medium tracking-wide pr-2" onClick={() => {navigator.clipboard.writeText(coupondeets?.redeem_code)}}> COPIED! </button> </div>
      }
      </div>

      <div className=""><span className="text-white text-sm font-medium lowercase tracking-wide">VAILD TILL</span><span className="text-white text-sm font-medium tracking-wide">: {new Date(coupondeets?.offer_validity).toUTCString().slice(4,16)}</span></div>
      
      {isMobile?
      <Button className="bg-white w-60 my-3 h-12 shadow-2xl rounded-xl" onClick={()=>{
        makeApiCallWithAuth('trackEvent', {event: 4, offer: coupondeets?.id, mop: 2})
      .then((response) => {
        console.log("resp",response.data)
       
      })
      .catch((e) => console.log("err", e));
      navigate('/exitpwa?launch='+coupondeets?.offer_url)}}><span className="text-[#021555] text-lg font-medium -my-2">REDEEM NOW</span></Button>
      :
      <Button className="bg-white w-60 my-3 h-12 shadow-2xl rounded-xl" onClick={()=>{
        makeApiCallWithAuth('trackEvent', {event: 4, offer: coupondeets?.id, mop: 2})
      .then((response) => {
        console.log("resp",response.data)
       
      })
      .catch((e) => console.log("err", e));
      window.open(atob(coupondeets?.offer_url).split('?type=' || '&type=')[0].slice(7), '_blank')?.focus();}}><span className="text-[#021555] text-lg font-medium -my-2">REDEEM NOW</span></Button>
      }
 
      </div>
       
     <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-md h-fit mt-3 pb-1">

      <div className="text-[#021555] text-base font-medium tracking-wide py-1 pl-2">Order Details</div>
      
      {(coupondeets?.pay_mode === 1) ?
      <div className="text-[#021555] text-sm font-normal leading-snug tracking-wide pl-2">Availed for 1 Rupee</div>
      :
      <div className="text-[#021555] text-sm font-normal leading-snug tracking-wide pl-2">Availed for 1 Point</div>
      }
      <div className="flex justify-between">
      <div className="text-[#021555] text-opacity-90 text-sm font-normal leading-snug tracking-wide py-1 pl-2">Order ID : {coupondeets?.order_id}</div>
      <div className="text-right text-[#021555] text-opacity-90 text-sm font-normal leading-snug tracking-wide pr-2 pt-1">{nowdate.slice(4,21)}</div>
      </div>

     </div>

     <div className="border-2 border-solid-blue-950 solid-opacity-10 rounded-md h-fit mt-3 pb-1">

      <div className="text-[#021555] text-lg font-medium tracking-wide py-1 pl-2">Quick Links</div>
      
      
      <div className="row-span-2 row-start-1 col-start-1 flex gap-2 pt-3 pl-2 pb-2">
      <img src={Redeempoint} className="w-8 h-8" alt="redeempoint" />
      <div>
      <div className="text-[#021555] text-base font-medium leading-snug tracking-wide">Redeem more points</div>
      <div className="text-[#021555] text-sm font-normal leading-snug tracking-wide">Redeem More points balance by availing one of the deals and vouchers</div>
      </div>
      </div>

      <div className="row-span-2 row-start-1 col-start-1 flex gap-2 pt-3 pl-2 pb-2">
      <img src={Earnpoints} className="w-8 h-8" alt="earnpoints" />
      <div>
      <div className="text-[#021555] text-base font-medium leading-snug tracking-wide">Earn Points</div>
      <div className="text-[#021555] text-sm font-normal leading-snug tracking-wide">Pay using Bank & earn more points</div>
      </div>
      </div>

     </div>

     
      




      </div>


      </div>
    
)

}

export default Redeem

