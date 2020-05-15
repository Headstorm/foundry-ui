import React from 'react';
import styled from 'styled-components';


import { CheckboxTypes } from '../../enums/CheckboxTypes';
import colors from '../../constants/colors';

import Icon from '@mdi/react';
import { mdiCheck, mdiCheckboxBlank, mdiClose, mdiMinus } from '@mdi/js';

const Input = styled.input`
    opacity: 0;
    position: absolute:
    
`;

const Label = styled.label``;

const Box = styled.div`
    border: 1px solid  ${colors.blueCharcoalXLight};
    border-radius: 2px;
    background-color: ${colors.background};
    width: 0.75rem;
    height: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
`;

const StyledIcon = styled(Icon)`
        overflow: visible;
`;

const CheckIcon = styled(StyledIcon)`
    color: ${colors.success};
    height: 2rem;
    width: 1.4rem;
    margin: 0 0 0.1rem 0.35rem;
    path {
        stroke: ${colors.background};
        stroke-width: 0.025rem;
    }
`;

const CrossIcon = styled(StyledIcon)`
    color: ${colors.destructive};
    height: 1rem;
    width: 1rem;
`;

const DefaultIcon = styled(StyledIcon)`
    color: ${colors.blueCharcoalLight};
    height: 0.7rem;
    width: 0.7rem;
`;

const NeutralIcon = styled(StyledIcon)`
    color: ${colors.blueCharcoalLight};
    height: 0.65rem;
    width: 0.65rem;
    path {
        stroke: ${colors.blueCharcoalLight};
        stroke-width: 2px;
    }
`;

export interface CheckboxProps {
    checkboxType: CheckboxTypes,
    children: string | Node,
    checked: boolean,
    value: string,
    onChange(): void
}

const iconPathFromType = (type: CheckboxTypes) => {
    switch (type) {
        case CheckboxTypes.check:
            return mdiCheck;
        case CheckboxTypes.cross:
            return mdiClose;
        case CheckboxTypes.neutral:
            return mdiMinus;
        default:
            return mdiCheckboxBlank;
    }
}

const iconComponentFromType = (type: CheckboxTypes) => {
    switch (type) {
        case CheckboxTypes.check:
            return CheckIcon;
        case CheckboxTypes.cross:
            return CrossIcon;
        case CheckboxTypes.neutral:
            return NeutralIcon;    
        default:
            return DefaultIcon;
    }
}

const Checkbox = ({
    checkboxType,
    checked,
    children,
    value,
    onChange, // do we need an on
}: CheckboxProps) => {
    const iconPath = iconPathFromType(checkboxType)
    const IconComponent = iconComponentFromType(checkboxType)
    return(
        <div>
            <Label>
                <Box>
                    {checked ? <IconComponent path={iconPath}></IconComponent> : null}
                </Box>
                <Input type='checkbox' value={value} onChange={onChange} checked={checked}></Input>
                {children}
            </Label>
        </div>
    );
};

export default Checkbox;