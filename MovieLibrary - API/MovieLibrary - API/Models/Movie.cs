using System.ComponentModel.DataAnnotations;

namespace MovieLibrary___API.Models
{
    public class Movie
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string MovieName { get; set; }
        public string MovieDetails { get; set; }
        public string Genre { get; set; }
        public string MovieLength { get; set; }
        public bool IsAvailable { get; set; }
        public string ImagePath { get; set; }
        public string MovieRating { get; set; }
        public string ReleaseYear { get; set; }
        public short MoviePrice { get; set; }
    }
}
