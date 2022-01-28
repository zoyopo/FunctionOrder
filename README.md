# FunctionPipeline

A lib offer good ways for function programing in javascript (node and browser)

## demo
situation 1:two unrelated request
```tsx
const getArticeDetailById = (articleId) => {
    return axios.get({url: '/api/comments/get', params: {articleId}})
}

const getDetailId = (res) => {
    return res.data.id
}

const filterArticleFromResponse = (res) => {
    return res.data.article
}

const setDetailInfo = (article) => {
    setArticle(article)
}

const getCommoentsByArticleId = (articleId) => {
    return axios.get({url: '/api/comments/get', params: {articleId}})
}

const hadndleArticleItemClick = (articleId) => {
    return new FunctionPipeline()
        .next(getArticeDetailById(articleId))
        .next(filterArticleFromResponse)
        .next(setDetailInfo)
        .next(getCommoentsByArticleId(articleId))
}

```

## roadMap
1. order control
2. promise support
