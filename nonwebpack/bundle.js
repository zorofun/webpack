

const fs = require('fs')
const babylion = require('babylon')  //将文件解析成ast树,npm包
const traverse  = require('babel-traverse').default
const path  = require('path');
const babel = require('@babel/core');

let ID = 0;
function createAsset(filename){
  const content = fs.readFileSync(filename,'utf-8')
  const ast = babylion.parse(content,{
    sourceType:'module'
  })
  const dependencies = []
  traverse(ast,{
    ImportDeclaration:({node})=>{
      dependencies.push(node.source.value)
    }
  })
  const id = ID++;
  //不用在async的转化code，因为我们已经有ast了
  const {code}= babel.transformFromAst(ast,null,{
    presets:["@babel/env"]
  })
  return{
    id,filename,dependencies,code
  }
}
//找到每个的依赖
function createGraph(entry){
  const mainAsset = createAsset(entry)
  //队列
  const queue = [mainAsset]
  //每次增加child增加迭代，我去这不就是深度遍历么，太牛逼了
  for(const asset of queue){
    const dirname = path.dirname(asset.filename)
    //console.log(asset);
    asset.mapping={}
    //为了显示依赖模块和id之间的关系
    asset.dependencies.forEach(relativePath=>{
       const absolutePath = path.join(dirname,relativePath)
      const child = createAsset(absolutePath)
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }
  return queue
}
const graph = createGraph('./index.js')
function bundle(graph){
  let modules = ``
  graph.forEach(mod=>{
    modules+= `${mod.id}:[
      function(require,module,exports){
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)}
    ],`
  })
  //立即执行函数
   const result=`
   (function(modules){
     function require(id){
       const [fn,mapping] = modules[id];
       function localRequire(relativePath){
         return require(mapping[relativePath])
       }
       const module={exports:{}}
       fn(localRequire,module,module.exports)
       return module.exports
     }
     require(0)
   })({${modules}})
   `
  return result
}

const result = bundle(graph)


function writeFile(text){
  const bufferText = Buffer.from(text)
  fs.writeFile('./output.js',bufferText,{},(err)=>{
    if (err){
      console.log(err)
    }
  })
}
writeFile(result)

//console.log(result);