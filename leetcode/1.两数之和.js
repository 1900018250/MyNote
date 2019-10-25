/**
 * 
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

示例:
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 * 时间复杂度O(n^2)
 * 空间复杂度O(1)
 */
var twoSum = function(nums, target) {
    const length = nums.length
    for (let i = 0; i < length; ++i) {
        for (let j = i + 1; j < length; ++j) {
            if (target === nums[i] + nums[j]) {
                return [i, j]
            }
        }
    }
    return []
}

console.log(twoSum([1, 7, 8, 15], 9));

/**
 * 
 * @param {*} nums 
 * @param {*} target 
 * 时间复杂度O(n)
 * 空间复杂度O(n)
 */
const twoSum1 = (nums, target) => {
    const map = new Map()
    const length = nums.length
    for (let i = 0; i < length; ++i) {
        let j = map.get(target - nums[i]) 
        if (j || j === 0 && j !== i) {
            return i > j ? [j, i] : [i, j]
        } else {
            map.set(nums[i], i)
        }
    }
    return []
}
 
console.log(twoSum1([1, 7, 8, 15], 9));