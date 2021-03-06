import React from "react";
import { MembersList } from "./CardDetails/MembersList";
import { CardCheckPreview } from "./CardCheckPreview.jsx";
import { BsPencil } from "react-icons/bs";
import { GrTextAlignFull } from "react-icons/gr";
import { connect } from "react-redux";
import { TextareaAutosize } from "@mui/material";
import {
  updateBoard,
  loadListAndCard,
  loadBoard,
} from "../store/board.actions.js";
import { CardLabelsPreview } from "./CardLabelsPreview.jsx";
import { CardDuDatePreview } from "./CardDuDatePreview.jsx";
import { QuickCardActions } from "./QuickCardActions.jsx";
import close from "../assets/imgs/close-edit-card.svg";
import { CardCommAttachPreview } from "./CardCommAttachPreview";

class _QuickCardEditor extends React.Component {
  state = {
    cardTitle: "",
    isEditTitle: false,
    isEditMode: false,
    rect: null,
  };

  toggleEditTitle = (ev) => {
    if (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var rect = ev.target.getBoundingClientRect();
      rect.x = rect.x - 256;
    }
    this.props.onEditMode();
    const { card } = this.props;
    this.setState({
      isEditMode: !this.state.isEditMode,
      cardTitle: card.cardTitle,
      rect,
    });
  };

  handleChange = (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      this.onSaveCardTitle(this.state.cardTitle);
      return;
    }
    const value = ev.target.value;
    this.setState({ ...this.state, cardTitle: value });
  };

  onSaveCardTitle = () => {
    const { cardTitle } = this.state;
    if (!cardTitle) return;
    const { board, card, updateBoard } = this.props;
    card.cardTitle = cardTitle;
    updateBoard(board);
    this.toggleEditTitle();
    this.props.onEditMode();
  };

  handleClose = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ ...this.state, isEditTitle: !this.state.isEditTitle });
  };

  onArchive = () => {
    const { card, board, updateBoard } = this.props;
    card.isArchived = true;
    const action = `Archived card`;
    updateBoard({ ...board }, action, card);
    this.toggleEditTitle();
  };

  render() {
    const { card, board, isDragging, currListIdx, currCardIdx, updateBoard } =
      this.props;
    const { isEditMode, cardTitle, rect } = this.state;
    const draggingClass = isDragging ? "dragged" : "not-dragged";
    const coverStyle = card.cardStyle.img ? "img-cover" : card.cardStyle.color;
    const editClass = isEditMode ? "quick-card-edit-preview" : "";
    const isLabels = card.cardLabelIds ? "show-labels" : "";
    const isCover = card.cardStyle.isCover
      ? { fullCover: "full " + coverStyle, fullTitle: "full" }
      : { fullTitle: "half" };
    return (
      <React.Fragment>
        {isEditMode && (
          <div
            className="screen-quick-card-edit"
            onClick={this.toggleEditTitle}
          >
            <img src={close} alt="close" />
          </div>
        )}
        <div
          className={editClass}
          style={isEditMode ? { left: `${rect.x}`, top: `${rect.y}` } : {}}
        >
          <div className={`card-preview-content pointer ${draggingClass}`}>
            {card.cardStyle.id && (
              <div
                className={"card-preview-header " + coverStyle}
                style={{ backgroundImage: `url(${card.cardStyle.img})` }}
              ></div>
            )}
            <div className={"card-preview-main-content " + isCover.fullCover}>
              {isCover.fullTitle === "half" && (
                <div className={`list-card-labels  ${isLabels} flex`}>
                  {" "}
                  {card.cardLabelIds &&
                    card.cardLabelIds.map((labelId) => (
                      <CardLabelsPreview
                        key={labelId}
                        labelId={labelId}
                        boardLabels={board.labels}
                      />
                    ))}
                </div>
              )}
              {!isEditMode && (
                <span className={`card-preview-title  ${isCover.fullCover}`}>
                  {card.cardTitle}
                </span>
              )}
              {isEditMode && (
                <TextareaAutosize
                  className="quick-card-input"
                  value={cardTitle}
                  aria-label="card title"
                  onChange={this.handleChange}
                  onKeyPress={this.handleChange}
                  style={{ height: `90px` }}
                  onFocus={(ev) => ev.target.select()}
                  autoFocus
                />
              )}
              {isCover.fullTitle === "half" && (
                <span className="card-preview-icon flex">
                  <div className="icons-preview flex wrap">
                    {card.dueDate.date && (
                      <CardDuDatePreview
                        dueDate={card.dueDate}
                        board={board}
                        card={card}
                        updateBoard={updateBoard}
                      />
                    )}
                    {card.description && (
                      <div className="badge flex align-center">
                        <GrTextAlignFull />
                      </div>
                    )}
                    {card.comments.length ? (
                      <CardCommAttachPreview
                        type={"comment"}
                        cardCommAttach={card.comments}
                      />
                    ) : (
                      <> </>
                    )}
                    {card.attachments.length ? (
                      <CardCommAttachPreview
                        type={"attachment"}
                        cardCommAttach={card.attachments}
                      />
                    ) : (
                      <> </>
                    )}
                    <div title="checklist">
                      {card.checklists.length ? (
                        <CardCheckPreview checklists={card.checklists} />
                      ) : (
                        <> </>
                      )}
                    </div>
                  </div>
                  <div className="badge-icon members flex">
                    {card.cardMembers && (
                      <MembersList
                        members={card.cardMembers}
                        currCard={card}
                        isCardOpen={false}
                      />
                    )}
                  </div>
                </span>
              )}
              {!isEditMode && !card.isArchived && (
                <button
                  className="quick-card-edit-btn"
                  onClick={this.toggleEditTitle}
                >
                  <BsPencil />
                </button>
              )}
            </div>
          </div>
          {isEditMode && (
            <button
              className="save-quick-card-btn"
              onClick={this.onSaveCardTitle}
            >
              Save
            </button>
          )}
          {isEditMode && (
            <div>
              <QuickCardActions
                board={board}
                currListIdx={currListIdx}
                currCardIdx={currCardIdx}
                currCard={card}
                onArchive={this.onArchive}
              />
            </div>
          )}
        </div>
      </React.Fragment>
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
  loadBoard,
};

export const QuickCardEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(_QuickCardEditor);
