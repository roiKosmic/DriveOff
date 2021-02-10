drivesList.push(class Fr_Carrefour extends Drive {
  static driveName = 'Carrefour' 
  static domain = /carrefour\.fr$/
  static lang = 'fr'
  static country = 'france'

  static structure = {
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
})
