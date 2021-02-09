class DOFFNode {
  constructor (data) {
    this.extract(data)
    this._observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => this.mutation(mutation))
    })
    if (!this._el) this._el = { base: document.body }
    this._observer.observe(this._el.base, this.observerConfig)
    if (!this._structure) this._structure = this.constructor.structure || {}
  }

  extract (data) {
    if (!data) return false
    const keys = Object.keys(data)
    keys.sort()
    keys.forEach(key => {
      this[key] = data[key]
    })
    return this
  }
}
