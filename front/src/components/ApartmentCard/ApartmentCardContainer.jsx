import { useState, useEffect } from 'react';
import { getApartments } from '../../services/ApartmentService';
import ApartmentCard from './ApartmentCard';



function ApartmentCardContainer() {
     const [apartments, setApartments] = useState([]);
   
    useEffect(()=> {
        getApartments().then(data=> setApartments(data))
    })


    return (
        <div className="apartment-card-container">
            {apartments.map(appt => (
                <ApartmentCard key={appt.id} apartment={appt} />
            ))}
        </div>
    )

}

export default ApartmentCardContainer;