/**
 * @title: index.test.ts
 * @projectName functionPipeline
 * @description: TODO
 * @author zhangyunpeng0126
 * @date 2022/1/2817:46
 */
import FunctionPipeline from '../src';

describe('promise unrelated', () => {
    it('works', () => {
        let storedArticle = {}
        // expect(sum(1, 1)).toEqual(2);
        const getArticeDetailById = (articleId:number) => {
            // return axios.get({url:'/api/comments/get',params:{articleId}})
            return new Promise((resolve => {
                setTimeout(() => {
                    resolve({data: {id: 123, article: {title: 'jest good', content: 'good jest'}}})
                }, 200)
            }))
        }

        const filterArticleFromResponse = (res:any) => {
            return res.data.article
        }

        const setDetailInfo = (article:{}) => {
            setArticle(article)
        }

        const setArticle = (article:{}) => {
            return storedArticle = article
        }

        const getCommoentsByArticleId = (articleId:number) => {
            // return axios.get({url: '/api/comments/get', params: {articleId}})
            return new Promise((resolve => {
                setTimeout(() => {
                    resolve({data: {comments: []}})
                }, 300)
            }))
        }

        const hadndleArticleItemClick = (articleId:number) => {
            return new FunctionPipeline()
                .next(getArticeDetailById(articleId))
                .next(filterArticleFromResponse)
                .next(setDetailInfo)
                .next(getCommoentsByArticleId(articleId))
                .run()
        }
        hadndleArticleItemClick(211)

    });
});
describe('promise related', () => {
    it('works', () => {
        const getArticeDetailById = (articleId:number) => {
            // return axios.get({url:'/api/comments/get',params:{articleId}})
            return new Promise((resolve => {
                setTimeout(() => {
                    resolve({data: {id: 123, article: {title: 'jest good', content: 'good jest'}}})
                }, 200)
            }))
        }

        const searchContentByTitle = (articleInfo:any) => {
            // return axios.get({url: '/api/comments/get', params: {articleId}})
            return new Promise((resolve => {
                setTimeout(() => {
                    resolve({data: {}})
                }, 300)
            }))
        }

        const hadndleArticleItemClick = (articleId:number) => {
            return new FunctionPipeline()
                .next(getArticeDetailById(articleId))
                .after(searchContentByTitle)

                .run()
        }
        hadndleArticleItemClick(211)

    })
})