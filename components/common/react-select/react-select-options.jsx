import { Icon } from "@iconify/react";
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const orderOptions = (values) => {
  if (values.length > 0)
    return values
      .filter((v) => v.isFixed)
      .concat(values.filter((v) => !v.isFixed));
};

const OptionComponent = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <Icon icon={data.icon} />
        {data.label}
      </div>
    </components.Option>
  );
};

const ReactSelectOption = ({ fruits, value, onChange, isDisabled }) => {
  const fixedOnChange = (selectedOptions) => {
    onChange(selectedOptions || []);
  };
  return (
    <div>
      <Select
        isClearable={true}
        styles={styles}
        isMulti
        name="colors"
        options={fruits}
        value={value} // Set the value prop
        onChange={fixedOnChange} // Use fixedOnChange to update the value
        className="react-select"
        isDisabled={isDisabled}
        classNamePrefix="select"
        components={{ Option: OptionComponent }}
      />
    </div>
  );
};

export default ReactSelectOption;
