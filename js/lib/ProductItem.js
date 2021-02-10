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
    this._el.base.classList.add('driveoff_product')
    this.scrap()
    if (this.ean) this.fetchOFF()
  }

  get name () {
    if (this._el.name) return this._el.name.innerText
  }

  get observerConfig () {
    return {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true
    }
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
    if (!this.ean) {
      this.scrap()
      if (this.ean) this.fetchOFF()
    }
  }

  scrap () {
    const { ean, mainDescription, name } = this._structure

    if (ean && !this.ean) {
      let qean
      switch (typeof ean) {
        case 'string' :
          qean = this._el.base.querySelector(ean)
          if (qean) this.ean = qean.innerText
          break
        case 'function':
          qean = ean(this._el.base)
          break
      }
      if (qean && /^[0-9]{8,13}$/.test(qean)) this.ean = qean
    }

    if (!this._el.mainDescription) {
      if (mainDescription === '&') this._el.mainDescription = this._el.base
      else this._el.mainDescription = this._el.base.querySelector(mainDescription)
    }

    if (!this._el.name) {
      this._el.name = this._el.base.querySelector(name)
      if (this._el.name) this._el.name.classList.add('driveoff_name')
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
        this.completeCard()
      })
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
          if (!data.product) return reject(new Error('No Result'))
          this.extract(data.product)
          this.completeCard()
        })
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
    const img = document.createElement('img')
    img.classList.add('driveoff_novascore')
    img.width = 68
    img.height = 130
    img.src = chrome.runtime.getURL(`img/nova-group-${this.novaGrade}.svg`)
    return img
  }

  get ecoScoreImg () {
    const img = document.createElement('img')
    img.classList.add('driveoff_ecoscore')
    img.width = 274
    img.height = 130
    img.src = chrome.runtime.getURL(`img/ecoscore-${this.ecoScoreGrade}.svg`)
    return img
  }

  get nutriScoreImg () {
    const img = document.createElement('img')
    img.classList.add('driveoff_nutriscore')
    img.width = 240
    img.height = 130
    img.src = chrome.runtime.getURL(`img/nutriscore-${this.nutriScoreGrade}.svg`)
    return img
  }

  completeCard () {
    if (!this.ean) return false
    const el = this._el

    if (el.mainDescription) {
      el.scores = el.mainDescription.querySelector('.driveoff_scores')
      if (!el.scores) {
        el.scores = document.createElement('div')
        el.scores.classList.add('driveoff_scores')
        if (el.mainDescription) {
          el.mainDescription.appendChild(el.scores)
        }
      }
    }

    if (el.scores) {
      el.scores.innerHTML = ''

      const nutriscore = this.nutriScoreImg
      nutriscore.alt = `Nutri Score: ${this.nutriScoreGrade.toUpperCase()} ${this.nutriscore_score ? `(${Number(this.nutriscore_score)} pts)` : ''}`
      el.scores.appendChild(nutriscore)

      const novascore = this.novaImg
      novascore.alt = `Nova : ${this.novaGrade}`
      el.scores.appendChild(novascore)

      const ecoscore = this.ecoScoreImg
      ecoscore.alt = `Eco Score : ${this.ecoScoreGrade.toUpperCase()} ${this.ecoscore_score ? `(${Number(this.ecoscore_score).toFixed(2)} pts)` : ''}`
      el.scores.appendChild(ecoscore)

      el.scores.title = [nutriscore.alt, novascore.alt, ecoscore.alt].join('\n')
    }
  }
}
