import { NextResponse } from "next/server";
import Coupon from "@/models/Coupon";
import { connectMongoDB } from "@/lib/mongodb";



export async function PUT(request, { params }) {
try{
    const {id} = await params 
    const data = request.json()

    

    const copon = await Coupon.findByIdAndUpdate(id)




}catch(error){
    return NextResponse.json({message : "" ,error} , {status :500} )
}
}