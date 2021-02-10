drivesList.push(class FrCarrefour extends Drive {
  static get driveName () { return 'Carrefour' }
  static get domain () { return /carrefour\.fr$/ }
  static get lang () { return 'fr' }
  static get country () { return 'france' }

  static get structure () {
    return {
      productView: {
        base: '#product-detail-page',
        name: 'h1',
        mainDescription: '.main-details__right',
        // description: '.ProductInformations__MainWrapper-sc-1vg3q1s-0',
        ean: () => {
          return Number(/p\/.*-([0-9]{13})/i.exec(new URL(document.URL).pathname)[1])
        }
      },
      listView: {
        base: [
          '.product-list ul',
          '.editorial-product-list__products',
          '.carousel--gutters',
          '.recommendations'
        ],
        product: {
          base: 'article',
          name: 'h2',
          mainDescription: '&',
          ean: base => {
            return Number(base.id)
          }
        }
      }
    }
  }
})
