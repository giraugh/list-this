import './style.css'

const AUTO_THISSER_COST = 10
const INVEST_COST = 50
const HISTORY_PHASE_DURATION = 2000

// State
let listItems: string[] = []
let autoThissers = 0
let thisHistory: number[] = []
let investing = false

// Get elements from page
const addItemButton = document.querySelector('.add-list-item > button')! as HTMLButtonElement
const addItemField = document.querySelector('.add-list-item > input[type="text"]')! as HTMLInputElement
const itemListEl = document.querySelector('ul.list-items-list')!

const thisEconomySection = document.querySelector('section.this-economy')!
const thisCountDisplay = document.querySelector('.this-count')!
const thisProductionDisplay = document.querySelector('.this-production-rate')!

const autoThisserSection = document.querySelector('section.auto-thisser')!
const autoThisserCountDisplay = document.querySelector('.auto-thisser-count')!
const purchaseAutoThisserButton = document.querySelector('button.purchase-auto-thisser')! as HTMLButtonElement

const thisMarketSection = document.querySelector('section.this-market')!
const investButton = document.querySelector('button.invest')! as HTMLButtonElement
const investmentResultDisplay = document.querySelector('.investment-result')!

const updateDisplays = () => {
  // Enable sections?
  const count = listItems.length
  if (count > 4) thisEconomySection.classList.remove('hidden')
  if (count > 8) autoThisserSection.classList.remove('hidden')
  if (count > 50) thisMarketSection?.classList.remove('hidden')

  // Update count
  thisCountDisplay.innerHTML = String(count)

  // Enable/disable buttons
  purchaseAutoThisserButton.disabled = count < AUTO_THISSER_COST
  investButton.disabled = investing || count < INVEST_COST

  // Update display
  autoThisserCountDisplay.innerHTML = String(autoThissers)
}

/**
 * Add an item element to the list
 * @param itemName The name of the item to add
 */
const createListItem = (itemName: string) => {
  // Create and add element
  const itemEl = document.createElement('li')
  itemEl.innerHTML = itemName
  itemListEl.appendChild(itemEl)

  // Update state
  listItems = [...listItems, itemName]

  // Add to history
  thisHistory[thisHistory.length - 1] += 1

  updateDisplays()
}

const deductThisses = (amount: number) => {
  // Subtract cost
  listItems = listItems.filter((_, i) => i > amount)
  Array.from(itemListEl.children)
    .filter((_, i) => i < amount)
    .forEach(child => itemListEl.removeChild(child))
}

// You can only list "this"
addItemField.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement
  const length = target.value.length
  target.value = 'This'.slice(0, length)
  addItemButton.disabled = target.value !== 'This'
})

addItemButton.addEventListener('click', () => {
  // Create element
  const itemName = addItemField.value ?? ''
  createListItem(itemName)

  // Clear field
  addItemField.value = ''
  addItemButton.disabled = true
})

purchaseAutoThisserButton.addEventListener('click', () => {
  deductThisses(AUTO_THISSER_COST)

  // Increment count of auto-thissers
  autoThissers += 1

  updateDisplays()
})

// Use auto-thissers
setInterval(() => {
  for (let i = 0; i < autoThissers; i++) {
    createListItem('This')
  }
}, 1000)

// Keep track of history
setInterval(() => {
  thisProductionDisplay.innerHTML = String(thisHistory[thisHistory.length -1] / (HISTORY_PHASE_DURATION / 1000))
  thisHistory.push(0)
}, HISTORY_PHASE_DURATION)

investButton.addEventListener('click', () => {
  deductThisses(INVEST_COST)
  investing = true

  investButton.innerHTML = 'Invested'

  // Wait a bit before payout
  setTimeout(() => {
    investing = false
    investButton.innerHTML = 'Invest $50 THS'
    if (Math.random() < .5) {
      investmentResultDisplay.innerHTML = 'Investment succeeded'
      for (let i = 0; i < INVEST_COST; i++) {
        createListItem('This')
      } 
    } else {
      investmentResultDisplay.innerHTML = 'Investment failed :('
      deductThisses(INVEST_COST)
    }
  }, 5000)

  updateDisplays()
})
