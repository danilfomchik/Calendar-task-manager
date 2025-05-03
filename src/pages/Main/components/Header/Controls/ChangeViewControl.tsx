import {useCallback} from 'react';

import Dropdown from '@/components/inputs/Dropdown';

const viewOptions = ['Day view', 'Week view', 'Month view', 'Year view'];

const ChangeViewControl = () => {
    const handleChange = useCallback(() => {}, []);

    return (
        <Dropdown
            selectedOption={viewOptions[1]}
            onChange={handleChange}
            options={viewOptions}
            placeholder="Pick view"
            className="text-sm"
        />
    );
};

export default ChangeViewControl;
