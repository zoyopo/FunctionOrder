# FunctionPipeline

A lib offer good ways for function programing in javascript (node and browser)

## demo

### situation 1 simple Function

```tsx
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


```

### situation 2:unrelated Promise

```tsx
const print = (tag) => {
    return (name) => {
        console.log(tag, name)
    }
}
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
hadndleArticleItemClickPromiseRelated(123) // article { title: 'jest good', content: 'good jest', authorId: 'abc' }
                                           // getCommentContent yoyoyo,heiheihei

```

### situation 3:two related Promise

```tsx
const print = (tag) => {
    return (name) => {
        console.log(tag, name)
    }
}
const getArticeDetailById = (id) => {
    return new Promise((resolve => {
        setTimeout(() => {
            resolve({data: {id: 123, article: {title: 'jest good', content: 'good jest', authorId: 'abc'}}})
        }, 200)
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


const hadndleArticleItemClickPromiseRelated = (articleId) => {
    return new FunctionPipeline()
        .next(getArticeDetailById(articleId))
        .next(filterAuthorId)
        .next(getAuthorById)
        .next(print('name'))
        .run()
}

hadndleArticleItemClickPromiseRelated(123) // name { data: { author: { name: '刘慈欣' } } }

```

### create FunctionPipeline by Class
call methods by in order in class
``` tsx
const {transformClassToFunctionPipeline} = require('../dist/index')
class Action {
    doAction1() {
        return 1
    }
    doAction2(b) {       
        return b + 2
    }
    print = (name) => {    
       console.log(name)    
    }
}

const fpl = transformClassToFunctionPipeline(Action)
fpl.run() // 3
```


## roadMap

1. order control
2. promise support
