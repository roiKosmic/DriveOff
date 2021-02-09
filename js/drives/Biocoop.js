drivesList.push(class Fr_Biocoop extends Drive {
  static driveName = 'Biocoop'
  static domain = /bio\.coop$/
  static lang = 'fr'
  static country = 'france'

  static structure = {
    productView: {
      base: '.catalog-product-view .column.main',
      name: 'h1',
      mainDescription: '#all-on-my-product',
      description: '#all-on-my-product',
      ean: base => {
        return /([0-9]{8,13})/.exec(base.querySelector('.ref').innerText)[1]
      }
    },
    listView: {
      base: '.products-grid',
      product: {
        base: [ '.product-item-info' ],
        name: '.product-thumbnail__description',
        mainDescription: '.product-item-attributes'
      }
    }
  }
})
