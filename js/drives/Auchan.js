drivesList.push(class FrAuchan extends Drive {
  static get driveName () { return 'Auchan' }
  static get domain () { return /auchan\.fr$/ }
  static get lang () { return 'fr' }
  static get country () { return 'france' }

  static get structure () {
    return {
      productView: {
        base: '.product',
        name: 'h1',
        mainDescription: '.product__block--data',
        description: '.product-description',
        ean: base => {
          let ean
          Array.from(base.querySelectorAll('.product-description .product-description__feature-wrapper'))
            .forEach(wrap => {
              const label = wrap.querySelector('.product-description__feature-label')
              if (label && /ean/i.test(label.innerText)) {
                const values = wrap.querySelector('.product-description__feature-values')
                if (values) ean = values.innerText.split('/')[1].trim()
              }
            })
          return ean
        }
      },
      listView: {
        base: [
          '.list__container',
          '.product-carousel__container'
        ],
        product: {
          base: 'article',
          name: '.product-thumbnail__description',
          mainDescription: '.product-thumbnail__details-wrapper'
        }
      }
    }
  }
})
