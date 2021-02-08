# Drive configuration file

This version of DriveOFF use a system based on JS Class.

Each new drive must extends `Drive` and be added to the `drivesList` array, used by the drive detector.

## Structure

### static `name`

Human readable name of the targeted service.

### static `domain`

RegExp used to detect Drive

### static `lang`

Default language of the Drive

### static `country`

Country of the Drive

### static `structure`

object 

* *object* `productView`
  
  * *string, array* `base`: selector for the main product DOM element
  
  * *string, array* `name`: selector for the title of the product
  
  * *string, array* `mainDescription`: selector of DOM element to inject scores 
  
  * *string, array* `description`: selector of DOM element to inject extended data
  
  * *string, array, function* `ean`: selector of function to find EAN. function have `base` for first argument.

* *object* `listView`
  
  * *string, array* `base`: selector for the main product list DOM element
  
  * *object* `product`: use the `productView` structure, scoped to `listView.base`

## Exemple

```js
drivesList.push(class Fr_MonMagasin extends Drive {
  static driveName = 'Mon Magasin' 
  static domain = /monmagasin\.fr$/
  static lang = 'fr'
  static country = 'france'

  static structure = {
    productView: {
      base: 'article.produit',
      name: 'h1',
      mainDescription: '.informations-generales',
      description: '.informations',
      ean: () => /product\/([0-9]{13})/i.exec(new URL(document.URL).pathname)[1]
    },
    listView: {
      base: [
        '.catalog-produits',
        '.carousel-produits'
      ],
      product: {
        base: 'li.produit',
        name: '.name',
        mainDescription: '.informations-generales',
        ean: base => base.dataset.id
      }
    }
  }
})
```
