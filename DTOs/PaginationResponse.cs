namespace CompetitionsTest.DTOs
{
    public class PaginationResponse<T>
    {
        public IEnumerable<T> Items { get; set; } = [];
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int StartFrom { get; set; }
        public int EndTo { get; set; }
    }
}
