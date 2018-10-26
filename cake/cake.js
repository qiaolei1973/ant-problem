/**
* 3.  假设你有一张20个代金券可以用来买蛋糕，每种蛋糕的可用一定的代金券来税换，假设有3种蛋糕
* 蛋糕 A 可以用7个代金券税换，实际价格为160元
* 蛋糕 B 可以用3个代金券税换，实际价格是90元
* 蛋糕 C 可以用2个代金券税换，实际价格为15元
* 
* 问如何用20个代金券换取价值最多的蛋糕
 */

/** 
 * 就这个问题来说当然一眼就能看出来是B*6+C*1,不过我觉得这道题的考查点应该在于背包问题..
*/
const arr = [];

/**
 * 完全背包问题
 * @param {*} couponNum 代金券张数
 * @param {*} cakes 有哪几种蛋糕 [{cakeName:string,price:number,needCoupons:number}]
 */

// 递归思路 不过不知道如何拿到具体蛋糕名称
const bestValue = (cakes, c, index) => {
    if (index < 0 || c <= 0) return 0;
    let res = bestValue(cakes, c, index - 1);
    const weight = cakes[index].needCoupons;
    const value = cakes[index].price;
    if (c >= weight) {
        res = Math.max(res, value + bestValue(cakes, c - weight, index - 1));
    }
    arr.push(cakes[index].cakeName);
    return res;
}

// 迭代思路
const bestValue2 = (cakes, c) => {
    const n = cakes.length;
    const arr = [[]];
    for (let j = 0; j <= c; j++) {
        arr[0][j] = j >= cakes[0].needCoupons ? cakes[0].price : 0;
    }
    for (let i = 1; i < n; i++) {
        arr[i] = [];
        for (let j = 0; j <= c; j++) {
            arr[i][j] = arr[i - 1][j];
            if (j >= cakes[i].needCoupons) {
                const now = arr[i][j];
                const pre = cakes[i].price + arr[i - 1][j - cakes[i].needCoupons];
                arr[i][j] = Math.max(now, pre);
            }
        }
    }
    return arr[n - 1][c];
}

const pickCake = (couponNum, cakes) => {
    const pool = [];
    cakes.forEach(cake => {
        for (let i = 0; i < couponNum / cake.needCoupons; i++)
            pool.push(cake);
    })

    return bestValue2(pool, couponNum);
}


console.log('pickCake: ',
    pickCake(20, [
        { cakeName: 'A', price: 160, needCoupons: 7 },
        { cakeName: 'B', price: 90, needCoupons: 3 },
        { cakeName: 'C', price: 15, needCoupons: 2 }
    ]));

console.log(arr);
