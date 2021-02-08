// https://docs.google.com/document/d/1KEMI0Lrm3rEu-0IGpgXxsbuxjLnV_LemNS27e_LV2aU/edit#heading=h.h5dcl5pi01qr

const manifest = chrome.runtime.getManifest()

const searchURL = new URL('https://fr.openfoodfacts.org/cgi/search.pl')
searchURL.searchParams.set('search_simple', 1)
searchURL.searchParams.set('action', 'process')
searchURL.searchParams.set('json', 1)
searchURL.searchParams.set('appversion', manifest.version)
searchURL.searchParams.set('appid', manifest.name)

const apiEndpoint = new URL('https://world.openfoodfacts.org/api/v0/product/')

const UA = `${navigator.userAgent} ${manifest.name}/${manifest.version}`

const uselessWords = [
  'une', 'un',
  'des', 'de',
  'au', 'aux',
  'à', 'et',
  'en', 'sur',
  'par', 'pour',
  'd', 'l', 's',
  'g', 'cl', 'kg', 'ml'
]

// Surveille les changements dans un produit pour afficher les données dès que possible
class ProductItem extends DOFFNode {
  constructor (data) {
    super(data)
    this.scrap()
    this._el.base.classList.add('driveoff_product')
    if (this.ean) this.fetchOFF()
    console.debug('ean', this.ean)
  }

  get name () {
    if (this._el.name) return this._el.name.innerText
  }

  get searchQuery () {
    if (!this.name) return new Error('No Name')
    const productTitle = slug(this.name, {
      replacement: ' ',
      remove: /[0-9]/g
    })
    const split = productTitle.split(/[,\s;.:/!?"«»)(*><]+/)
    let searchString = split.reduce((acc, word) => {
      if (
        acc.length < 4 &&
        !acc.find(w => w === word) &&
        !uselessWords.find(w => w === word)
      ) acc.push(word)
      return acc
    }, []).join(' ')
    searchString = searchString.replace(/\s{2,}/g, '')
    return searchString
  }

  mutation (mutation) {
    console.debug('Product mutation', mutation.type, this.ean)
    if (!this.ean) {
      this.scrap()
      if (this.ean) this.fetchOFF()
    }
    this.completeCard()
  }

  scrap () {
    const { ean, mainDescription, name } = this._structure

    if (ean) {
      switch (typeof ean) {
        case 'string' :
          this.ean = this._el.base.querySelector(ean)
          if (this.ean) this.ean = this.ean.innerText
          else this.ean = false
          break
        case 'function':
          this.ean = ean(this._el.base)
          break
      }
    }

    if (mainDescription === '&') this._el.mainDescription = this._el.base
    else this._el.mainDescription = this._el.base.querySelector(mainDescription)

    this._el.name = this._el.base.querySelector(name)
    if (this._el.name) this._el.name.classList.add('driveoff_name')

    this._el.scores = this._el.base.querySelector('.driveoff_scores')
    if (!this._el.scores) {
      this._el.scores = document.createElement('div')
      this._el.scores.classList.add('driveoff_scores')
      if (this._el.mainDescription) {
        this._el.mainDescription.appendChild(this._el.scores)
      }
    }
  }

  searchOFF () {
    console.info('Search in OFF database')
    searchURL.searchParams.set('search_terms', this.searchQuery)
    return fetch(searchURL, {
      method: 'get',
      cache: 'force-cache',
      cors: 'no-cors',
      headers: new Headers({
        Accept: 'application/json',
        'User-Agent': UA
      })
    })
      .then(response => {
        if (!response.ok) throw new Error(response.error)
        return response.json()
      })
      .then(data => {
        if (!data || !data.products || !data.products.length) throw new Error('No result')
        this.extract(data.products[0])
      })
      .then(() => this.completeCard())
  }

  fetchOFF () {
    return new Promise((resolve, reject) => {
      if (!this.ean) return reject(new Error('Search desactived')) // this.searchOFF()
      console.info('Fetch from OFF API')
      const api = new URL(this.ean + '.json', apiEndpoint)
      console.debug('API request', api.pathname)
      return fetch(api, {
        method: 'get',
        cache: 'force-cache',
        cors: 'no-cors',
        headers: new Headers({
          Accept: 'application/json',
          'User-Agent': UA
        })
      })
        .then(response => {
          if (!response.ok) reject(response.error)
          return response.json()
        })
        .then(data => {
          if (!data.product) reject(new Error('No Result'))
          this.extract(data.product)
        })
        .then(() => this.completeCard())
    })
  }

  get novaGrade () {
    if (!this.nova_group) return 'unknown'
    if (this.nova_group === 'not-applicable') return 'unknown'
    return this.nova_group
  }

  get nutriScoreGrade () {
    if (!this.nutriscore_grade) return 'unknown'
    if (this.nutriscore_grade === 'not-applicable') return 'unknown'
    return this.nutriscore_grade
  }

  get ecoScoreGrade () {
    if (!this.ecoscore_grade) return 'unknown'
    if (this.ecoscore_grade === 'not-applicable') return 'unknown'
    return this.ecoscore_grade
  }

  get novaImg () {
    return `https://static.openfoodfacts.org/images/attributes/nova-group-${this.novaGrade}.svg`
  }

  get ecoScoreImg () {
    return `https://static.openfoodfacts.org/images/attributes/ecoscore-${this.ecoScoreGrade}.svg`
  }

  get nutriScoreImg () {
    return `https://static.openfoodfacts.org/images/attributes/nutriscore-${this.nutriScoreGrade}.svg`
  }

  completeCard () {
    if (!this.ean) return false
    const el = this._el
    el.scores.innerHTML = ''

    const nutriscore = document.createElement('img')
    nutriscore.id = 'nutriscore'
    nutriscore.src = this.nutriScoreImg
    nutriscore.alt = `Nutri Score : ${this.nutriScoreGrade.toUpperCase()} ${this.nutriscore_score ? `(${Number(this.nutriscore_score)} pts)` : ''}`
    el.scores.appendChild(nutriscore)

    const novascore = document.createElement('img')
    novascore.id = 'novascore'
    novascore.src = this.novaImg
    novascore.alt = `Nova : ${this.novaGrade}`
    el.scores.appendChild(novascore)

    const ecoscore = document.createElement('img')
    ecoscore.src = this.ecoScoreImg
    ecoscore.alt = `Eco Score : ${this.ecoScoreGrade.toUpperCase()} ${this.ecoscore_score ? `(${Number(this.ecoscore_score).toFixed(2)} pts)` : ''}`
    el.scores.appendChild(ecoscore)

    el.scores.title = [nutriscore.alt, novascore.alt, ecoscore.alt].join('\n')
  }
}
