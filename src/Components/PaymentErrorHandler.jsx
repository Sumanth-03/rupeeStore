import React, { useEffect } from "react";
import pending from '../Assets/pending.svg'
import success from '../Assets/success.svg'
import Failure from '../Assets/failure.svg'
import { Button } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentErrorHandler (props) {
    const location = useLocation()
    const navigate = useNavigate()
    const {status, message,id} = props
    console.log(status,message)
    const TransactionStatus = {
        success : 'Transaction Successful!',
        pending : 'Transaction pending',
        failure : 'Transaction Failed'
    }
    const bgcolors = {
        success : ['#E8FFF9', '#00A05B'],
        pending : ['#FFF2DD', '#FBAD4B'],
        failure : ['#FFD9DA', '#EA2329']
    }
    const handleNavigate = (status, id) => {
        if(status==='success'){
            navigate(`/redeem`, { state: { status } , replace: true })
        }
        else if(status==='pending'){
            navigate(`/redeem`, { replace: true })
        }
        else if(status==='failure'){
            navigate(`/product/${id}`, { replace: true })
        }
        else {
            navigate('/', { replace: true })
        }
    }
    useEffect(()=>{
        setTimeout(()=>{
            handleNavigate(status,id)
        },1000)
    })
    console.log(status,bgcolors[status]?.[0])
    return(
        <main className="fixed inset-0 w-screen h-screen bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white shadow-[0px_0px_15px_#cccccc] flex flex-col items-center justify-center gap-6 mx-2 rounded-2xl p-3 py-5">
            <div className={`p-4 rounded-full bg-[${bgcolors[status]?.[0]}]`} style={{backgroundColor:`${bgcolors[status]?.[0]}`}}>
                <div className={`p-4 rounded-full bg-[${bgcolors[status]?.[1]}]`} style={{backgroundColor:`${bgcolors[status]?.[1]}`}}>
                    <img src={status === "success" ? success : status === "pending" ? pending : Failure}  className=""></img>
                </div>
            </div>
            <h3 className="text-2xl font-medium">{TransactionStatus[status]}</h3>
            {status !== 'success' && <p className="text-lg font-normal px-5 text-center">{message}</p>}
            <div className="flex justify-evenly w-full my-3 gap-2">
                <Button onClick={()=>handleNavigate(status,id)} className="bg-buttonBg text-lg font-medium capitalize">
                    { status === 'success'? 'View Detail' : status === 'pending' ? 'Continue' : 'Try again'}
                </Button>
                <Button onClick={()=>navigate('/', { replace: true })}variant="text" className="border-2 border-[#253851] text-lg font-medium capitalize">
                    {status === 'success'? 'Back home' : 'Cancel'}
                </Button>
            </div>
            </div>
        </main>
    )
}

export default PaymentErrorHandler