drivesList.push(class Fr_Intermarche extends Drive {
  static driveName = 'Intermarché' 
  static domain = /intermarche\.com$/
  static lang = 'fr'

  static structure = {
    productView: {
      base: '.ReactModal__Content',
      name: 'h1',
      mainDescription: '.styled__ProductGeneralInfoContainer-rc4bd7-0',
      description: '.ProductInformations__MainWrapper-sc-1vg3q1s-0',
      ean: () => /product\/([0-9]{13})/i.exec(new URL(document.URL).pathname)[1]
    },
    listView: {
      base: [
        '.styled__ProductGridWrapper-sc-15s6tne-0',
        // '.slick-list',
        '.carousel-produits__frame'
      ],
      product: {
        base: [
          '.styled__ProductGridCell-sc-15s6tne-1',
          // class="productTileV2Styled__TileWrapper-sc-19ad4vz-0 kYBHZZ"
          // '.slick-slide'
        ],
        name: '.productTileV2Styled__DescriptionWrapper-sc-19ad4vz-9',
        mainDescription: '.textWrapperProductTile',
        ean: base => base.dataset.id
      }
    }
  }
})
