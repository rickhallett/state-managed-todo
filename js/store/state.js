export default {
    items: localStorage.getItem('stateTodo') 
        ? 
            JSON.parse(localStorage.getItem('stateTodo')).items 
        : 
            [
                'I made this',
                'I also made this',
                'Followed by this. I know right.'
            ]
};