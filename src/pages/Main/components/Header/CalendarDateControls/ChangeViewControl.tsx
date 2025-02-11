import Dropdown from '@/components/Dropdown';

const viewOptions = ['Day view', 'Week view', 'Month view', 'Year view'];

const ChangeViewControl = () => {
    const onViewChange = (view: string) => {
        console.log(view);
    };

    return (
        <Dropdown
            selectedOption={viewOptions[1]}
            changeSelectedOption={onViewChange}
            options={viewOptions}
            placeholder="Pick view"
            className="text-sm"
        />
    );
};

export default ChangeViewControl;
