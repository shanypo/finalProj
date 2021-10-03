import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ActionList } from './DynamicPopover/ActionListPopOver';
import { MembersPopover } from './DynamicPopover/MembersPopover';
import { LabelsPopover } from './DynamicPopover/LabelsPopover';
import { DatesPopover } from './DynamicPopover/DatesPopover';
import { ChecklistPopover } from './DynamicPopover/ChecklistPopover';
import { CoverPopover } from './DynamicPopover/CoverPopover';
import { DynamicButton } from './DynamicCmps/DynamicButton';
import { UserMenuPopover } from './DynamicPopover/UserMenuPopover';
import { TemporaryDrawer } from '../cmp/DroweMenu.jsx';
import { AttachmentsPopover } from './DynamicPopover/AttachmentsPopover';
import { MuiPickersUtilsProvider, DatePicker, TimePicker, DateTimePicker, } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { removeUser } from '../store/user.actions';

export class DynamicPopover extends React.Component {
    state = {
        anchorEl: null,
        isEditLabel: false
    }

    handleClick = (event) => {
        event.preventDefault();
        this.setState({ anchorEl: event.currentTarget })
    };

    handleClose = () => {
        this.setState({ anchorEl: null })
    };

    handleDateChange = () => {
        console.log('im in DynamicPopover.handleDateChange');
    }

    handleLabel = () => {
        this.setState({ ...this.state, isEditLabel: !this.state.isEditLabel })
    }

    render() {
        let { type, title, titleModal } = this.props
        const { anchorEl, isEditLabel } = this.state
        const open = Boolean(anchorEl);
        let id = open ? 'simple-popover' : undefined;
        if (this.props.type === 'edit-label') {
            titleModal = 'Change label';
        }

        const DynamicCmp = (props) => {
            switch (props.type) {
                case 'members':
                case 'add-members':
                    return <MembersPopover {...props} />
                case 'list actions':
                    return <ActionList {...props} />
                case 'labels':
                case 'add-labels':
                    return <LabelsPopover {...props} />
                case 'labels-preview':
                    return <LabelsPopover {...props} />
                case 'dates-edit':
                case 'dates':
                    return <DatesPopover {...props} />
                case 'attachments':
                case 'add-attachments':
                    return <AttachmentsPopover {...props} />
                case 'cover':
                    return <CoverPopover {...props} />
                case 'checklist':
                    return <ChecklistPopover {...props} />
                case 'userMenu':
                    return <UserMenuPopover {...props} />
                case 'boardMenu':
                    return <TemporaryDrawer {...props} />
                case 'edit-label':
                    return this.handleLabel
                default:
                    break;
            }
        }
        return (
            <React.Fragment>
                <button onClick={this.handleClick}>
                    <DynamicButton type={type} {...this.props} />
                </button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    {/* OPEN MODAL */}
                    <div className="popover-header-title flex">
                        <span>{titleModal}</span>
                        <button className="close-popover" onClick={this.handleClose}></button>
                    </div>
                    <div className="popover-content-container">
                        {isEditLabel && <p>hello</p>}
                        {!isEditLabel && <DynamicCmp type={type} {...this.props} handleClose={this.handleClose} />}
                    </div>
                </Popover >
            </React.Fragment>
        );
    }

}