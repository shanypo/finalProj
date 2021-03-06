import React from 'react';
import { connect } from 'react-redux';
import { updateBoard } from '../store/board.actions.js';
import { utilService } from '../services/util.service.js';
import { TextareaAutosize } from '@mui/material';
import close from '../assets/imgs/close.svg';

export class _AddCard extends React.Component {
    state = {
        cardTitle: ""
    }

    handleChange = (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.onAddCard();
            return;
        }
        const value = ev.target.value;
        this.setState({ cardTitle: value });
    }

    onAddCard = () => {
        let cardTitle = this.state.cardTitle;
        if (!cardTitle) {
            this.props.onCloseAdding();
            return;
        }
        const newCard = {
            cardId: utilService.makeId(),
            cardTitle,
            isArchived: false,
            description: "",
            comments: [],
            cardMembers: [],
            cardLabelIds: [],
            checklists: [],
            createdAt: new Date(),
            dueDate: {},
            attachments: [],
            cardStyle: {}
        }
        const { list, board } = this.props;
        list.cards.push(newCard);
        this.setState({ cardTitle: "" })
        const action = `Added card`;
        this.props.updateBoard(board, action, newCard);
    }

    render() {
        const { cardTitle } = this.state;
        return (
            <div className="all-cards card-previre-content">
                <TextareaAutosize className="text-area-auto card-input"
                    value={cardTitle}
                    placeholder="Enter a title for this card..."
                    aria-label="empty textarea"
                    onChange={this.handleChange}
                    onKeyPress={this.handleChange}
                    autoFocus
                />
                <div className="add-card-actions flex align-center">
                    <button onClick={this.onAddCard} className="add-card-btn">Add card</button>
                    <button className="flex" onClick={this.props.onCloseAdding}><img src={close} alt="close" /></button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardReducer.board
    }
}
const mapDispatchToProps = {
    updateBoard
}

export const AddCard = connect(mapStateToProps, mapDispatchToProps)(_AddCard)