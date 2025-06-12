import ApartmentCardContent from './ApartmentCardContent';
import ApartmentCardButton from './ApartmentCardButtons';
import FormContainer from '../PopupCard/FormContainer';

function ApartmentCard({apartment}) {

    return (
        <div>
            <p>Appartement n°{apartment.id}</p>
            <ApartmentCardContent apartment={apartment} />
            <ApartmentCardButton apartment={apartment} />
            <FormContainer data={apartment} />
            
        </div>
    );
}

export default ApartmentCard;