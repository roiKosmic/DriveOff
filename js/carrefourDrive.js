const addingExtensionToCarrefour = () => {
  const img = chrome.extension.getURL('/img/openFood.png')
  document.body.querySelector('.nutriTaux').height('120')
  document.body.querySelector('.nutriAdditif').height('120')
  document.body.querySelector('.productBarCode').height('120')
  document.body.querySelector('.nutriImg').height('120')
  if (document.body.querySelector('.product-list__row').length) {
    console.log('In carrefour ooshop')
    document.body.querySelector('.cd-ProductVisual')
      .insertAdjacentHTML('beforeend', `<img class='openfood carrefour cd-ProductOrigin' src="${img}">`)
    document.body.querySelector('.quantity-controller')
      .insertAdjacentHTML('beforeend', `<img class='openfood carrefour quantity-controller__button' src="${img}">`)
  }
  document.body.querySelector('.product-card__body')
    .insertAdjacentHTML('beforeend', `<img class='openfood carrefour' src="${img}">`)
  document.body.querySelector('.quantity-controller')
    .insertAdjacentHTML('beforeend', `<img class='openfood carrefour quantity-controller__button' src="${img}">`)
}

const addingObserverToCarrefour = () => {
  if (document.body.querySelector('body').length) {
    // The node to be monitored
    const target = document.body

    // Create an observer instance
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (document.body.querySelector('.product-list__grid')) {
          console.log('Product list Inserted, begin watching it:' + mutation.type)
          observer.disconnect()
          const target2 = document.body.querySelector('.product-list__grid')
          const observer2 = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              console.log('carrefour dom mutation product list: ' + mutation.type)
              const newNodes = mutation.addedNodes // DOM NodeList
              if (newNodes !== null) { // If there are new nodes added
                const nodes = document.body.querySelector(newNodes) // jQuery set
                const img = chrome.extension.getURL('/img/openFood.png')
                nodes.each(function () {
                  const node = document.body.querySelector(this)
                  console.log('product list modified ')

                  if (node.hasClass('product-list__item')) {
                    console.log('product inserted in DOM')

                    node.find('.product-card__body').find('.carrefour').remove()
                    node.find('.product-card__body')
                      .insertAdjacentHTML('beforeend', `<img class='openfood carrefour' src="${img}">`)
                  }
                })
                bindOpenFoodIconEvent()
              }
            })
          })
          const config2 = {
            attributes: true,
            childList: true,
            characterData: true

          }

          observer2.observe(target2, config2)
        }

        if (document.body.querySelector('.product-list__row').length) {
          console.log('In carrefour ooshop')
          observer.disconnect()
          const target2 = document.body.querySelector('.product-list__row')[0]
          const observer2 = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              console.log('carrefour dom mutation product list: ' + mutation.type)
              const newNodes = mutation.addedNodes // DOM NodeList
              if (newNodes !== null) { // If there are new nodes added
                const nodes = document.body.querySelector(newNodes) // jQuery set
                const img = chrome.extension.getURL('/img/openFood.png')
                nodes.each(function () {
                  const node = document.body.querySelector(this)
                  console.log('product list modified ')

                  if (node.hasClass('products-card')) {
                    console.log('product inserted in DOM')
                    document.body.querySelector('.carrefour').remove()
                    document.body.querySelector('.quantity-controller')
                      .insertAdjacentHTML('beforeend', `<img class='openfood carrefour quantity-controller__button' src="${img}">`)
                  }
                })
                bindOpenFoodIconEvent()
              }
            })
          })
          const config2 = {
            attributes: true,
            childList: true,
            characterData: true

          }

          observer2.observe(target2, config2)
        }
      })
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

const getCarrefourQueryURL = elm => {
  let detail
  if (document.body.querySelector('.product-list__row').length) {
    detail = elm.parent('.quantity-controller').parent().find('.products-card__body__content__text__products-name').html()

    console.log('Get from oops ' + detail)
    return filterTitle(detail)
  } else {
    detail = elm.parent('.product-card__body').parent('article').attr('id')
    const _url = 'https://fr.openfoodfacts.org/api/v0/product/' + detail + '.json'
    return _url
  }
}
