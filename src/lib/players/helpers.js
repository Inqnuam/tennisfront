export const newPlayer = () => {
    return {
        id: "",
        firstname: "",
        lastname: "",
        birthday: Date.now(),
        sex: "F",
        country: {
            picture: "",
            code: "",
        },
        picture: "",
        data: {
            rank: 1,
            points: 0,
            weight: 0,
            height: 0,
            last: [],
        },
    };
};
