import { boardService } from '../services/board.service'
import { socketService } from '../services/socket.service'
import { userService } from '../services/user.service'
import { utilService } from '../services/util.service.js'
import { showErrorMsg } from '../services/event-bus.service';
import { storageService } from '../services/storage.service';

export function loadBoards(userId) {
  return async dispatch => {
    try {
      const boards = await boardService.query(userId)
      dispatch({ type: 'SET_BOARDS', boards })

    } catch (err) {
      showErrorMsg('Sorry cannot load boards')
      console.log('BoardActions: err in loadBoards', err)
    }
  }
}

export function loadBoard(boardId) {
  return async dispatch => {
    try {
      const board = !boardId ? null : await boardService.getBoardById(boardId)
      dispatch({ type: 'SET_BOARD', board: { ...board } })
    } catch (err) {
      showErrorMsg('Sorry cannot load board')
      console.log('BoardActions: err in loadBoards', err)
    }
  }
}

export function loadListAndCard(list, card) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_LIST', list })
      dispatch({ type: 'SET_CARD', card })
    } catch (err) {
      console.log('BoardActions: err in loadList', err)
    }
  }
}

export function addBoard(board) {
  return async dispatch => {
    try {
      const addedBoard = await boardService.save(board)
      dispatch({ type: 'ADD_BOARD', board: addedBoard })
      return addedBoard

    } catch (err) {
      showErrorMsg('Sorry cannot add board')
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
      showErrorMsg('Sorry cannot remove board')
      console.log('BoardActions: err in removeBoard', err)
    }
  }
}

export function toggleLabels() {
  return dispatch => {
    dispatch({ type: 'TOGGLE_LABELS' })
  }
}

export function setFilterBy(filterBy, boardId) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_FILTER', filterBy: filterBy });
      const board = !boardId ? null : await boardService.getBoardById(boardId, filterBy)
      dispatch({ type: 'UPDATE_BOARD', board: { ...board } });
    } catch (err) {
      console.log('Cannot update notification', err);
    }
  }

}

export function updateBoard(board, action = null, card = '', txt = '') {
  if (!board.createdBy) {
    return dispatch => {
      dispatch({ type: 'UNDO_UPDATE_BOARD' });
      showErrorMsg('Templates cannot be changed')
    }
  }

  return async dispatch => {
    try {
      if (action) {
        var activity = _storeSaveActivity(action, card, txt);
        board.activities.unshift(activity);
      } else board.activities[0].isNotif = 'alreday-sent-notif';
      dispatch({ type: 'UPDATE_BOARD', board: { ...board } });
      console.log('here after store');

      await boardService.save(board);
      dispatch({ type: 'UPDATE_LAST_UPDATED_BOARD' });
      socketService.emit('update-board', board);
      console.log('after board to backend');
    } catch (err) {
      if (navigator.onLine) {
        console.log('im online board action');
        dispatch({ type: 'UNDO_UPDATE_BOARD' });
        showErrorMsg('Sorry cannot update board')
      } else {
        console.log('im in offline board action');
        storageService.saveToStorage('BOARD_DB', board);
      }
      console.log('BoardActions: err in updateBoard', err);
    }
  }
}

function _storeSaveActivity(action, card, txt) {
  const activity = {
    id: utilService.makeId(),
    txt,
    createdAt: Date.now(),
    byMember: userService.getLoggedinUser(),
    action,
    card: card ? { cardId: card.cardId, cardTitle: card.cardTitle } : '',
    isNotif: false,
  }
  return _filterActionsNotif(activity)
}

function _filterActionsNotif(activity) {
  switch (activity.action) {
    // MEMBERs
    case 'Added':
    case 'Removed':
    // DUE DATE
    case 'Set due date':
    case 'Removed due date':
    case 'Changed due date':
    // CHECKLIST
    case 'Completed checklist':
    // COMMENT
    case 'Added comment':
      activity.isNotif = 'new-notif';
      break
    default:
      activity.isNotif = false
      break
  }
  return activity
}


export function setNotif(isNotif) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_NOTIF', isNotif: isNotif });
      isNotif ?
        dispatch({ type: 'SET_NOTIF_COUNT++' })
        : dispatch({ type: 'SET_NOTIF_COUNT', count: 0 });
    } catch (err) {
      console.log('Cannot update notification', err);
    }
  }

}

export function setUpdateLabel(labelsProps) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_LABEL', labelsProps });
    } catch (err) {
      console.log('Cannot set labels props', err);
    }
  }

}

export function setOffline(isOffline) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_OFFLINE', isOffline });
    } catch (err) {
      console.log('Cannot set offline', err);
    }
  }

}

// can be deleteted:
export function setNotifCount(count) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_NOTIF_COUNT', count });
    } catch (err) {
      console.log('Cannot update notification', err);
    }
  }

}

export function setSearchBg(searchStr) {
  return async dispatch => {
    try {
      dispatch({ type: 'SET_SEARCH_BG', searchStr });
    } catch (err) {
      console.log('Cannot set search background', err);
    }
  }

}
