// const SHOW_SIDEBAR = {
//     collapse: false
// }

// export default function changeCollapse(state = SHOW_SIDEBAR, action){
//     // console.log("b")
//     switch(action.type) {
//         case 'CHANGE_SIDEBAR':
//             return {
//                 collapse: !state.collapse
//             }
//         default: {
//             return state
//         }
//     }
// }

const SIDERBAR_KEY = {
    key: "1"
}

export default function changeSiderBarKey (state = SIDERBAR_KEY, action) {
    switch(action.type){
        case "key1":
            return {
                key: "1"
            }
        case "key2":
            return {
                key: "2"
            }
        case "key3":
            return {
                key: "3"
            }
        case "key4":
            return {
                key: "4"
            }
        default: {
            return state
        }
    }
}