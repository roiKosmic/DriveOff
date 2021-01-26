const addingExtensionToLeclerc = () => {
  const img = chrome.extension.getURL('/img/openFood.png')
  document.body.querySelector('.divWCRS310_HD').insertAdjacentHTML('beforeend', "<img class='openfood' src='" + img + "'>")
}

const addingObserverToLeclercDrive = () => {
  // The node to be monitored
  if (document.body.querySelector('#ulListeProduits').length) {
    const target = document.body.querySelector('#ulListeProduits')

    // Create an observer instance
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const newNodes = mutation.addedNodes // DOM NodeList
        if (newNodes !== null) { // If there are new nodes added
          const nodes = document.body.querySelector(newNodes) // jQuery set
          const img = chrome.extension.getURL('/img/openFood.png')
          nodes.each(function () {
            const node = document.body.querySelector(this)

            if (node.hasClass('liWCRS310_Product')) {
              console.log('product inserted in DOM')
              node.find('.divWCRS310_HD')
                .insertAdjacentHTML('beforeend', `<img class='openfood' src="${img}">`)
            }
          })
        }
      })
      bindOpenFoodIconEvent()
    })

    // Configuration of the observer:
    const config = {
      attributes: true,
      childList: true,
      characterData: true
    }

    // Pass in the target node, as well as the observer options
    observer.observe(target, config)
  }
}
const getLeclercDriveQueryURL = elm => {
  const detail = elm.parent('.divWCRS310_HD').prevAll('.pWCRS310_Desc').find('a').html()
  console.log('Detail leclerc :', detail)
  return filterTitle(detail)
}
