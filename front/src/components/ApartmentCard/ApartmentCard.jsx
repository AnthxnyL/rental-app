import ApartmentCardContent from './ApartmentCardContent';
import ApartmentCardButton from './ApartmentCardButtons';


function ApartmentCard({apartment}) {

    return (
        <div>
            <p>Appartement n°{apartment.id}</p>
            <ApartmentCardContent apartment={apartment} />
            <ApartmentCardButton apartment={apartment} />
        </div>
    );
}

export default ApartmentCard;