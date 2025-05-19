const OptionButton = ({ value, item, selected, onChangeHandler }) => {
  const isSelected = selected.some(
    (x) => x.attribute_key === item.attribute.key && x.value_key === value.key,
  );

  let display = "show";

  return (
    <button
      key={value.id}
      value={value.key}
      selected={value.selected}
      style={display ? { display: display } : {}}
      className={
        display === "show"
          ? `block text-[0.834rem] ${
              isSelected
                ? `border border-primary bg-white text-primary hover:border-primary`
                : `border border-black hover:border-primary hover:text-primary`
            } h-[2.5rem] min-w-[2.5rem] rounded-full px-1`
          : `hidden`
      }
      onClick={(e) => {
        e.preventDefault();
        onChangeHandler(item.attribute.key, e.target.value);
      }}
    >
      {value.name}
    </button>
  );
};

export default OptionButton;
