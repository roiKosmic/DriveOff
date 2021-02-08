// Surveille les nouveaux produits dans une liste
class ProductList extends DOFFNode {
  constructor (data) {
    super(data)
    this.products = []
    this.detectElements()
    this._el.base.classList.add('driveoff_list')
  }

  addProduct (base) {
    if (base.classList.contains('driveoff_product')) return false
    this.products.push(new ProductItem({
      _structure: this._structure.product,
      _el: { base },
      _drive: this._drive
    }))
  }

  mutation (mutation) {
    console.debug('List mutation', mutation.type)
    if (mutation.type === 'childList') {
      this.detectElements()
    }
  }

  detectElements () {
    const products = this._el.base.querySelectorAll(this._structure.product.base)
    if (products) {
      products.forEach(node => {
        this.addProduct(node)
      })
    }
  }
}
