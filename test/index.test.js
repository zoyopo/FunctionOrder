/**
 * @title: index.test.ts
 * @projectName functionPipeline
 * @description: TODO
 * @author zhangyunpeng0126
 * @date 2022/1/2817:46
 */
//import FunctionPipeline from '../src';
const {FunctionPipeline} = require('../dist/index')
let storedArticle = {}
// expect(sum(1, 1)).toEqual(2);
const getArticeDetailById = (id) => {
    // return axios.get({url:'/api/comments/get',params:{articleId}})
    return new Promise((resolve => {
        setTimeout(() => {
            resolve({data: {id: 123, article: {title: 'jest good', content: 'good jest', authorId: 'abc'}}})
        }, 200)
    }))
}

const filterArticleFromResponse = (res) => {
    return res.data.article
}

const setDetailInfo = (article) => {
    console.log('article', article)
    setArticle(article)
}

const setArticle = (article) => {
    return storedArticle = article
}

const getCommoentsByArticleId = (id) => {
    // return axios.get({url: '/api/comments/get', params: {articleId}})
    return new Promise((resolve => {
        setTimeout(() => {
            resolve({data: {comments: []}})
        }, 300)
    }))
}

const filterAuthorId = (res) => {
    return res.data.article.authorId
}

const getAuthorById = (id) => {
    const map = {
        'abc': '刘慈欣',
        'asd': '阿斯顿'
    }
    return new Promise((resolve => {
        setTimeout(() => {
            resolve({data: {author: {name: map[id]}}})
        }, 300)
    }))
}

const hadndleArticleItemClickUnRelated = (articleId) => {
    return new FunctionPipeline.default()
        .next(getArticeDetailById(articleId))
        .next(filterArticleFromResponse)
        .next(setDetailInfo)
        .next(getCommoentsByArticleId(articleId))
        .run()
}
const hadndleArticleItemClickPromiseRelated = (articleId) => {
    // console.log('hadndleArticleItemClickPromiseRelated',articleId)
    return new FunctionPipeline.default()
        .next(getArticeDetailById(articleId))
        .next(filterAuthorId)
        .next(getAuthorById)
        .next((name)=>{console.log('name',name)})
        .run()
}

hadndleArticleItemClickPromiseRelated(123)


// describe('promise unrelated', () => {
//     it('works', () => {
//
//     });
// });
// describe('promise related', () => {
//     it('works', () => {
//         const getArticeDetailById = (articleId) => {
//             // return axios.get({url:'/api/comments/get',params:{articleId}})
//             return new Promise((resolve => {
//                 setTimeout(() => {
//                     resolve({data: {id: 123, article: {title: 'jest good', content: 'good jest'}}})
//                 }, 200)
//             }))
//         }
//
//         const searchContentByTitle = (articleInfo) => {
//             // return axios.get({url: '/api/comments/get', params: {articleId}})
//             return new Promise((resolve => {
//                 setTimeout(() => {
//                     resolve({data: {}})
//                 }, 300)
//             }))
//         }
//
//         const hadndleArticleItemClick = (articleId) => {
//             return new FunctionPipeline()
//                 .next(getArticeDetailById(articleId))
//                 .next(searchContentByTitle)
//                 .run()
//         }
//         hadndleArticleItemClick(211)
//
//     })
// })
