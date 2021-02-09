drivesList.push(class Fr_Intermarche extends Drive {
  static driveName = 'Intermarché' 
  static domain = /intermarche\.com$/
  static lang = 'fr'
  static country = 'france'

  static structure = {
    productView: {
      base: '.ProductContainer__ProductContainerWrapper-sc-1lqtf3p-0',
      name: 'h1',
      mainDescription: '.styled__ProductGeneralInfoContainer-rc4bd7-0',
      description: '.ProductInformations__MainWrapper-sc-1vg3q1s-0',
      ean: () => {
        const reg = /product\/([0-9]{8,13})/i.exec(new URL(document.URL).pathname)
        if (reg[1]) return Number(reg[1])
      }
    },
    listView: {
      base: [
        '.styled__ProductGridWrapper-sc-15s6tne-0',
        '.carousel-produits__wrapper'
      ],
      product: {
        base: '.styled__ProductGridCell-sc-15s6tne-1',
        name: '.productTileV2Styled__DescriptionWrapper-sc-19ad4vz-9',
        mainDescription: '.textWrapperProductTile',
        ean: base => {
          if (base.dataset.id) return Number(base.dataset.id)
        }
      }
    }
  }
})
