import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@mui/material';

import { utilService } from '../../services/util.service.js';
import { updateBoard } from '../../store/board.actions.js';
// import Avatar from '@mui/material/Avatar';
// import DoneIcon from '@mui/icons-material/Done';

class _ChecklistPopover extends React.Component {
    state = {
        board: null,
        currListIdx: null,
        currCardIdx: null,
        title: 'Checklist'
    }

    componentDidMount() {
        const { board, currListIdx, currCardIdx } = this.props
        this.setState({ ...this.state, board, currListIdx, currCardIdx })
    }

    handleChange = ({ target }) => {
        this.setState({ ...this.state, title: target.value })
        // this.setState({ ...this.state, board: boardToUpdate })
    }

    onAddChecklist = (ev) => {
        ev.preventDefault();
        const { currListIdx, currCardIdx, title, board } = this.state
        const currCard = board.lists[currListIdx].cards[currCardIdx]
        const action = `Added Checklist "${title}"`
        const boardToUpdate = { ...this.state.board }
        boardToUpdate.lists[currListIdx].cards[currCardIdx].checklists.push({
            checklistId: utilService.makeId(),
            title,
            tasks: []
        })
        this.props.updateBoard(boardToUpdate, action, currCard)
        this.props.handleClose()
    }

    render() {
        const { board, currListIdx, currCardIdx, title } = this.state
        if (!board || currCardIdx === null || currListIdx === null) return <></>
        return (
            <section className="popover-checklist">
                <label>Title</label>
                <form onSubmit={this.onAddChecklist}>
                    <input className="popover-checklist-input"
                        name='cardTitle'
                        type='text'
                        onChange={this.handleChange}
                        value={title}
                    />
                    <Button onClick={this.onAddChecklist} variant="contained" className="add-btn">Add</Button>
                </form>
            </section>
        )
    }
}
function mapStateToProps(state) {
    return {
        board: state.boardReducer.board,
        loggedInUser: state.userReducer.loggedInUser
    }
}
const mapDispatchToProps = {
    updateBoard
}

export const ChecklistPopover = connect(mapStateToProps, mapDispatchToProps)(_ChecklistPopover)