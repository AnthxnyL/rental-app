function InputDataForm({ type, name, data,label, onChange }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...data };

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            updatedData[parent] = { ...updatedData[parent], [child]: value };
        } else {
            updatedData[name] = value;
        }

        if (onChange) onChange(updatedData);
    };

    let value = '';
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        value = data[parent]?.[child] ?? '';
    } else {
        value = data[name] ?? '';
    }

    return (
        <label>
            {label}
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                className="bg-blue-500"
            />
        </label>
    );
}

export default InputDataForm;