/**
给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例：
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
 */
function ListNode(val) {
    this.val = val
    this.next = null
}

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    const result = new ListNode(null)     // 输出的结果
    let temp = result   // 临时插入节点
    let carry = 0   // 后一位满10向前的进位数
    while (l1 || l2) {
        let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0)   // 当前位置的两数之和
        // 是否进位
        if (sum + carry >= 10) {
            sum = (sum + carry) % 10 
            carry = 1
        } else {
            sum = sum + carry
            carry = 0
        }
        // 插入节点
        temp.next = new ListNode(sum)
        temp = temp.next
        // 移动节点
        l1 = l1 ? l1.next : l1
        l2 = l2 ? l2.next : l2
    }
    // 如果最后一位有进位
    if (carry) {
        temp.next = new ListNode(carry)
    }
    return result.next
}

var addTwoNumbers = (l1, l2, carry = 0) => {
    let sum = l1.val + l2.val + carry
    if (sum >= 10) {
        sum = sum % 10
        carry = 1
    } else {
        carry = 0
    }
    return {
        val: sum,
        // 三元运算符的比|| 的优先级高
        next: l1.next || l2.next || carry ? addTwoNumbers1(
            l1.next || { val: 0, next: null },
            l2.next || { val: 0, next: null },
            carry
        )
        :null
    }
}


l1 = new ListNode(2)
l1.next = new ListNode(4)
l1.next.next = new ListNode(3)

l2 = new ListNode(5)
l2.next = new ListNode(6)
l2.next.next = new ListNode(4)

let s =  addTwoNumbers1(l1, l2)
while(s) {
    console.log(s)
    s = s.next
}


