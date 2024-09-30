class Heap {
    constructor() {
        this.arr = []
    }
    insert(val) {
        // 首先将元素插入末尾
        this.arr.push(val)
        // 获取新插入元素的下标
        let index = this.arr.length - 1
        while (index > 0) {
            // 获取父元素下标
            let pIndex = Math.floor((index - 1) / 2)
            if (this.arr[index] > this.arr[pIndex]) {
                // 如果该元素大于父元素，则交换位置
                [this.arr[index], this.arr[pIndex]] = [this.arr[pIndex], this.arr[index]]
                index = pIndex
            } else {
                // 已经实现了大顶堆，跳出循环
                break
            }
        }
    }
    peekVal() {
        // 容器里已没有元素
        if (this.arr.length === 0) return
        // 容器里只有一个元素，无须花里胡哨，直接取出即可
        if (this.arr.length === 1) return this.arr.pop()
        // 保存堆顶元素
        let max = this.arr[0]
        // 类似于交换堆首尾元素位置，弹出末尾元素
        this.arr[0] = this.arr.pop()
        let index = 0
        let l = index * 2 + 1
        let r = index * 2 + 2
        while (l < this.arr.length) {
            let tmp = l
            // 取左右子元素中最大值的下标
            if (r < this.arr.length && this.arr[r] > this.arr[l]) {
                tmp = r
            }
            // 如果子元素比当前元素大，则 交换位置
            if (this.arr[index] < this.arr[tmp]) {
                [this.arr[index], this.arr[tmp]] = [this.arr[tmp], this.arr[index]]
                index = tmp
                l = index * 2 + 1
                r = index * 2 + 2
            } else {
                // 跳出循环
                break
            }
        }
        return max
    }
}
const heap = new Heap();

// 插入一些元素  
heap.insert(3);
heap.insert(1);
heap.insert(4);
heap.insert(1);
heap.insert(5);
heap.insert(9);
heap.insert(2);
heap.insert(6);
heap.insert(5);
heap.insert(3);
heap.insert(5);
heap.insert(1);
heap.insert(1);
heap.insert(1);
heap.insert(1);

console.log(heap)