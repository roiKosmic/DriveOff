drivesList.push(class FrBiocoop extends Drive {
  static get driveName () { return 'Biocoop' }
  static get domain () { return /bio\.coop$/ }
  static get lang () { return 'fr' }
  static get country () { return 'france' }

  static get structure () {
    return {
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
          base: ['.product-item-info'],
          name: '.product-thumbnail__description',
          mainDescription: '.product-item-attributes'
        }
      }
    }
  }
})
