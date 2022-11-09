namespace API.Helpers
{
    public class Likesparams: PaginationParams
    {
        public int UserId { get; set; }     
        public string Predicate { get; set; }
    }
}