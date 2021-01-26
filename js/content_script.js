const manifest = chrome.runtime.getManifest()

const url = new URL('https://fr.openfoodfacts.org/cgi/search.pl')
url.searchParams.set('search_simple', 1)
url.searchParams.set('action', 'process')
url.searchParams.set('json', 1)
url.searchParams.set('appversion', manifest.version)
url.searchParams.set('appid', manifest.name)

let data_
const inListAuchan = false
let driveSite
const myContent = `<div class='detail'>
<div class='title'></div>
  <div class='nutriImg'>
    <img class='productImg' id='nutriScore'/>
    <img class='productImg' id='novaScore'/>
    <img class='productImg' id='ecoScore'/>
  </div>
  <div class='nutriTaux'>
    <ul class='driveOffUl'>
      <li class='high' id='sucres'>Sucres:</li>
      <li class='moderate' id='sels'>Sels:</li>
      <li class='low' id='graisses'>Graisses:</li>
      <li class='low' id='sgraisses'>Graisses sat.:</li>
    </ul>
    <ul class='driveOffUl'>
      <li id='sucres100g'></li>
      <li id='sels100g'></li>
      <li id='graisses100g'></li>
      <li id='sgraisses100g'></li>
    </ul>
  </div>
  <div class='nutriAdditif'>
    <ul class='driveOffUl'>
      <li class='high' id='sucres'>Sucres:</li>
      <li class='moderate' id='sels'>Sels:</li>
      <li class='low' id='graisses'>Graisses:</li>
      <li class='low' id='sgraisses'>Graisses sat.:</li>
    </ul>
    <ul class='driveOffUl'>
      <li class='high' id='sucres'>Sucres:</li>
      <li class='moderate' id='sels'>Sels:</li>
      <li class='low' id='graisses'>Graisses:</li>
      <li class='low' id='sgraisses'>Graisses sat.:</li>
    </ul>
    <ul class='driveOffUl'>
      <li class='high' id='sucres'>Sucres:</li>
      <li class='moderate' id='sels'>Sels:</li>
      <li class='low' id='graisses'>Graisses:</li>
      <li class='low' id='sgraisses'>Graisses sat.:</li>
    </ul>
  </div>
  <div class='productBarCode'>
    <img id='barcode'/>
  </div>
  <div class='detailfooter'></div>
</div>
<div class='box'>
  <div id='productList'>
    <div id='spinner'>Collecte des données auprès de Open Food Facts...</div>
  </div>
  <div class='searchBar'>
    <div class='searchIcon'></div>
    <div  class='inputSearch'>
      <input id='inputBox' type='text' value='Recherche…' />
      <div class='closeIcon'></div>
    </div>
  </div>
</div>`

const filterTitle = _title => {
  const blackListWords = ['une', 'un', 'des', 'de', 'au', 'aux', 'à', 'sur', 'de', 'd', 'l', 's', 'par']

  let productTitle = _title.replace(/x\d+/, '')
  productTitle = productTitle.replace(/<[a-zA-Z]*>/, '')
  productTitle = productTitle.replace(/\d+(l|g|cl|kg)/, '')
  productTitle = productTitle.trim().toLowerCase()
  console.log('Before splitting :' + productTitle)
  let split = productTitle.split(/[, ;.:/!?"«»)(*><]+/)
  let searchString = ''
  let i
  for (i = 0; i < split.length; i++) {
    const words = split[i].split(/['-]+/)
    let j
    for (j = 0; j < words.length; j++) {
      if (blackListWords.indexOf(words[j]) !== -1) { continue }
      if (words[j].length <= 1) { continue }
      searchString += words[j]
      searchString += ' '
    }
  }
  split = searchString.split(' ')
  searchString = ''
  if (split.length < 4) {
    for (i = 0; i < split.length; i++) {
      searchString += split[i]
      searchString += ' '
    }
  } else {
    for (i = 0; i < 4; i++) {
      searchString += split[i]
      searchString += ' '
    }
  }
  searchString = searchString.trim()
  searchString = searchString.trim()
  searchString = encodeURIComponent(searchString)
  console.log('SearchString: ' + searchString)
  const search = url + '&search_terms=' + searchString
  console.log('Search URL :' + search)
  return search
}

const snackbar = document.createElement('div')
snackbar.id = 'snackbar'
snackbar.innerHTML = myContent

const detail = snackbar.querySelector('.detail')
const inputSearch = snackbar.querySelector('.inputSearch')
const searchIcon = snackbar.querySelector('.searchIcon')
const closeIcon = snackbar.querySelector('.closeIcon')
const inputBox = snackbar.querySelector('#inputBox')
const productList = snackbar.querySelector('.productList')
const box = snackbar.querySelector('.box')

const bindEventToSnackbar = () => {
  snackbar.style.display = 'none'
  detail.style.display = 'none'
  inputSearch.style.display = 'none'

  searchIcon.addEventListener('click', event => {
    inputSearch.style.display = 'block'
  })

  closeIcon.addEventListener('click', event => {
    inputSearch.style.display = 'none'
    inputBox.value = 'Recherche…'
    inputBox.innerText = 'Recherche…'
  })

  box.addEventListener('mouseleave', event => {
    snackbar.style.display = 'none'
    inputSearch.style.display = 'none'
    inputBox.value = 'Recherche…'
    detail.style.display = 'none'
    productList.innerHTML = "<div id='spinner'>Collecte des données auprès de Open Food Facts…</div>"
    console.log('leave box')
  })

  inputBox.addEventListener('focus', event => { event.target.select() })

  inputBox.addEventListener('keypress', event => {
    if (event.which === 13) {
      // Disable textbox to prevent multiple submit
      event.target.setAttributes('disabled', 'disabled')
      productList.innerHTML = "<div id='spinner'>Recherche en cours…</div>"
      detail.style.display = 'none'
      url.searchParams.set('search_terms', event.target.value)
      console.log('Manual search', url)
      data_ = []
      fetch(url, {
        method: 'get',
        cache: 'force-cache',
        cors: 'no-cors',
        headers: new Headers({
          Accept: 'application/json'
        })
      })
        .then(result => {
          if (!result.ok) throw new Error('connection problem')
          return result.json()
        })
        .then(data => {
          console.log(data)
          data_ = data
          fillList()
        })
        .finally(() => {
          // Enable the textbox again if needed.
          event.target.removeAttribute('disabled')
        })
    }
  })
}
const bindOpenFoodIconEvent = () => {
  const openfood = document.body.querySelector('.openfood')
  openfood.addEventListener('mouseenter', event => {
    console.log('Openfood details')
    productList.value = ''
    productList.innerHTML = "<div id='spinner'>Collecte des données auprès de Open Food Facts…</div>"
    let queryURL
    switch (driveSite) {
      case 'auchandrive.fr':
      case 'auchan.fr':
        queryURL = getAuchanDriveQueryURL(event.target)
        break

      case 'leclercdrive.fr':
        queryURL = getLeclercDriveQueryURL(event.target)
        break

      case 'carrefour.fr':
        queryURL = getCarrefourQueryURL(event.target)
        break
    }

    console.log(queryURL)
    data_ = []
    fetch(queryURL, {
      method: 'get',
      headers: new Headers({
        Accept: 'application/json'
      })
    })
      .then(result => {
        if (!result.ok) throw new Error('connection problem')
        return result.json()
      })
      .then(data => {
        console.log(data)
        data_ = data
        fillList()
      })

    // Add the "show" class to DIV
    // x.className = "show";
    snackbar.style.display = 'none'
    // After 3 seconds, remove the show class from DIV
    // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
  })
}

const fillList = () => {
  productList.empty()
  if (data_.products === undefined) {
    if (data_.status === 1) {
      productList.insertAdjacentHTML('beforeend', `<div indice='0' class='product'>
        <div class='triangle'>&nbsp;</div>
        <div id='pimg_0' class='pDescription'></div>
      </div>`)

      const pimg = snackbar.querySelector('#pimg_0')
      if (data_.product.image_url === undefined) {
        pimg.style.backgroundImage = `url(${chrome.extension.getURL('/img/unknown.jpg')})`
      } else {
        pimg.style.backgroundImage = `url(${data_.product.image_url})`
      }
    } else {
      productList.innerHTML = "<div id='spinner'>La recherche n'a retourné aucun résultat</div>"
      // setTimeout(function(){ $("#snackbar").fadeOut("slow");; }, 2000);
    }
  } else {
    if (data_.products.length) {
      let i
      for (i = 0; i < data_.products.length; i++) {
        productList.insertAdjacentHTML('beforeend', `<div indice="${i}" class="product">
          <div class="triangle">&nbsp;</div>
          <div id="pimg_${i}" class="pDescription"></div>
        </div>`)

        const pimg = snackbar.querySelector('#pimg_' + i)
        if (data_.products[i].image_url === undefined) {
          pimg.style.backgroundImage = `url(${chrome.extension.getURL('/img/unknown.jpg')})`
        } else {
          pimg.style.backgroundImage = `url(${data_.products[i].image_url})`
        }
      }
    } else {
      productList.innerHTML = "<div id='spinner'>La recherche n'a retourné aucun résultat</div>"
      // setTimeout(function(){ $("#snackbar").fadeOut("slow");; }, 2000);
    }
  }

  const product = document.querySelector('.product')
  const triangle = product.target.querySelector('.triangle')
  product.addEventLIstener('mouseover', event => {
    triangle.style.backgroundColor = 'rgb(105,105,105)'
    const indice = event.target.setAttribute('indice')
    fillDetail(indice)
  })

  product.addEventLIstener('mouseenter', event => {
    detail.style.display = 'block'
  })

  product.addEventLIstener('mouseout', event => {
    triangle.style.backgroundColor = 'rgb(211, 211, 211)'
  })
}
const fillDetail = indice_ => {
  let product_
  if (data_.products === undefined) {
    product_ = data_.product
  } else {
    product_ = data_.products[indice_]
  }
  const name = product_.product_name
  const nutriScore = product_.nutrition_grade_fr
  const novaScore = product_.nova_groups

  const sugarLevel = product_.nutrient_levels.sugars
  const saturatedFatLevel = product_.nutrient_levels['saturated-fat']
  const fatLevel = product_.nutrient_levels.fat
  const saltLevel = product_.nutrient_levels.salt

  const sugar100g = Number(product_.nutriments.sugars_100g).toFixed(2)
  const salt100g = Number(product_.nutriments.salt_100g).toFixed(2)
  const fat100g = Number(product_.nutriments.fat_100g).toFixed(2)
  const saturatedFat100g = Number(product_.nutriments['saturated-fat_100g']).toFixed(2)

  const additivesArray = product_.additives_tags

  detail.querySelector('.title').innerHTML = name

  let nutriURL
  if (nutriScore === undefined) {
    nutriURL = chrome.extension.getURL('/img/unknown.jpg')
  } else {
    nutriURL = chrome.extension.getURL(`/img/nutriscore-${nutriScore}.svg`)
  }
  detail.querySelector('#nutriScore').setAttribute('src', nutriURL)

  let novaURL
  if (novaScore === undefined) {
    novaURL = chrome.extension.getURL('/img/unknown.jpg')
  } else {
    novaURL = chrome.extension.getURL(`/img/nova-group-${novaScore}.svg`)
  }
  detail.querySelector('#novaScore').setAttribute('src', novaURL)

  detail.querySelector('#sucres').setAttribute('class', sugarLevel)
  detail.querySelector('#sels').setAttribute('class', saltLevel)
  detail.querySelector('#graisses').setAttribute('class', fatLevel)
  detail.querySelector('#sgraisses').setAttribute('class', saturatedFatLevel)

  detail.querySelector('#sucres100g').innerHTML = sugar100g
  detail.querySelector('#sels100g').innerHTML = salt100g
  detail.querySelector('#graisses100g').innerHTML = fat100g
  detail.querySelector('#sgraisses100g').innerHTML = saturatedFat100g
  let string = ''

  const checkAdditivesFillIn = product_.states.search('ingredients-completed')
  if (checkAdditivesFillIn !== -1) {
    let i
    for (i = 0; i < additivesArray.length; i += 4) {
      string += "<ul class='driveOffUl'>"
      let j = i
      while (j < additivesArray.length && j < i + 4) {
        const additif = additivesArray[j].replace('en:e', 'E')
        string += "<li class='unknown'>" + additif + '</li>'
        j++
      }
      string += '</ul>'
    }
    if (!additivesArray.length) { string = "<div class='additiveInfo'>Aucun additif</div>" }
    detail.querySelector('.nutriAdditif').innerHTML = string
  } else {
    detail.querySelector('.nutriAdditif').innerHTML = "<div class='additiveInfo' >Additifs non renseignés.</div>"
  }

  JsBarcode('#barcode', product_.code, { format: 'EAN13' })
}

// Attaching extension bar to site
document.body.appendChild(snackbar)

driveSite = document.domain
driveSite = driveSite.replace(/^([a-z]|[0-9]|-)*\./, '')
console.log('drive is', driveSite)
switch (driveSite) {
  case 'auchandrive.fr':
  case 'auchan.fr':
    addingExtensionToAuchanDrive()
    addingObserverToAuchanDrive()
    break
  case 'leclercdrive.fr':
    console.log('Entering leclercdrive')
    addingExtensionToLeclerc()
    addingObserverToLeclercDrive()
    break

  case 'carrefour.fr':
    console.log('Entering carrefour drive')
    addingExtensionToCarrefour()
    addingObserverToCarrefour()

    break
}
bindEventToSnackbar()
bindOpenFoodIconEvent()
