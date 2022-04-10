/**
 * @title: index.test.ts
 * @projectName functionPipeline
 * @description: TODO
 * @author zhangyunpeng0126
 * @date 2022/1/2817:46
 */

const {FunctionPipeline} = require('../dist/index')

//#region situation 1 simple Function

const print = (tag) => {
    return (name) => {
        console.log(tag, name)
    }
}

const getSquare = (num) => {
    return ()=> Math.pow(num, 2)
}

const plus = (plusNums) => {
    return (prevResult) => plusNums + prevResult
}

new FunctionPipeline().next(getSquare(2)).next(plus(3)).next(print('result')) // result 7

//#endregion


//#region situation 2:unrelated Promise
const getArticeDetailById = (id) => {
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
const hadndleArticleItemClickUnRelated = (articleId) => {
    return new FunctionPipeline()
        .next(getArticeDetailById(articleId))
        .next(filterArticleFromResponse)
        .next(print('article'))
        .next(getCommentsByArticleId(articleId))
        .next(getCommentContent)
        .next(print('getCommentContent'))
        .run()
}
//hadndleArticleItemClickPromiseRelated(123)

//#endregion

//#region related promise


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


const hadndleArticleItemClickPromiseRelated = (articleId) => {
    return new FunctionPipeline()
        .next(getArticeDetailById(articleId))
        .next(filterAuthorId)
        .next(getAuthorById)
        .next(print('name'))
        .run()
}

hadndleArticleItemClickPromiseRelated(123) // name { data: { author: { name: '刘慈欣' } } }
//#ednregion

// hadndleArticleItemClickUnRelated(123)


describe('promise unrelated', () => {
    it('works', () => {

    });
});
// describe('promise related', () => {
//     it('works', () => {
//
//     })
// })
