/**
 * @title: index.test.ts
 * @projectName functionPipeline
 * @description: TODO
 * @author zhangyunpeng0126
 * @date 2022/1/2817:46
 */

const {FunctionPipeline} = require('../dist/index')
const print = (tag) => {
    return (name) => {
        console.log(tag, name)
    }
}
// #region simple function chain call
const getSquare = (num) => {
    return () => Math.pow(num, 2)
}

const plus = (plusNums) => {
    return (prevResult) => plusNums + prevResult
}
new FunctionPipeline().next(getSquare(2)).next(plus(3)).run(res=>console.log('getSquare',res))

// #endregion

const getArticleDetailById = (id) => {
    return new Promise((resolve => {
        setTimeout(() => {
            resolve({data: {id: 123, article: {title: 'jest good', content: 'good jest', authorId: 'abc'}}})
        }, 200)
    }))
}

const filterArticleFromResponse = (res) => {
    return res.data.article
}


const getCommentsByArticleId = (id) => {
    // return axios.get({url: '/api/comments/get', params: {articleId}})
    return new Promise((resolve => {
        setTimeout(() => {
            resolve({
                data: {
                    comments: [
                        {commenter: 'test0', content: 'yoyoyo'},
                        {
                            commenter: 'test1',
                            content: 'heiheihei'
                        }
                    ]
                }
            })
        }, 300)
    }))
}

const getCommentContent = (commentsInfo) => {
    return commentsInfo.data.comments.map(item => item.content).join(',')
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
    return new FunctionPipeline()
        .lineTo(getArticeDetailById(articleId))
        .lineTo(filterArticleFromResponse)
        .lineTo(print('article'))
        .lineTo(getCommentsByArticleId(articleId))
        .lineTo(getCommentContent)
        .lineTo(print('getCommentContent'))
        .run(res=>console.log('hadndleArticleItemClickUnRelated',res))
}
const hadndleArticleItemClickPromiseRelated = (articleId) => {
    // console.log('hadndleArticleItemClickPromiseRelated',articleId)
    return new FunctionPipeline()
        .lineTo(getArticeDetailById(articleId))
        .lineTo(filterAuthorId)
        .lineTo(getAuthorById)
        .lineTo(print('name'))
        .run()
}

hadndleArticleItemClickUnRelated(123)


// describe('promise unrelated', () => {
//     it('works', () => {
//
//     });
// });
// describe('promise related', () => {
//     it('works', () => {

//     })
// })
