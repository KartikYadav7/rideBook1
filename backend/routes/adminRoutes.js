import RideBooking from "../models/booking.js";
import PackageBooking from "../models/package.js";
import ReservationBooking from "../models/reservation.js";
import Cab from "../models/cab.js";
import DriverProfile from "../models/driverProfile.js";
import Payment from '../models/payment.js'

export const getAllCabs = async (req, res) => {
  try {
    const cab = await Cab.find();
    res.status(200).json(cab);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch Cabs', error: err.message });
  }
};

export const getAllDrivingPartners = async(req,res) =>{
    try{
        const partners  = await DriverProfile.find();
        res.status(200).json(partners);
    }catch(err){
         res.status(500).json({ msg: 'Failed to fetch Driving Partners', error: err.msg});
    }
}

export const getAllBookings = async(req,res)=>{
    try{
        const bookings = Payment.find()

    }
    catch(err){
        
    }
}