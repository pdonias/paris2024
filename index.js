const POINTS_PER_MEDAL = {}
let COUNTRIES

function computePoints(country) {
  const { gold, silver, bronze } = country.medals
  return gold * POINTS_PER_MEDAL.gold +
    silver * POINTS_PER_MEDAL.silver +
    bronze * POINTS_PER_MEDAL.bronze
}

async function fetchData() {
  const response = await fetch('https://api.olympics.kevle.xyz/medals')
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  const countries = (await response.json()).results

  return countries
}

async function main() {
  console.log('running')
  POINTS_PER_MEDAL.gold = +document.getElementById('gold').value
  POINTS_PER_MEDAL.silver = +document.getElementById('silver').value
  POINTS_PER_MEDAL.bronze = +document.getElementById('bronze').value

  if (Object.values(POINTS_PER_MEDAL).some(value => !Number.isInteger(value))) {
    return
  }

  COUNTRIES.forEach(country => {
    country.points = computePoints(country)
  })

  const sortedCountries = COUNTRIES.sort((c1, c2) => c2.points - c1.points)

  const table = document.querySelector('table')
  table.querySelectorAll('tr').forEach((tr, i) => {
    if (i > 0) {
      table.removeChild(tr)
    }
  })
  sortedCountries.forEach((country, i) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
<td>${i + 1}</td>
<td>${country.country.name}</td>
<td>${country.medals.gold}</td>
<td>${country.medals.silver}</td>
<td>${country.medals.bronze}</td>
<td>${country.points}</td>
`
    table.appendChild(tr)
  })
}

fetchData().then(countries => {
  COUNTRIES = countries
  main()
})

document.querySelectorAll('input').forEach(input => input.addEventListener('input', main))
