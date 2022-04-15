const {transformClassToFunctionPipeline,InitKeys} = require('../dist/index')


class ActionOfAllFeature {

    init() {
        return {
            [InitKeys.flatAsyncNames]: ['getArticeDetailById', 'getArticeDetailById2'],
            [InitKeys.saveResultNames]: ['getResult2', 'getResult']
        }
    }

    getArticeDetailById(id) {
        const p = new Promise((resolve => {
            setTimeout(() => {
                resolve({data: {id: 123, article: {title: 'jest good', content: 'good jest', authorId: 'abc'}}})
            }, 200)
        }))

        return p
    }

    filterAuthorId(res) {
        return res.data.article.authorId
    }

    getAuthorById(id) {
        const map = {
            'abc': '刘慈欣',
            'asd': '阿斯顿'
        }
        // console.log('map[id]', map[id])
        return new Promise((resolve => {
            setTimeout(() => {
                resolve({data: {author: {name: map[id]}}})
            }, 300)
        }))
    }

    print(name) {
        return name
    }

    filterAuhtorName(info) {
        // console.log('name1', info)
        return info.data.author.name
    }

    getInfoOfAuthor(authorName) {
        const map = {
            '刘慈欣': '宇宙出版社',
            '刘老根': '阿斯顿'
        }
        const friendsMap = {
            '刘慈欣': ['老李', '郭敬明', '韩寒'],
            '刘老根': ['阿斯顿']
        }
        const getAuthorCompany = new Promise((resolve => {

            setTimeout(() => {
                resolve(map[authorName])
            }, 300)
        }))
        const getAuthorFriends = new Promise((resolve => {

            setTimeout(() => {
                resolve(friendsMap[authorName])
            }, 200)
        }))
        return [getAuthorCompany, getAuthorFriends]
    }

    getResult(res) {
        return res
    }

    getArticeDetailById2(id) {
        const p = new Promise((resolve => {
            setTimeout(() => {
                resolve({data: {id: 123, article: {title: 'jest good123', content: 'good jest', authorId: 'abc'}}})
            }, 200)
        }))

        return p
    }


}

const setState = (fn) => {
    global.store = fn(global.store || {})
}
const fpl = transformClassToFunctionPipeline(ActionOfAllFeature, setState)

describe('Action', () => {
    it('works', done => {
        fpl.run(2)
        setTimeout(() => {
            expect(global.store["ActionOfAllFeature/getActionResult"]).toEqual(
                {data: {id: 123, article: {title: 'jest good123', content: 'good jest', authorId: 'abc'}}}
            )
            expect(global.store["ActionOfAllFeature/getResult"]).toEqual(['宇宙出版社', ['老李', '郭敬明', '韩寒']])
            done()
        }, 2000)
    })
})



