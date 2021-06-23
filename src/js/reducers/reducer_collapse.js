const SHOW_SIDEBAR = {
    collapse: false
}

export default function changeCollapse(state = SHOW_SIDEBAR, action){
    // console.log("b")
    switch(action.type) {
        case 'CHANGE_SIDEBAR':
            return {
                collapse: !state.collapse
            }
        default: {
            return state
        }
    }
}

// export default function changeCollapse(state = SHOW_SIDEBAR, action){
//     // console.log("b")
//     switch(action.type) {
//         case 'HIDE_SIDEBAR':
//             console.log("Hide Sidebar")
//             return {
//                 collapse: true
//             }
//         default: {
//             console.log("Show Sidebar")
//             return {
//                 collapse: false
//             }
//         }
//     }
// }