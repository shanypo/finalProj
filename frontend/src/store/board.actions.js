import { boardService } from '../services/board.service'
// import { socketService, SOCKET_EVENT_BOARD_ADDED } from '../services/socket.service'
import { userService } from '../services/user.service'
import { utilService } from '../services/util.service.js'

export function loadBoards() {
  return async dispatch => {
    try {
      const boards = await boardService.query()
      dispatch({ type: 'SET_BOARDS', boards })
      // socketService.on(SOCKET_EVENT_BOARD_ADDED, (board) =>{
      //   dispatch({ type: 'ADD_BOARD', board })
      // })

    } catch (err) {
      console.log('BoardActions: err in loadBoards', err)
    }
  }
}


export function addBoard(board) {
  return async dispatch => {
    try {
      const addedBoard = await boardService.add(board)
      dispatch({ type: 'ADD_BOARD', board: addedBoard })

    } catch (err) {
      console.log('BoardActions: err in addBoard', err)
    }
  }
}

export function removeBoard(boardId) {
  return async dispatch => {
    try {
      await boardService.remove(boardId)
      dispatch({ type: 'REMOVE_BOARD', boardId })
    } catch (err) {
      console.log('BoardActions: err in removeBoard', err)
    }
  }
}

export function updateBoard(board, action, card, txt = "") {
  return async dispatch => {
    try {
      const activity = _storeSaveActivity(txt, action, card);
      board.activities.unshift(activity);
      console.log('board from action', board);
      await boardService.save(board);
      dispatch({ type: 'UPDATE_BOARD', board });
    } catch (err) {
      console.log('BoardActions: err in updateBoard', err);
    }
  }
}

function _storeSaveActivity(txt, action, card) {
  const cardCopy = { ...card } // MAYBE WE DONT NEED IT
  const activity = {
    id: utilService.makeId(),
    txt,
    createdAt: Date.now(),
    byMember: userService.getLoggedinUser(),
    action,
    card: { cardId: cardCopy.cardId, cardTitle: cardCopy.cardTitle }
  }
  return activity
}



