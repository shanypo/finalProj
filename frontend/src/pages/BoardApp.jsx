import React from 'react';
import { connect } from 'react-redux';
import { loadBoards, removeBoard, addBoard, updateBoard, } from '../store/board.actions.js';
import { boardService } from '../services/board.service.js';
import { BoardList as BoardList } from '../cmp/BoardList.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BoardHeader } from '../cmp/BoardHeader.jsx';
import { TextareaAutosize } from '@mui/material';
import { AddList } from '../cmp/AddList.jsx';

class _BoardApp extends React.Component {
    state = {
        board: null
    }

    componentDidMount() {
        this.props.loadBoards()
        boardService.getBoardById('b101')
            .then((board) => {
                this.setState({ board })
            })
    }

    onUpdateBoard = () => {
        const { board } = this.state;
        this.setState({ board })
        this.props.updateBoard(board);
        this.props.loadBoards();
    }

    render() {
        const { board } = this.state;
        if (!board) return <> </>
        return (
            <main>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <section className="board-app flex">
                        <BoardHeader board={board} onUpdateBoard={this.onUpdateBoard} />
                        <BoardList board={board} lists={board.lists} onUpdateBoard={this.onUpdateBoard} />
                        <AddList board={board} onUpdateBoard={this.onUpdateBoard} />
                    </section>
                </DragDropContext>
            </main>
        )

    }

}

function mapStateToProps(state) {
    return {
        boards: state.boardReducer.boards
    }
}
const mapDispatchToProps = {
    removeBoard,
    addBoard,
    loadBoards,
    updateBoard
}

export const BoardApp = connect(mapStateToProps, mapDispatchToProps)(_BoardApp)