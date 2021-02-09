// Surveille les nouveaux produits dans une liste
class ProductList extends DOFFNode {
  constructor (data) {
    super(data)
    this.detectElements()
    this._el.base.classList.add('driveoff_list')
  }

  get observerConfig () {
    return {
      subtree: true,
      attributes: false,
      childList: true,
      characterData: true
    }
  }

  addProduct (base) {
    if (base.classList.contains('driveoff_product')) return false
    return new ProductItem({
      _structure: this._structure.product,
      _el: { base },
      _drive: this._drive
    })
  }

  mutation (mutation) {
    if (mutation.type === 'childList') {
      const { product } = this._structure
      const addedNodes = Array.from(mutation.addedNodes)
      if (addedNodes.length) {
        addedNodes.forEach(node => {
          if (node && node.classList && !Array.from(node.classList).find(c => /^driveoff_/.test(c))) {
            if (product.base && node.matches(product.base)) {
              this.addProduct(node)
            }
          }
        })
      }
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
