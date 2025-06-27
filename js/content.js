let problemsData = null
let flag = true

let fn = () => {
  if (problemsData === null) {
    if (flag) setTimeout(fn, 1000)
    return
  }
  const topics = document.querySelectorAll("a[id]")
  if (topics.length === 0) {
    setTimeout(fn, 1000)
    return
  }


  topics.forEach(item => {
    const targetElem = item.firstElementChild?.lastElementChild
    if (!targetElem) return
    const rtopicId = parseInt(item.firstElementChild.innerText)
    if (problemsData[rtopicId] && problemsData[rtopicId].rating) {
      targetElem.innerText = Math.floor(+problemsData[rtopicId].rating)
    }
    else targetElem.innerText = '0000'
  })

  // 获取父节点
  const parentElem = topics[0].parentElement

  const observerOptions = {
    childList: true,    // 子节点变化
    subtree: false,     // 后代节点变化
  }

  const callback = function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) {
          // 判断node是否为a标签
          if (node.nodeName !== 'A') continue
          const rtopicId = parseInt(node.firstElementChild.innerText)
          const targetElem = node.firstElementChild?.lastElementChild
          if (!targetElem) continue
          if (problemsData[rtopicId] && problemsData[rtopicId].rating) {
            targetElem.innerText = Math.floor(+problemsData[rtopicId].rating)
          } else targetElem.innerText = '0000'
        }
      }
    }
  }

  const observer = new MutationObserver(callback)
  // 监听特定元素的变化
  observer.observe(parentElem, observerOptions)
}

setTimeout(fn, 1000)

const getData = async () => {
  try {
    // 获取资源文件路径
    // 原始版权归属: Huxulm and all other contributors
    // 使用许可: MIT 许可证 (完整文本见项目根目录 LICENSE 文件)
    const response = await fetch('https://huxulm.github.io/lc-rating-v2/problemset/problems.json');
    if (!response.ok) {
      flag = false;
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }
    problemsData = await response.json();
  } catch (error) {
    flag = false;
  }
}
getData()