const POINTS_PER_MEDAL = {
  gold: 5,
  silver: 2,
  bronze: 1,
}

function computePoints(country) {
  const { gold, silver, bronze } = country.medals
  return gold * POINTS_PER_MEDAL.gold +
    silver * POINTS_PER_MEDAL.silver +
    bronze * POINTS_PER_MEDAL.bronze
}

async function main() {
  const response = await fetch('https://api.olympics.kevle.xyz/medals')
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  const countries = (await response.json()).results
  countries.forEach(country => {
    country.points = computePoints(country)
  })

  const sortedCountries = countries.sort((c1, c2) => c2.points - c1.points)

  const table = document.querySelector('table')
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

main()
