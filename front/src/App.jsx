import ApartmentCardContainer from './components/ApartmentCard/ApartmentCardContainer.jsx'


function App() {

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center py-lg">
          <h1 className='text-xxl font-bold'>Mes locataires</h1>
        </div>
         <ApartmentCardContainer />         
      </div>
        
    </>
  )
}

export default App
