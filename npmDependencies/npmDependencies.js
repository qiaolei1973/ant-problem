/**
 * 1. 写一个算法，找出项目中npm包依赖的所有npm包，并找出其中有同一个包多版本存在的情况
 */

const path = require('path');
const fs = require('fs');


const findAllDependencies = (projectPath) => {
    const allDependencies = {};
    const duplicates = {};

    // 对每一个package的依赖进行记录 如果它也存在依赖的话继续搜索
    const register = (dependencies) => {
        Object.keys(dependencies).forEach(dependency => {
            if (!allDependencies[dependency]) {
                allDependencies[dependency] = dependencies[dependency];

                const dependencyPath = path.resolve(projectPath, 'node_modules', dependency);
                if (!fs.existsSync(dependencyPath)) {
                    return;
                }
                const packagePath = path.resolve(dependencyPath, 'package.json');
                if (!fs.existsSync(dependencyPath)) {
                    return;
                }
                const package = require(packagePath);
                findDependencies(package);
            } else if (allDependencies[dependency] !== dependencies[dependency]) {
                if (!(allDependencies[dependency] instanceof Array)) {
                    allDependencies[dependency] = [allDependencies[dependency], dependencies[dependency]]
                } else if (allDependencies[dependency] instanceof Array && !allDependencies[dependency].some(version => version === dependencies[dependency])) {
                    allDependencies[dependency].push(dependencies[dependency]);
                }
            }
        });
    }

    // 分别对dependencies与devDependencies做搜索记录
    const findDependencies = (package) => {
        package.dependencies && register(package.dependencies);
        package.devDependencies && register(package.devDependencies);
    }

    const packagePath = path.resolve(projectPath, 'package.json');
    const nodeModulesPath = path.resolve(projectPath, 'node_modules');

    if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(packagePath)) {
        console.error('缺少必要node_modules或package.json，无法查询依赖');
        return;
    }
    const package = require(path.resolve(projectPath, 'package.json'));

    findDependencies(package);

    Object.keys(allDependencies).forEach(dependency => {
        if (allDependencies[dependency] instanceof Array) {
            duplicates[dependency] = allDependencies[dependency];
        }
    })
    return { allDependencies, duplicates };
}

const pp = path.join(__dirname, '../zhihu');
const result = findAllDependencies(pp);
fs.writeFile('./log.json', JSON.stringify(result),(err)=>{
    if(err){
        console.error(err);
    }
});