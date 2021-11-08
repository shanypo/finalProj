import { userService } from "../services/user.service.js";

export function loadUsers() {
    return async dispatch => {
        try {
            dispatch({ type: 'LOADING_START' })
            const users = await userService.getUsers()
            dispatch({ type: 'SET_USERS', users })
        } catch (err) {
            console.log('UserActions: err in loadUsers', err)
        } finally {
            dispatch({ type: 'LOADING_DONE' })
        }
    }
}

export function updateUser(user) {
    return async dispatch => {
        try {
            await userService.update(user);
            dispatch({ type: 'SET_USER', user });
        } catch (err) {
            console.log('err in updateUser:', err);
        }
    }
}

export function removeUser(userId) {
    return async dispatch => {
        try {
            await userService.remove(userId)
            dispatch({ type: 'REMOVE_USER', userId })
        } catch (err) {
            console.log('UserActions: err in removeUser', err)
        }
    }
}

export function onLogin(credentials) {
    return async (dispatch) => {
        try {
            const user = await userService.login(credentials)
            dispatch({
                type: 'SET_USER',
                user
            })
            return user
        } catch (err) {
            console.log('Cannot login', err)
            throw err
        }
    }
}


export function onSignup(credentials) {
    console.log('credentials', credentials);
    
    return (dispatch) => {
        userService.signup(credentials)
            .then(user => {
                dispatch({
                    type: 'SET_USER',
                    user
                })
            })
            .catch(err => {
                console.log('Cannot signup', err)
            })

    }
}

export function onLogout() {
    return (dispatch) => {
        userService.logout()
            .then(() => dispatch({
                type: 'SET_USER',
                user: null
            }))
            .catch(err => {
                // showErrorMsg('Cannot logout')
                console.log('Cannot logout', err)
            })
    }
}

export function loginAsGuest() {
    const guestCreds = {
        username: "pandaguest",
        password: "123"
    }
    try {
        return onLogin(guestCreds)
    } catch (err) {
        console.log('error login as guest');
    }
}


// export function loadAndWatchUser(userId) {
//     return async (dispatch) => {
//         try {
//             const user = await userService.getById(userId);
//             dispatch({ type: 'SET_WATCHED_USER', user })
//             socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
//             socketService.off(SOCKET_EVENT_USER_UPDATED)
//             socketService.on(SOCKET_EVENT_USER_UPDATED, user => {
//                 console.log('USER UPADTED FROM SOCKET');
//                 dispatch({ type: 'SET_WATCHED_USER', user })
//             })
//         } catch (err) {
//             showErrorMsg('Cannot load user')
//             console.log('Cannot load user', err)
//         }
//     }
// }

