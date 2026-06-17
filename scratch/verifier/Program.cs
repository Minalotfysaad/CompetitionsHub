using System;
using Microsoft.AspNetCore.Identity;

namespace Verifier;

public class Program
{
    public static void Main()
    {
        var hasher = new PasswordHasher<object>();
        var hash = "AQAAAAIAAYagAAAAEABMP7FgSo30xsI9+KEVmh53YPK/x4+YuJjJbErUj3JY53iG+Kgc0Gmkw0YJvUVoYQ==";
        var result = hasher.VerifyHashedPassword(new object(), hash, "Test@123");
        Console.WriteLine($"VERIFICATION_RESULT: {result}");
    }
}
