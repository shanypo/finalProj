import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { utilService } from '../services/util.service';
import { addBoard, loadBoard } from '../store/board.actions';
import CloseIcon from '../assets/imgs/icons/close-icon.svg';
import CheckedIcon from '../assets/imgs/icons/checked-icon.svg';

class _CreateBoard extends React.Component {
    state = {
        title: '',
        bgStyle: { bgImgUrl: "https://images.unsplash.com/photo-1632918425510-c02e76616549?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1527&q=80" },
        // backgrounds: [
        //     { background gImgUrl: "https://images.unsplash.com/photo-1632813101579-7e7d4dd2c69a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80" },
        //     { bgImgUrl: "https://images.unsplash.com/photo-1632714394526-1e87d08d56c4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80" },
        //     { bgImgUrl: "https://images.unsplash.com/photo-1632829754530-d94a588e2dde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" },
        //     { bgImgUrl: "https://images.unsplash.com/photo-1632918425510-c02e76616549?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1527&q=80" },
        //     { },
        //     {},
        //     {},
        //     {},
        //     {}
        // ],
        selectedBgIdx: 0
    }

    handleChange = (ev) => {
        const value = ev.target.value
        this.setState({ title: value })
    }

    onSelectBg = () => {
        // const backgrounds
    }

    createBoard = async (ev) => {
        ev.preventDefault()
        const { title, bgStyle } = this.state
        if (!title) return
        const { loggedInUser, isFromHeader } = this.props
        const boardMember = { ...loggedInUser }
        boardMember.isStarred = false

        const newBoard = {
            "boardTitle": title,
            "createdAt": Date.now(),
            "createdBy": loggedInUser,
            "boardStyle": bgStyle,
            "covers": [],
            "labels": this.getLabels(),
            "boardMembers": [boardMember],
            "lists": [],
            "activities": [],
            "archive": []
        }

        await this.props.addBoard(newBoard)
        const { board, onToggleCreateBoard } = this.props
        onToggleCreateBoard()
        this.props.history.push(`/boards/${board._id}`)
    }

    render() {
        const { title, bgStyle } = this.state
        return (
            <div className="create-board-wrapper">
                <div className="screen" onClick={this.props.onToggleCreateBoard}></div>
                <div className="create-board flex direction-col align-center">
                    <div className="board-preview flex">
                        <div className="title">
                            <form onSubmit={this.createBoard}>
                                <input type="text"
                                    className="title-input"
                                    name="title"
                                    placeholder="Add board title"
                                    value={title}
                                    onChange={this.handleChange}
                                />
                            </form>
                        </div>
                        <div className="choose-bg">
                            { }
                        </div>
                    </div>
                    <button className={`create-btn${!title ? " disabled" : ""}`} onClick={this.createBoard}>Create board</button>
                </div>
            </div>
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
    addBoard,
    loadBoard
}

const _CreateBoardWithRouter = withRouter(_CreateBoard);
export const CreateBoard = connect(mapStateToProps, mapDispatchToProps)(_CreateBoardWithRouter)