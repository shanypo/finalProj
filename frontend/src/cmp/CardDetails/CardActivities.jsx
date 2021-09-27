import React from 'react';
import { Loading } from '../Loading';
import { CommentsList } from '../CommentsList';
import { ActivityList } from '../ActivityList';
import { utilService } from '../../services/util.service';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
export class CardActivities extends React.Component {
    state = {
        board: null,
        currListIdx: null,
        currCardIdx: null,
        isEditing: false,
        isDetails: false,
        newActivityTxt: ''
    }

    componentDidMount() {
        const { board, currListIdx, currCardIdx } = this.props
        this.setState({ ...this.state, board, currListIdx, currCardIdx })
    }

    // state = {
    //     activities: null,
    //     isEditing: false,
    //     newActivityTxt: ''
    // }

    // componentDidMount() {
    //     this.setState({ activities: this.props.cardActivities })
    // }

    onToggleDetails = () => {
        this.setState({ ...this.state, isDetails: !this.state.isDetails })
    }
    onToggleComment = () => {
        this.setState({ ...this.state, isEditing: !this.state.isEditing })
    }
    handleChange = ({ target }) => {
        this.setState({ ...this.state, newActivityTxt: target.value });
    }
    onSaveActivity = (ev) => {
        ev.stopPropagation()
        if (!this.state.newActivityTxt) return
        const { currListIdx, currCardIdx } = this.state
        const newBoard = { ...this.state.board }
        newBoard.lists[currListIdx].cards[currCardIdx].comments.unshift({
            // byMember: userService.getLoggedinUser(),
            byMember: {
                _id: utilService.makeId(),
                fullname: "amit weiner",
                imgUrl: "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
            },
            createdAt: Date.now(),
            id: utilService.makeId(),
            txt: this.state.newActivityTxt
        })

        const currCard = newBoard.lists[currListIdx].cards[currCardIdx];
        const action = `Added comment`
        const txt = this.state.newActivityTxt.substring(0, 20)
        this.props.OnUpdateBoard(newBoard, action, currCard, txt)
        this.setState({ ...this.state, newActivityTxt: '', isEditing: false });
    }

    render() {
        let { isEditing, isDetails, newActivityTxt, board, currListIdx, currCardIdx } = this.state
        if (!board || currCardIdx === null || currListIdx === null) return <Loading />
        const comments = board.lists[currListIdx].cards[currCardIdx].comments
        const currCard = board.lists[currListIdx].cards[currCardIdx]
        // if (!comments) return <Loading />
        return (
            <div className="card-activities">
                <div className="flex direction-row space-between ">
                    <div className="flex direction-row">
                        <FormatListBulletedIcon className="card-details-icon" /> <h3>Activity</h3>
                    </div>
                    {!isDetails && <button className="show-hide hover" onClick={this.onToggleDetails}>Show details</button>}
                    {isDetails && <button className="show-hide hover" onClick={this.onToggleDetails}>Hide details</button>}
                </div>
                <div className="flex direction-col" onClick={this.onToggleComment}>
                    <TextareaAutosize
                        className="input-comment"
                        name='description'
                        type='text'
                        placeholder='Write a comment...'
                        onChange={this.handleChange}
                        onBlur={this.onToggleComment}
                        value={newActivityTxt}
                    />
                    {isEditing && <button onClick={this.onSaveActivity}>Save</button>}
                </div>


                {currCard.comments && <CommentsList comments={currCard.comments} />}
                {isDetails && <ActivityList currCard={currCard} activities={board.activities} />}

            </div>
        )
    }
}