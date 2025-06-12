import { useState } from 'react';
import InputDataForm from './InputDataForm';
import { updateTenant } from '../../services/tenantService';
import { updateApartment } from '../../services/ApartmentService';


function EditDataForm({ data }) {
  const [formData, setFormData] = useState(data);
  const fields = {
    tenant: [
      { name: 'User.firstname', type: 'text', label: 'Prénom' },
      { name: 'User.lastname', type: 'text', label: 'Nom' },
      { name: 'User.email', type: 'text', label: 'Email' },
      { name: 'User.phone', type: 'text', label: 'Téléphone' },
    ],
    apartment: [
      { name: 'address', type: 'text', label: 'Addresse' },
      { name: 'city', type: 'text', label: 'Ville' },
      { name: 'country', type: 'text', label: 'Pays' },
      { name: 'postalCode', type: 'text', label: 'Code Postal' },
      { name: 'rent', type: 'number', label: 'Loyer' },
      { name: 'charges', type: 'number', label: 'Charges' },
    ],
  };

  const handleChange = (updatedData) => {
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTenant(formData.User.id, formData.User);
    await updateApartment(formData.id, formData);
  };

  const handleCancel = () => {
    setFormData(data);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className="flex gap-4">
        <h2>Appartement n°{formData.id}</h2>
        <div className="form-group flex flex-col gap-4">
          <p>Locataire</p>
     
        {fields.tenant.map((field) => (
          <InputDataForm
            key={field.name}
            type={field.type}
            name={field.name}
            label={field.label}
            data={formData}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="form-group flex flex-col gap-4 mt-6">  
        <p>Appartement</p>
        {fields.apartment.map((field) => (
          <InputDataForm
            key={field.name}
            type={field.type}
            name={field.name}
            label={field.label}
            data={formData}
            onChange={handleChange}
          />
        ))}

      </div>
      </div>
      
      <button type="submit" onClick={handleCancel}>Annuler les modifications</button>
      <button type="submit" className="btn btn-primary mt-4">Tout enregistrer</button>
    </form>
  );
}


export default EditDataForm;
