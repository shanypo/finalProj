import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { QuickCardEditor } from "./QuickCardEditor.jsx";
import { connect } from "react-redux";
import { updateBoard, loadListAndCard } from "../store/board.actions.js";
import { withRouter } from "react-router-dom";

class _CardPreview extends React.Component {
  state = {
    isEditMode: false,
  };

  handleDnd = () => {
    console.log("is dragging", this.props.draggingOver);
  };

  onEditMode = () => {
    this.setState({ isEditMode: !this.state.isEditMode });
  };

  onSelectedCard = () => {
    const { list, board, card } = this.props;
    this.props.loadListAndCard(list, card);
    if (this.state.isEditMode) return;
    this.props.history.push(
      `/boards/${board._id}/${list.listId}/${card.cardId}`
    );
  };

  render() {
    const { card, currCardIdx, currListIdx, list } = this.props;
    if (card.isArchived) return <></>;
    return (
      <Draggable draggableId={card.cardId} index={currCardIdx}>
        {(provided, snapshot) => (
          <div
            onClick={this.onSelectedCard}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <QuickCardEditor
              list={list}
              card={card}
              currListIdx={currListIdx}
              currCardIdx={currCardIdx}
              onEditMode={this.onEditMode}
              isDragging={snapshot.isDragging}
            />
          </div>
        )}
      </Draggable>
    );
  }
}

function mapStateToProps(state) {
  return {
    board: state.boardReducer.board,
    loggedInUser: state.userReducer.loggedInUser,
  };
}
const mapDispatchToProps = {
  updateBoard,
  loadListAndCard,
};
const _CardPreviewWithRouter = withRouter(_CardPreview);
export const CardPreview = connect(
  mapStateToProps,
  mapDispatchToProps
)(_CardPreviewWithRouter);
