const addingExtensionToAuchanDrive = () => {
  const img = chrome.extension.getURL('/img/openFood.png')

  // Ajout dans la liste des produits sur le liste
  const productItemShortcuts = document.body.querySelector('.product-item__shortcuts')
  if (productItemShortcuts) productItemShortcuts.insertAdjacentHTML('beforeend', `<img class='product-item__shortcutsButton  openfood' src="${img}">`)

  // Ajout dans le cas d'une liste
  if (document.body.querySelector('.operations-area')) {
    document.body.querySelector('.operations-area')
      .insertAdjacentHTML('beforeend', `<img class='openfood' src="${img}">`)
    inListAuchan = true
  }
}

const addingObserverToAuchanDrive = () => {
  if (document.body.querySelector('main').length) {
    // The node to be monitored
    const target = document.body.querySelector('main')[0]

    // Create an observer instance
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const newNodes = mutation.addedNodes // DOM NodeList
        if (newNodes !== null) { // If there are new nodes added
          const nodes = document.body.querySelector(newNodes) // jQuery set
          const img = chrome.extension.getURL('/img/openFood.png')
          nodes.each(() => {
            const node = document.body.querySelector(this)

            if (node.hasClass('product-item')) {
              console.log('product inserted in DOM')
              node.find('.product-item__shortcuts')
                .insertAdjacentHTML('beforeend', `<img class='product-item__shortcutsButton  openfood' src="${img}">`)
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

const getAuchanDriveQueryURL = elm => {
  let detail
  if (!inListAuchan) {
    detail = elm.closest('article').attr('data-name')
  } else {
    detail = elm.parent('.operations-area').prevAll('.libelle-produit').find('span').html()
    console.log('inlist')
  }
  console.log(detail)

  // var preFilter = ['auchan bio','auchan'];

  return filterTitle(detail)
}
