
const drivesList = []

// Base class to extends per drive
// Surveille les élements de produit et de listes
class Drive extends DOFFNode {
  static detect () {
    const Driver = drivesList.find(drive => drive.domain.test(document.domain))
    if (Driver) {
      console.info('Drive detected:', Driver.driveName, `(${document.domain})`)
      return new Driver()
    }
  }

  constructor () {
    super()
    this.products = []
    this.productLists = []
    this.detectElements()
  }

  get name () {
    return this.constructor.driveName
  }

  addProduct (base) {
    if (base.classList.contains('driveoff_product')) return false
    this.products.push(new ProductItem({
      _structure: this._structure.productView,
      _el: { base },
      _drive: this
    }))
  }

  addList (base) {
    if (base.classList.contains('driveoff_list')) return false
    this.products.push(new ProductList({
      _structure: this._structure.listView,
      _el: { base },
      _drive: this
    }))
  }

  mutation (mutation) {
    console.debug('Drive mutation', mutation.type)
    if (mutation.type === 'childList') {
      this.detectElements()
    }
  }

  // Detect lists & products in documents
  detectElements () {
    const { productView, listView } = this._structure
    if (listView && listView.base) {
      const lists = Array.from(document.body.querySelectorAll(listView.base))
      if (lists) {
        lists.forEach(base => {
          this.addList(base)
        })
      }
    }
    if (productView && productView.base) {
      const products = Array.from(document.body.querySelectorAll(productView.base))
      if (products) {
        products.forEach(base => {
          this.addProduct(base)
        })
      }
    }
  }
}
