import axios from 'axios';

const updateArticles = (articles) => {
    return { payload: articles, type: 'UPDATE_ARTICLES' };
}

const updateLoading = (isLoading) => {
    return { payload: isLoading, type: 'UPDATE_LOADING' };
}

export const fetchArticles = () => {
    return dispatch => {
        dispatch(updateLoading(true));
        return axios.get('/articles')
            .then((response) => {
                const articles = response.data.data;
                dispatch(updateArticles(articles));
                dispatch(updateLoading(false));
            });
    }
}