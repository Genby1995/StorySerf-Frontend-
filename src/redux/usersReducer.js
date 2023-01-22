const SET_USERS = 'SET_USERS';
const FOLLOW_USER = 'FOLLOW_USER';
const UNFOLLOW_USER = 'UNFOLLOW_USER';

let initialState = {
    usersData:
        [
            {
                id: "1",
                firstName: "Андрей",
                secondName: "Виноградов",
                avatarUrl: "https://storage.yvision.kz/images/publication/covers/a9/a9bb3db60c182056376652cfe3f16df6.jpg",
                raiting: "115",
                location: {
                    country: "Россия",
                    city: "Москва",
                },
                isFollowed: true,
            },

            {
                id: "2",
                firstName: "Антон",
                secondName: "Ржаной",
                avatarUrl: "https://storage.yvision.kz/images/publication/covers/a9/a9bb3db60c182056376652cfe3f16df6.jpg",
                raiting: "185",
                location: {
                    country: "Россия",
                    city: "Москва",
                },
                isFollowed: true,
            },

            {
                id: "3",
                firstName: "Игорь",
                secondName: "Хорьков",
                avatarUrl: "https://storage.yvision.kz/images/publication/covers/a9/a9bb3db60c182056376652cfe3f16df6.jpg",
                raiting: "126",
                location: {
                    country: "Россия",
                    city: "Москва",
                },
                isFollowed: true,
            },

            {
                id: "4",
                firstName: "Антон",
                secondName: "Виноградов",
                avatarUrl: "https://storage.yvision.kz/images/publication/covers/a9/a9bb3db60c182056376652cfe3f16df6.jpg",
                raiting: "115",
                location: {
                    country: "Россия",
                    city: "Москва",
                },
                isFollowed: true,
            },

            {
                id: "5",
                firstName: "Света",
                secondName: "Яшикова",
                avatarUrl: "https://storage.yvision.kz/images/publication/covers/a9/a9bb3db60c182056376652cfe3f16df6.jpg",
                raiting: "88",
                location: {
                    country: "Россия",
                    city: "Москва",
                },
                isFollowed: false,
            },

            {
                id: "6",
                firstName: "Игорь",
                secondName: "Монахов",
                avatarUrl: "https://storage.yvision.kz/images/publication/covers/a9/a9bb3db60c182056376652cfe3f16df6.jpg",
                raiting: "154",
                location: {
                    country: "Россия",
                    city: "Москва",
                },
                isFollowed: false,
            },

        ],
}

function usersReducer(state = initialState, action) {

    switch (action.type) {

        case SET_USERS:
            return {...state, usersData:[
                ...state.usersData,
                ...action.users
            ]}

        case FOLLOW_USER:
            return {
                ...state,
                usersData: state.usersData.map (user => {
                    if (user.id === action.userId) {
                        return { ...user, isFollowed: true};
                    }
                    return user;
                })
            }

        case UNFOLLOW_USER:
            return {
                ...state,
                usersData: state.usersData.map (user => {
                    if (user.id === action.userId) {
                        return { ...user, isFollowed: false};
                    }
                    return user;
                })
            }
        default:
            return state;
    }
}

export const setUsers_AC = () => ({type: SET_USERS});
export const followUser_AC = (userId) => ({type: FOLLOW_USER, userId});
export const unfollowUser_AC = (userId) => ({type: UNFOLLOW_USER, userId});

export default usersReducer;