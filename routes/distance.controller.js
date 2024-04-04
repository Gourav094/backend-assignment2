const axios = require('axios')
const Distance = require('../models/distance.model')

async function getDistance(req,res){
    const {origin,destination} = req.query
    if(isNaN(origin)){
        return res.status(400).json({
            error: 'Please enter a valid origin pincode'
        });
    }
    
    if(isNaN(destination)){
        return res.status(400).json({
            error: 'Please enter a valid destination pincode'
        });
    }

    const existDistance = await Distance.findOne({
        originpin:origin,
        destPin:destination
    })

    if(existDistance){
        return res.status(200).json({
            data:existDistance.totalDistance
        })
    }


    const originLocation = await getLocationInfo(origin)
    const destLocation = await getLocationInfo(destination)
    
    if(!originLocation || !destLocation){
        return res.status(400).json({
            error:"unable to find the location pincode"
        })
    }

    const distance = await getDistanceInfo(originLocation,destLocation)

    if(!distance){
        return res.status(400).json({
            error:"unable find the distance"
        })
    }

    await Distance.create({
        originPin:origin,
        destPin:destination,
        totalDistance:distance
    })

    res.status(200).json({
        distance
    })
}

async function getDistanceInfo(originLocation,destLocation){
    try{
        const response = await axios.get(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${originLocation.lat},${originLocation.lon}&destinations=${destLocation.lat},${originLocation.lon}&key=qDOyTWEhJLoPNsTaxdYZ3afGqycbQBtJDu43kzG36Dy2AxlckpD6Hcw0oHSiQmAK`)
        if(response.status === 200){
            return response.data
        }
        else{
            throw new Error('Failed to fetch distance');
        }
    }catch (err) {
        console.error(err.message);
        return err
    }
}

async function getLocationInfo(pincode) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&format=json`);
        if (response.status === 200) {
            if (!response.data.length) {
                return null
            } else {
                return response.data[0];
            }
        } else {
            throw new Error('Failed to fetch location data');
        }
    } catch (err) {
        console.error(err.message);
        return err
    }
}

module.exports = {
    getDistance
}