using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext; 

public static class DbInitializer
{
    public static async Task SeenAsync(PlannerContext context)
    {
        if (context.Colours is not null && !context.Colours.Any())
        {
            var colours = new List<Colour>
            {
                new Colour
                {
                    Name = "aqua",
                    HexValue = "#aee2dc"
                },
                new Colour
                {
                    Name = "bright-pink",
                    HexValue = "#ff91e0"
                },
                new Colour
                {
                    Name = "lavender-blue",
                    HexValue = "#bbbef5"
                },
                new Colour
                {
                    Name = "light-mint-green",
                    HexValue = "#c8e7b1"
                },
                new Colour
                {
                    Name = "light-purple",
                    HexValue = "#e0b8f1"
                },
                new Colour
                {
                    Name = "soft-pink",
                    HexValue = "#f8bdbd"
                }
            }; 

            await context.Colours.AddRangeAsync(colours);
            await context.SaveChangesAsync();
        }
    }

}
