using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseContext.Types; 

public static class RoleExtensionMethods
{
    public static bool HasHigherPrivilegeThan(this Role role1, Role role2)
    {
        return role1 > role2;
    }

    public static bool IsEqualTo(this Role role1, Role role2)
    {
        return role1 == role2;
    }
}
