function ApartmentCardContent({apartment}) {

     return (
        <div>
           <p>{apartment.User.firstname}</p>
           <p>{apartment.User.lastname}</p>
           <p>{apartment.User.email}</p>
           <p>{apartment.User.phone}</p>
        </div>
    );
}

export default ApartmentCardContent;