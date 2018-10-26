const defaultState = { articles: [], isLoading: false };

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_ARTICLES':
            const articles = [...state.articles, ...action.payload];
            return { ...state, articles };
        case 'UPDATE_LOADING':
            return { ...state, isLoading:action.payload };
        default:
            return state;
    }
}