import { useEffect, useRef, useState } from 'react'
import alertIcon from './assets/icon-alert.svg'
import bloomIcon from './assets/icon-bloom.svg'
import friedRiceImg from './assets/cartoon-delicious-egg-fried-rice-illustration_561641-28564.png'
import pastaImg from './assets/pasta-with-basil-leaves-in-a-bowl-illustration-vector.png'
import sandwichImg from './assets/sandwich-drawings-10.png'
import soupImg from './assets/soup.png'
import tacoImg from './assets/taco.png'
import yogurtBowlImg from './assets/yogurt-bowl.webp'
import './Website.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const recipes = [
  {
    id: 'smoothie',
    title: 'Berry Yogurt Smoothie Cups',
    time: '15 min',
    tag: 'Quick Use',
    image: yogurtBowlImg,
    summary: 'A fast breakfast snack that clears out dairy and fruit close to expiry.',
    expiringIngredients: [
      { name: 'Yogurt cups', stock: '18 in stock', status: 'Expiring in 3 days' },
      { name: 'Strawberries', stock: '9 cartons in stock', status: 'Expiring in 4 days' },
      { name: 'Milk cartons', stock: '6 in stock', status: 'Expiring in 2 days' },
    ],
    pantryIngredients: ['Honey', 'Bananas', 'Granola'],
    cookware: ['Blender', 'Knife', 'Cutting board', 'Serving cups'],
    periodAdjustments: {
      add: ['Add chia seeds for extra magnesium.', 'Add extra yogurt or milk for more calcium.'],
      subtract: ['Reduce added honey if sugar sensitivity is an issue.'],
    },
    instructions: [
      'Using a knife and cutting board, wash and slice the strawberries, then add them to a blender with yogurt and a small amount of milk.',
      'Blend until smooth, add honey if needed, and portion the smoothie into serving cups.',
      'Top with granola right before serving so it stays crisp.',
    ],
    recommended: ['Fruit and Yogurt Cups', 'Strawberry Oat Parfaits'],
  },
  {
    id: 'wraps',
    title: 'Spinach Cheddar Breakfast Wraps',
    time: '20 min',
    tag: 'Hot Meal',
    image: sandwichImg,
    summary: 'A simple wrap recipe built around greens, dairy, and tortillas that should be used soon.',
    expiringIngredients: [
      { name: 'Spinach', stock: '4 bags in stock', status: 'Expiring in 1 day' },
      { name: 'Soft tortillas', stock: '22 in stock', status: 'Expiring in 7 days' },
      { name: 'Cheddar blocks', stock: '5 blocks in stock', status: 'Expiring in 8 days' },
    ],
    pantryIngredients: ['Eggs', 'Salt', 'Pepper'],
    cookware: ['Saute pan', 'Mixing bowl', 'Spatula'],
    periodAdjustments: {
      add: ['Add extra cheddar or a spoon of Greek yogurt for calcium.', 'Add spinach generously for iron support.'],
      subtract: ['Reduce salt if bloating is a concern.'],
    },
    instructions: [
      'Heat a saute pan and cook the spinach for 2 to 3 minutes until wilted.',
      'In a mixing bowl, whisk the eggs, then scramble them in the pan and mix in shredded cheddar with a spatula.',
      'Fill each tortilla with the egg mixture and spinach, then fold and warm in the pan before serving.',
    ],
    recommended: ['Spinach Quesadillas', 'Cheddar Veggie Melts'],
  },
  {
    id: 'soup',
    title: 'Carrot Broth Soup',
    time: '30 min',
    tag: 'Batch Cook',
    image: soupImg,
    summary: 'A warming soup that helps use vegetables and broth before they need to be discarded.',
    expiringIngredients: [
      { name: 'Carrot bags', stock: '7 bags in stock', status: 'Expiring in 9 days' },
      { name: 'Chicken broth', stock: '11 cartons in stock', status: 'Expiring in 6 days' },
      { name: 'Hummus tubs', stock: '8 tubs in stock', status: 'Expiring in 10 days' },
    ],
    pantryIngredients: ['Onions', 'Garlic', 'Cumin'],
    cookware: ['Soup pot', 'Knife', 'Cutting board', 'Blender or immersion blender'],
    periodAdjustments: {
      add: ['Add lentils or beans for extra iron.', 'Add a spoon of yogurt on top for calcium if available.'],
      subtract: ['Reduce heavy seasoning if a lighter meal is preferred.'],
    },
    instructions: [
      'Using a knife and cutting board, chop the onions, garlic, and carrots, then cook them in a soup pot until softened.',
      'Pour in the chicken broth and simmer in the pot until the carrots are tender.',
      'Blend with a blender or immersion blender until smooth, then serve with a spoon of hummus swirled in for extra richness.',
    ],
    recommended: ['Roasted Carrot Mash', 'Vegetable and Broth Rice Bowl'],
  },
  {
    id: 'pasta',
    title: 'Tomato Basil Pasta Bowl',
    time: '25 min',
    tag: 'Comfort',
    image: pastaImg,
    summary: 'A warm pasta recipe that uses pantry staples and softer produce before expiry.',
    expiringIngredients: [
      { name: 'Tomatoes', stock: '10 in stock', status: 'Expiring in 4 days' },
      { name: 'Milk cartons', stock: '4 in stock', status: 'Expiring in 2 days' },
      { name: 'Cheddar blocks', stock: '3 blocks in stock', status: 'Expiring in 8 days' },
    ],
    pantryIngredients: ['Pasta', 'Garlic', 'Olive oil'],
    cookware: ['Pot', 'Pan', 'Colander', 'Wooden spoon'],
    periodAdjustments: {
      add: ['Add spinach or kale for extra iron.', 'Add cheese or milk for more calcium.'],
      subtract: ['Reduce spicy seasoning if a milder meal is preferred.'],
    },
    instructions: [
      'Boil the pasta in a pot until tender, then drain with a colander.',
      'Use a pan to cook tomatoes and garlic until soft, then stir in a small amount of milk and shredded cheese.',
      'Toss the pasta into the pan and stir with a wooden spoon before serving.',
    ],
    recommended: ['Creamy Tomato Cups', 'Basil Pasta Bake'],
  },
  {
    id: 'tacos',
    title: 'Bean Veggie Taco Boats',
    time: '18 min',
    tag: 'Fast Meal',
    image: tacoImg,
    summary: 'A quick taco meal that uses tortillas, beans, and vegetables that need to be rotated out.',
    expiringIngredients: [
      { name: 'Soft tortillas', stock: '12 in stock', status: 'Expiring in 7 days' },
      { name: 'Spinach', stock: '2 bags in stock', status: 'Expiring in 1 day' },
      { name: 'Cheddar blocks', stock: '2 blocks in stock', status: 'Expiring in 8 days' },
    ],
    pantryIngredients: ['Beans', 'Corn', 'Mild salsa'],
    cookware: ['Pan', 'Spatula', 'Knife'],
    periodAdjustments: {
      add: ['Add beans for iron and extra protein.', 'Add cheese for calcium support.'],
      subtract: ['Reduce salty toppings if needed.'],
    },
    instructions: [
      'Warm the tortillas in a pan until soft.',
      'Heat beans, corn, and chopped spinach in the same pan using a spatula.',
      'Fill each tortilla with the mixture and top with cheese before serving.',
    ],
    recommended: ['Bean Melt Wraps', 'Veggie Taco Cups'],
  },
  {
    id: 'rice-bowl',
    title: 'Vegetable Fried Rice Bowl',
    time: '22 min',
    tag: 'Pantry',
    image: friedRiceImg,
    summary: 'A flexible rice bowl that helps use broth, vegetables, and leftover rice quickly.',
    expiringIngredients: [
      { name: 'Cooked rice packs', stock: '6 in stock', status: 'Expiring in 5 days' },
      { name: 'Carrot bags', stock: '4 bags in stock', status: 'Expiring in 9 days' },
      { name: 'Chicken broth', stock: '5 cartons in stock', status: 'Expiring in 6 days' },
    ],
    pantryIngredients: ['Eggs', 'Soy sauce', 'Green onions'],
    cookware: ['Wok or pan', 'Spatula', 'Knife'],
    periodAdjustments: {
      add: ['Add an egg for protein and iron support.', 'Add extra greens if available.'],
      subtract: ['Reduce soy sauce if sodium needs to stay lower.'],
    },
    instructions: [
      'Dice the vegetables with a knife and heat them in a wok or pan.',
      'Add the rice and a splash of broth, then stir with a spatula until heated through.',
      'Mix in egg and green onions at the end, then season lightly with soy sauce.',
    ],
    recommended: ['Veggie Rice Cups', 'Broth Rice Stir Fry'],
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

function getExpiryUrgencyClass(expiresInDays) {
  if (expiresInDays === 1) {
    return 'expiry-critical'
  }

  if (expiresInDays === 2 || expiresInDays === 3) {
    return 'expiry-warning'
  }

  return ''
}

function Website() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [analyticsStats, setAnalyticsStats] = useState([
    { label: 'Items Stored', value: 0, detail: 'Loading...' },
    { label: 'Food Categories Tracked', value: 0, detail: 'Loading...' },
    { label: 'Urgent Expiry Items', value: 0, detail: 'Loading...' },
  ])
  const [inventoryCategories, setInventoryCategories] = useState([])
  const [expiringFoods, setExpiringFoods] = useState([])
  const [weeklySummary, setWeeklySummary] = useState([
    'Need to buy bananas.',
    'Non perishable foods remain the largest category in storage.',
    'Dairy and produce should be prioritized for meal prep this week.',
  ])
  const [editingSummaryIndex, setEditingSummaryIndex] = useState(null)
  const [draftPoint, setDraftPoint] = useState('')
  const [recipeMode, setRecipeMode] = useState('normal')
  const [apiError, setApiError] = useState('')
  const [heroRef, heroInView] = useInView()
  const [statsRef, statsInView] = useInView()
  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedRecipeId) ?? activeRecipes[0]
  const featuredRecipe = activeRecipes[0]
  const alternateRecipes = activeRecipes.slice(1)
  const analyticsVisible = activeTab === 'analytics' && statsInView
  const heroVisible = activeTab === 'analytics' && heroInView
  const ringProgress = useCountUp(78, heroVisible, 1200)
  const storedItemsCount = useCountUp(analyticsStats[0].value, analyticsVisible, 1000)
  const categoryCount = useCountUp(analyticsStats[1].value, analyticsVisible, 1000)
  const urgentExpiryCount = useCountUp(analyticsStats[2].value, analyticsVisible, 1000)
  const animatedStats = [storedItemsCount, categoryCount, urgentExpiryCount]
  const topInventoryCategories = inventoryCategories.slice(0, 4)

  useEffect(() => {
    const daysUntil = (dateStr) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const expiry = new Date(dateStr)
      if (Number.isNaN(expiry.getTime())) return Number.MAX_SAFE_INTEGER

      expiry.setHours(0, 0, 0, 0)
      return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    }

    const fetchJson = async (path) => {
      const response = await fetch(`${API_BASE}${path}`)

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      return response.json()
    }

    const loadDashboard = async () => {
      try {
        setApiError('')
        const [analyticsData, itemsData] = await Promise.all([
          fetchJson('/analytics'),
          fetchJson('/items'),
        ])

        const items = Array.isArray(itemsData) ? itemsData : []
        const totalItems = analyticsData?.totalItems ?? items.length ?? 0
        const urgentIn7Days = analyticsData?.expiringIn7Days ?? 0
        const categoryBreakdown = analyticsData?.categoryBreakdown ?? []

        const categories = categoryBreakdown.map(({ category, count }) => ({
          category: category || 'Uncategorized',
          amount: `${count ?? 0} items`,
          share: totalItems ? `${Math.round(((count ?? 0) / totalItems) * 100)}%` : '—',
        }))

        const expiringList = items
          .map((item) => ({
            name: item.foodName ?? 'Unknown item',
            expiresInDays: daysUntil(item.expiryDate),
          }))
          .filter((item) => item.expiresInDays >= 0)
          .sort((a, b) => a.expiresInDays - b.expiresInDays)
          .slice(0, 10)

        setAnalyticsStats([
          {
            label: 'Items Stored',
            value: totalItems,
            detail: `Updated from ${items.length} records`,
          },
          {
            label: 'Food Categories Tracked',
            value: categories.length,
            detail: 'Live from DynamoDB',
          },
          {
            label: 'Urgent Expiry Items',
            value: urgentIn7Days || expiringList.length,
            detail: 'Expiring within 7 days',
          },
        ])
        setInventoryCategories(categories)
        setExpiringFoods(expiringList)
      } catch (error) {
        setApiError(error.message || 'Failed to load dashboard data')
      }
    }

    loadDashboard()
  }, [])

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

  const removeExpiringFood = (foodName) => {
    setRemovingFoodName(foodName)

    window.setTimeout(() => {
      setExpiringList((currentFoods) =>
        currentFoods.filter((food) => food.name !== foodName)
      )
      setRemovingFoodName('')
    }, 220)
  }

  const completeRecipe = (recipeId) => {
    setSelectedRecipeId((currentSelected) =>
      currentSelected === recipeId ? '' : currentSelected
    )

    setActiveRecipeIds((currentIds) => {
      const recipeIndex = currentIds.indexOf(recipeId)

      if (recipeIndex === -1) {
        return currentIds
      }

      let nextRecipeId = ''

      setAvailableRecipeIds((currentAvailable) => {
        nextRecipeId = currentAvailable[0] ?? ''
        return nextRecipeId ? currentAvailable.slice(1) : currentAvailable
      })

      const remainingIds = currentIds.filter((id) => id !== recipeId)

      if (!nextRecipeId) {
        return remainingIds
      }

      return [...remainingIds, nextRecipeId]
    })
  }

  return (
    <main className="website-shell">
      {apiError ? (
        <div className="error-banner">
          <p>Could not load data from the API: {apiError}</p>
        </div>
      ) : null}
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

            <article className="chart-card inventory-bar-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Stored Inventory</p>
                  <h2>Food categories this week</h2>
                </div>
                <span className="pill">Current stock</span>
              </div>

              <div className="inventory-bar-chart" aria-label="Food category bar graph">
                <div className="inventory-y-axis" aria-hidden="true">
                  <span>35%</span>
                  <span>25%</span>
                  <span>15%</span>
                  <span>5%</span>
                  <span>0%</span>
                </div>

                {inventoryCategories.map((item) => (
                  <div key={item.category} className="inventory-bar-group">
                    <span className="inventory-bar-value">{item.amount}</span>
                    <div className="inventory-bar-track">
                      <div
                        className="inventory-bar-fill"
                        style={{ height: item.share }}
                      />
                    </div>
                    <p className="inventory-bar-label">{item.category}</p>
                    <span className="inventory-bar-share">{item.share}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="analytics-columns">
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
                  {expiringList.map((food) => (
                    <li
                      key={food.name}
                      className={removingFoodName === food.name ? 'is-removing' : ''}
                    >
                      <span>{food.name}</span>
                      <div className="expiry-item-actions">
                        <strong className={getExpiryUrgencyClass(food.expiresInDays)}>
                          {formatExpiry(food.expiresInDays)}
                        </strong>
                        <button
                          type="button"
                          className="expiry-check-button"
                          onClick={() => removeExpiringFood(food.name)}
                          aria-label={`Mark ${food.name} as handled`}
                        >
                          ✓
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>

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
            </div>
          </section>
        ) : (
          <section className="recipes-grid">
            <article
              className="feature-recipe"
              role="button"
              tabIndex={0}
              onClick={() => openRecipe(featuredRecipe.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openRecipe(featuredRecipe.id)
                }
              }}
            >
              <button
                type="button"
                className="recipe-complete-button"
                onClick={(event) => {
                  event.stopPropagation()
                  completeRecipe(featuredRecipe.id)
                }}
                aria-label={`Mark ${featuredRecipe.title} as completed`}
              >
                ✓
              </button>

              <div className="feature-recipe-content">
                <div className="feature-recipe-copy">
                  <p className="eyebrow">Featured Recipe</p>
                  <h2>{featuredRecipe.title}</h2>
                  <p>{featuredRecipe.summary}</p>
                </div>

                <div className="featured-recipe-art" aria-hidden="true">
                  <div className="yogurt-spot"></div>
                  <img
                    className="featured-recipe-image"
                    src={featuredRecipe.image ?? yogurtBowlImg}
                    alt=""
                  />
                </div>
              </div>

              <div className="feature-recipe-actions">
                <span className="pill">{featuredRecipe.tag}</span>
                <span className="pill">
                  Uses {featuredRecipe.expiringIngredients.length} expiring items
                </span>
              </div>
              <div className="recipe-footer-meta">
                <span className="recipe-time">Prep: 10 min</span>
                <span className="recipe-time">Cook: {featuredRecipe.time}</span>
                <span className="recipe-time">Serves: 8</span>
              </div>
              <button
                type="button"
                className="recipe-open-button"
                onClick={(event) => {
                  event.stopPropagation()
                  openRecipe(featuredRecipe.id)
                }}
              >
                View recipe details
              </button>
            </article>

            <div className="recipe-card-row">
              {alternateRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  className="recipe-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => openRecipe(recipe.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openRecipe(recipe.id)
                    }
                  }}
                >
                  <button
                    type="button"
                    className="recipe-complete-button"
                    onClick={(event) => {
                      event.stopPropagation()
                      completeRecipe(recipe.id)
                    }}
                    aria-label={`Mark ${recipe.title} as completed`}
                  >
                    ✓
                  </button>
                  <div className="recipe-card-top">
                    <span className="pill">{recipe.tag}</span>
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.summary}</p>
                  <div className="recipe-footer-meta">
                    <span className="recipe-time">{recipe.time}</span>
                  </div>
                </article>
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

                <div className="instruction-panel">
                  <p className="eyebrow">Ingredients Needed</p>
                  <ul className="recommended-list">
                    {selectedRecipe.pantryIngredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className="eyebrow cookware-heading">Utensils and Cookware</p>
                  <ul className="recommended-list">
                    {selectedRecipe.cookware.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
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
