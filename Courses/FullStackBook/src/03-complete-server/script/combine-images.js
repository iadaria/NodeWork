const terms = 'abstract architecture color crowd dogs food funny luxury music nature surreal travel'.split(' ')

const images = terms.reduce(function (acc, term) {
  const termImages = require(`./images/${term}.json`)
  termImages.results.forEach(img => {if (!img.sponsored) acc[img.id] = img})
  return acc
}, {})

console.log(JSON.stringify(Object.keys(images).map(k => images[k])))
