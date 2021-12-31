using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace IdentityService.Helpers
{
    public class ValidationFailedResult : ObjectResult
    {
        public ValidationFailedResult(ModelStateDictionary modelState)
            : base(new ValidationResultModel(modelState))
        {
            StatusCode = StatusCodes.Status422UnprocessableEntity;
        }
    }

    public class ValidationError
    {
        public string? Field { get; }

        public string Message { get; }

        public ValidationError(string field, string message)
        {
            Field = string.IsNullOrEmpty(field) ? null : field;
            Message = message;
        }
    }

    public class ValidationResultModel
    {
        public string Message { get; }

        public List<ValidationError> Errors { get; }

        public ValidationResultModel(ModelStateDictionary modelState)
        {
            Message = "Validation Failed";
            Errors = modelState.Keys
                    .SelectMany(key =>
                    {
                        var errors = modelState[key]?.Errors;
                        return errors == null ?
                            new[] { new ValidationError(string.Empty, string.Empty) } :
                            errors.Select(x => new ValidationError(key, x.ErrorMessage));
                    })
                    .ToList();
        }
    }
}