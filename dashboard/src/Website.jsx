import { useEffect, useRef, useState } from 'react'
import alertIcon from './assets/icon-alert.svg'
import bloomIcon from './assets/icon-bloom.svg'
import yogurtBowlImg from './assets/yogurt-bowl.webp'
import './Website.css'

const analyticsStats = [
  { label: 'Items Stored This Week', value: 1284, detail: '↑ 146 compared to last week' },
  { label: 'Food Categories Tracked', value: 6, detail: '↑ Updated from daily intake logs' },
  { label: 'Urgent Expiry Items', value: 10, detail: '↑ Needs review within 10 days' },
]

const inventoryCategories = [
  { category: 'Non Perishable Foods', amount: '410 items', share: '32%' },
  { category: 'Fresh Produce', amount: '235 items', share: '18%' },
  { category: 'Dairy and Eggs', amount: '164 items', share: '13%' },
  { category: 'Frozen Meals', amount: '148 items', share: '12%' },
  { category: 'Protein and Canned Beans', amount: '207 items', share: '16%' },
  { category: 'Baby and Snack Items', amount: '120 items', share: '9%' },
]

const expiringFoods = [
  { name: 'Spinach', expiresInDays: 1 },
  { name: 'Milk cartons', expiresInDays: 2 },
  { name: 'Yogurt cups', expiresInDays: 3 },
  { name: 'Strawberries', expiresInDays: 4 },
  { name: 'Cooked rice packs', expiresInDays: 5 },
  { name: 'Chicken broth', expiresInDays: 6 },
  { name: 'Soft tortillas', expiresInDays: 7 },
  { name: 'Cheddar blocks', expiresInDays: 8 },
  { name: 'Carrot bags', expiresInDays: 9 },
  { name: 'Hummus tubs', expiresInDays: 10 },
]

const recipes = [
  {
    id: 'smoothie',
    title: 'Berry Yogurt Smoothie Cups',
    time: '15 min',
    tag: 'Quick Use',
    summary: 'A fast breakfast snack that clears out dairy and fruit close to expiry.',
    expiringIngredients: [
      { name: 'Yogurt cups', stock: '18 in stock', status: 'Expiring in 3 days' },
      { name: 'Strawberries', stock: '9 cartons in stock', status: 'Expiring in 4 days' },
      { name: 'Milk cartons', stock: '6 in stock', status: 'Expiring in 2 days' },
    ],
    pantryIngredients: ['Honey', 'Bananas', 'Granola'],
    periodAdjustments: {
      add: ['Add chia seeds for extra magnesium.', 'Add extra yogurt or milk for more calcium.'],
      subtract: ['Reduce added honey if sugar sensitivity is an issue.'],
    },
    instructions: [
      'Wash and slice the strawberries, then blend with yogurt and a small amount of milk.',
      'Add honey if needed and portion the smoothie into cups.',
      'Top with granola right before serving so it stays crisp.',
    ],
    recommended: ['Fruit and Yogurt Cups', 'Strawberry Oat Parfaits'],
  },
  {
    id: 'wraps',
    title: 'Spinach Cheddar Breakfast Wraps',
    time: '20 min',
    tag: 'Hot Meal',
    summary: 'A simple wrap recipe built around greens, dairy, and tortillas that should be used soon.',
    expiringIngredients: [
      { name: 'Spinach', stock: '4 bags in stock', status: 'Expiring in 1 day' },
      { name: 'Soft tortillas', stock: '22 in stock', status: 'Expiring in 7 days' },
      { name: 'Cheddar blocks', stock: '5 blocks in stock', status: 'Expiring in 8 days' },
    ],
    pantryIngredients: ['Eggs', 'Salt', 'Pepper'],
    periodAdjustments: {
      add: ['Add extra cheddar or a spoon of Greek yogurt for calcium.', 'Add spinach generously for iron support.'],
      subtract: ['Reduce salt if bloating is a concern.'],
    },
    instructions: [
      'Saute the spinach for 2 to 3 minutes until wilted.',
      'Scramble eggs in a separate pan, then mix in shredded cheddar.',
      'Fill each tortilla with the egg mixture and spinach, then fold and warm before serving.',
    ],
    recommended: ['Spinach Quesadillas', 'Cheddar Veggie Melts'],
  },
  {
    id: 'soup',
    title: 'Carrot Broth Soup',
    time: '30 min',
    tag: 'Batch Cook',
    summary: 'A warming soup that helps use vegetables and broth before they need to be discarded.',
    expiringIngredients: [
      { name: 'Carrot bags', stock: '7 bags in stock', status: 'Expiring in 9 days' },
      { name: 'Chicken broth', stock: '11 cartons in stock', status: 'Expiring in 6 days' },
      { name: 'Hummus tubs', stock: '8 tubs in stock', status: 'Expiring in 10 days' },
    ],
    pantryIngredients: ['Onions', 'Garlic', 'Cumin'],
    periodAdjustments: {
      add: ['Add lentils or beans for extra iron.', 'Add a spoon of yogurt on top for calcium if available.'],
      subtract: ['Reduce heavy seasoning if a lighter meal is preferred.'],
    },
    instructions: [
      'Cook chopped onions and garlic until soft, then add sliced carrots.',
      'Pour in the chicken broth and simmer until the carrots are tender.',
      'Blend until smooth and serve with a spoon of hummus swirled in for extra richness.',
    ],
    recommended: ['Roasted Carrot Mash', 'Vegetable and Broth Rice Bowl'],
  },
]

function useInView() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const currentRef = ref.current

    if (!currentRef) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.35 }
    )

    observer.observe(currentRef)

    return () => observer.disconnect()
  }, [])

  return [ref, isInView]
}

function useCountUp(target, shouldAnimate, duration = 1100) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldAnimate) {
      return undefined
    }

    let animationFrameId
    let startTimestamp

    const step = (timestamp) => {
      if (startTimestamp === undefined) {
        startTimestamp = timestamp
      }

      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.round(target * progress))

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    animationFrameId = window.requestAnimationFrame(step)

    return () => window.cancelAnimationFrame(animationFrameId)
  }, [duration, shouldAnimate, target])

  return count
}

function formatStatValue(value) {
  return value.toLocaleString()
}

function formatExpiry(expiresInDays) {
  if (expiresInDays <= 5) {
    return `${expiresInDays} day${expiresInDays === 1 ? '' : 's'} left`
  }

  const expiryDate = new Date()
  expiryDate.setHours(0, 0, 0, 0)
  expiryDate.setDate(expiryDate.getDate() + expiresInDays)

  const month = String(expiryDate.getMonth() + 1).padStart(2, '0')
  const day = String(expiryDate.getDate()).padStart(2, '0')
  const year = expiryDate.getFullYear()

  return `${month}/${day}/${year}`
}

function Website() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [weeklySummary, setWeeklySummary] = useState([
    'Need to buy bananas.',
    'Non perishable foods remain the largest category in storage.',
    'Dairy and produce should be prioritized for meal prep this week.',
  ])
  const [editingSummaryIndex, setEditingSummaryIndex] = useState(null)
  const [draftPoint, setDraftPoint] = useState('')
  const [recipeMode, setRecipeMode] = useState('normal')
  const [heroRef, heroInView] = useInView()
  const [statsRef, statsInView] = useInView()
  const topInventoryCategories = inventoryCategories.slice(0, 4)
  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0]
  const alternateRecipes = recipes.filter((recipe) => recipe.id !== recipes[0].id)
  const analyticsVisible = activeTab === 'analytics' && statsInView
  const heroVisible = activeTab === 'analytics' && heroInView
  const ringProgress = useCountUp(78, heroVisible, 1200)
  const storedItemsCount = useCountUp(analyticsStats[0].value, analyticsVisible, 1000)
  const categoryCount = useCountUp(analyticsStats[1].value, analyticsVisible, 1000)
  const urgentExpiryCount = useCountUp(analyticsStats[2].value, analyticsVisible, 1000)
  const animatedStats = [storedItemsCount, categoryCount, urgentExpiryCount]

  const openRecipe = (recipeId) => {
    setSelectedRecipeId(recipeId)
    setRecipeMode('normal')
  }

  const closeRecipe = () => {
    setSelectedRecipeId('')
  }

  const updateWeeklySummary = (index, value) => {
    setWeeklySummary((currentSummary) =>
      currentSummary.map((item, itemIndex) =>
        itemIndex === index ? value : item
      )
    )
  }

  const deleteWeeklySummary = (index) => {
    setWeeklySummary((currentSummary) =>
      currentSummary.filter((_, itemIndex) => itemIndex !== index)
    )
    setEditingSummaryIndex((currentIndex) =>
      currentIndex === index ? null : currentIndex
    )
  }

  const addWeeklySummary = () => {
    const trimmedPoint = draftPoint.trim()

    if (!trimmedPoint) {
      return
    }

    setWeeklySummary((currentSummary) => [...currentSummary, trimmedPoint])
    setDraftPoint('')
  }

  return (
    <main className="website-shell">
      <section className="website-hero" ref={heroRef}>
        <div className="hero-title-block">
          <p className="eyebrow hero-support-title">
            Food Inventory Organizer To Keep Track Of All Goods
          </p>
          <div className="hero-title-row">
            <h1>Bloom Pantry</h1>
            <img className="hero-title-icon" src={bloomIcon} alt="" />
          </div>
        </div>
        <div className="hero-ring-wrap" aria-label="Inventory growth this week">
          <div
            className="inventory-ring"
            style={{ '--ring-progress': `${ringProgress}%` }}
          >
            <div className="inventory-ring-inner">
              <span className="ring-kicker">Inventory up</span>
              <strong>14%</strong>
              <p>vs last week</p>
            </div>
          </div>
          <p className="ring-caption">
            1,284 total food items stored this week, up from 1,138 last week.
          </p>
        </div>
      </section>

      <section className="tab-panel">
        <div className="tab-switcher" role="tablist" aria-label="Dashboard tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'recipes'}
            className={activeTab === 'recipes' ? 'active' : ''}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
        </div>

        {activeTab === 'analytics' ? (
          <section className="analytics-grid">
            <div className="stats-row" ref={statsRef}>
              {analyticsStats.map((stat, index) => (
                <article key={stat.label} className="stat-card">
                  <p>{stat.label}</p>
                  <h2>{formatStatValue(animatedStats[index])}</h2>
                  <span>{stat.detail}</span>
                </article>
              ))}
            </div>

            <div className="analytics-columns">
              <article className="chart-card">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Stored Inventory</p>
                    <h2>Food categories this week</h2>
                  </div>
                  <span className="pill">Current stock</span>
                </div>

                <div className="category-list">
                  {topInventoryCategories.map((item) => (
                    <div key={item.category} className="category-row">
                      <div>
                        <h3>{item.category}</h3>
                        <p>{item.amount}</p>
                      </div>
                      <span className="category-share">{item.share}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="detail-card">
                <div className="section-heading">
                  <div className="expiry-heading-row">
                    <div>
                      <p className="eyebrow">Expiring Soon</p>
                      <h2>Top 10 foods to use first</h2>
                    </div>
                    <img className="expiry-heading-icon" src={alertIcon} alt="" />
                  </div>
                </div>

                <ol className="expiry-list">
                  {expiringFoods.map((food) => (
                    <li key={food.name}>
                      <span>{food.name}</span>
                      <strong>{formatExpiry(food.expiresInDays)}</strong>
                    </li>
                  ))}
                </ol>
              </article>
            </div>

            <article className="summary-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Weekly Summary</p>
                  <h2>Inventory notes</h2>
                </div>
              </div>

              <ul className="highlight-list">
                {weeklySummary.map((item, index) => (
                  <li key={`summary-${index}`}>
                    <div className="summary-item">
                      {editingSummaryIndex === index ? (
                        <textarea
                          className="summary-input"
                          value={item}
                          onChange={(event) =>
                            updateWeeklySummary(index, event.target.value)
                          }
                          rows={2}
                        />
                      ) : (
                        <p className="summary-text">{item}</p>
                      )}

                      <div className="summary-actions">
                        <button
                          type="button"
                          className="summary-action-button"
                          onClick={() =>
                            setEditingSummaryIndex(
                              editingSummaryIndex === index ? null : index
                            )
                          }
                        >
                          {editingSummaryIndex === index ? 'Done' : 'Edit'}
                        </button>
                        <button
                          type="button"
                          className="summary-action-button delete"
                          onClick={() => deleteWeeklySummary(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="summary-add-row">
                <textarea
                  className="summary-add-input"
                  value={draftPoint}
                  onChange={(event) => setDraftPoint(event.target.value)}
                  placeholder="Add a point here"
                  rows={2}
                />
                <button
                  type="button"
                  className="summary-add-button"
                  onClick={addWeeklySummary}
                >
                  Add Point
                </button>
              </div>
            </article>
          </section>
        ) : (
          <section className="recipes-grid">
            <button
              type="button"
              className="feature-recipe"
              onClick={() => openRecipe(recipes[0].id)}
            >
              <div className="feature-recipe-content">
                <div className="feature-recipe-copy">
                  <p className="eyebrow">Featured Recipe</p>
                  <h2>{recipes[0].title}</h2>
                  <p>{recipes[0].summary}</p>
                  <div className="recipe-meta">
                    <span className="recipe-time">Prep: 10 min</span>
                    <span className="recipe-time">Cook: {recipes[0].time}</span>
                    <span className="recipe-time">Serves: 8</span>
                  </div>
                </div>

                <div className="featured-recipe-art" aria-hidden="true">
                  <div className="yogurt-spot"></div>
                  <img
                    className="featured-recipe-image"
                    src={yogurtBowlImg}
                    alt=""
                  />
                </div>
              </div>

              <div className="feature-recipe-actions">
                <span className="pill">Quick Use</span>
                <span className="pill">Uses 3 expiring items</span>
              </div>
              <button
                type="button"
                className="recipe-open-button"
                onClick={(event) => {
                  event.stopPropagation()
                  openRecipe(recipes[0].id)
                }}
              >
                View recipe details
              </button>
            </button>

            <div className="recipe-card-row">
              {alternateRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  className="recipe-card"
                  onClick={() => openRecipe(recipe.id)}
                >
                  <div className="recipe-card-top">
                    <span className="pill">{recipe.tag}</span>
                    <span className="recipe-time">{recipe.time}</span>
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.summary}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedRecipeId ? (
          <div className="recipe-modal-backdrop" onClick={closeRecipe}>
            <article
              className="recipe-details-card"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="recipe-modal-header">
                <div>
                  <p className="eyebrow">Use These First</p>
                  <h2>{selectedRecipe.title}</h2>
                </div>
                <div className="recipe-mode-switch" role="tablist" aria-label="Recipe mode">
                  <button
                    type="button"
                    className={recipeMode === 'normal' ? 'active' : ''}
                    onClick={() => setRecipeMode('normal')}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    className={recipeMode === 'period' ? 'active' : ''}
                    onClick={() => setRecipeMode('period')}
                  >
                    On period
                  </button>
                </div>
                <button
                  type="button"
                  className="recipe-close-button"
                  onClick={closeRecipe}
                >
                  Close
                </button>
              </div>

              <div className="ingredient-list">
                {selectedRecipe.expiringIngredients.map((ingredient) => (
                  <div key={ingredient.name} className="ingredient-row">
                    <div>
                      <h3>{ingredient.name}</h3>
                      <p className="ingredient-status">{ingredient.status}</p>
                    </div>
                    <div className="ingredient-stock">
                      <span>In stock</span>
                      <strong>{ingredient.stock}</strong>
                      <div className="stock-bar">
                        <div className="stock-bar-fill" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="recipe-instructions">
                <div className="instruction-panel">
                  <p className="eyebrow">Instructions</p>
                  <ol className="instruction-list">
                    {selectedRecipe.instructions.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="instruction-panel">
                  <p className="eyebrow">Ingredients Needed</p>
                  <ul className="recommended-list">
                    {selectedRecipe.pantryIngredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  {recipeMode === 'period' ? (
                    <div className="period-guidance">
                      <p className="eyebrow">Period Support</p>
                      <ul className="period-list">
                        {selectedRecipe.periodAdjustments.add.map((item) => (
                          <li key={`period-add-${item}`}>{item}</li>
                        ))}
                        {selectedRecipe.periodAdjustments.subtract.map((item) => (
                          <li key={`period-subtract-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default Website
