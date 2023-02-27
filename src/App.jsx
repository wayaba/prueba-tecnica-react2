import './App.css'
import Movies from './components/Movies'
import { useMovies } from './hooks/useMovies'
import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const isInitSearch = useRef(true)

  useEffect(() => {
    if (isInitSearch.current) {
      isInitSearch.current = search === ''
      return
    }

    if (search === '') {
      setError('El valor no puede ser vacio')
      return
    }
    if (search.length < 3) {
      setError('El valor tiene que tener al menos tres letras')
      return
    }
    setError(null)
  }, [search])

  return { search, setSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)

  const { search, setSearch, error } = useSearch()
  const { movies, getMovies } = useMovies({ search, sort })

  //uso calback para que no se me renderice cada vez que se rendiza el componente
  const debounceGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search })
    }, 300),
    [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
    //const fields = Object.fromEntries(new window.FormData(event.target))
    //console.log(fields)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    if (newSearch.startsWith(' ')) return

    setSearch(newSearch)
    debounceGetMovies(newSearch)
  }

  const handleSort = () => {
    setSort(!sort)
  }

  return (
    <div className="page">
      <header>
        <h1>Buscador de películas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="search"
            onChange={handleChange}
            value={search}
            placeholder="Toy Story, Garfield, Grinch..."
          ></input>
          <input type="checkbox" onChange={handleSort} checked={sort}></input>
          <button>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        <Movies movies={movies}></Movies>
      </main>
    </div>
  )
}

export default App
