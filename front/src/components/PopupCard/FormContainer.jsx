import EditDataForm from "./EditDataForm";

function FormContainer({data}) {
  

    return (
        <div className="form-container">
            <EditDataForm data={data} />
        </div>
    );
}

export default FormContainer;