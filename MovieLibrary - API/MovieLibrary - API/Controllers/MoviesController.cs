using Microsoft.AspNetCore.Mvc;
using MovieLibrary___API.Data;
using MovieLibrary___API.Models;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using MovieLibrary___API.Migrations;
using System.Collections;

namespace MovieLibrary___API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MoviesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("GetAllMovies")]
        public ActionResult<IEnumerable<Movie>> GetMovies()
        {
            List<Movie> movies = new List<Movie>();

            movies = _db.movies.ToList();

            return Ok(movies);
        }

        [HttpGet]
        [Route("GetMovieById/{id}")]
        public ActionResult<Movie> GetMovie(int id)
        {
            var movie = new
            {
                id = _db.movies.Find(id).Id,
                movieName = _db.movies.Find(id).MovieName,
                movieDetails = _db.movies.Find(id).MovieDetails,
                genre = _db.movies.Find(id).Genre,
                movieLength = _db.movies.Find(id).MovieLength,
                isAvailable = _db.movies.Find(id).IsAvailable,
                imagePath = _db.movies.Find(id).ImagePath,
                movieRating = _db.movies.Find(id).MovieRating,
                movieReleaseYear = _db.movies.Find(id).ReleaseYear,
                moviePrice = _db.movies.Find(id).MoviePrice
            };

            return Ok(movie);
        }

        [HttpPost]
        [Route("AddMovie")]
        public async Task<ActionResult<string>> AddMovie([FromBody] Movie movie)
        {
            if(movie== null)
            {
                return "Error";
            }
            else
            {
                var newMovie = new Movie()
                {
                    MovieName = movie.MovieName,
                    MovieDetails = movie.MovieDetails,
                    Genre = movie.Genre,
                    MovieLength = movie.MovieLength,
                    IsAvailable= movie.IsAvailable,
                    ImagePath = movie.ImagePath,
                    MovieRating = movie.MovieRating,
                    ReleaseYear = movie.ReleaseYear,
                    MoviePrice = movie.MoviePrice
                };

                _db.movies.Add(newMovie);
                await _db.SaveChangesAsync();

                return "The movie has been added";
            }
        }

        [HttpPut]
        [Route("UpdateMovie/{id}")]
        public async Task<ActionResult<string>> UpdateMovie(Movie movie, int id)
        {
            if(id != movie.Id)
            {
                return "Error";
            }

            _db.Entry(movie).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return "Movie details updated";
        }

        [HttpDelete]
        [Route("DeleteMovie/{id}")]
        public async Task<ActionResult<string>> DeleteMovie(int id)
        {
            if(id <= 0)
            {
                return "Error";
            }

            var deleteMovie = await _db.movies.FindAsync(id);

            if (deleteMovie == null)
            {
                return "Error";
            }
            else
            {
                _db.movies.Remove(deleteMovie);
                await _db.SaveChangesAsync();

                return "Movie deleted";
            }
        }

        [HttpGet]
        [Route("SearchMovies/{movieSearchTerm}")]
        public async Task<IActionResult> SearchMovies(string movieSearchTerm)
        {
            List<Movie> movieSearchResult = new List<Movie>();

            movieSearchResult = _db.movies.Where(movie => movie.MovieName.Contains(movieSearchTerm)).ToList();

            return Ok(movieSearchResult);
        }

        [HttpGet]
        [Route("GetMoviesByGenre/{genre}")]
        public async Task<ActionResult<IEnumerable>> GetMovieByGenre(string genre)
        {
            List<Movie> moviesByGenre = new List<Movie>();

            moviesByGenre = _db.movies
                .Where(x=> x.Genre == genre)
                .Take(4)
                .ToList();

            return moviesByGenre;
        }
        

    }
}
